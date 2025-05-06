import { ResizeHandler } from "./Helpers/ResizeHandler.js";
import { GlManager } from "./Helpers/GlManager.js";
import { Program } from "./Entities/Program.js";
import { ParticleSystem } from "./Entities/ParticleSystem.js";
import { ShaderSource } from "./ShaderSource/ShaderSource.js";
import { ShaderManager } from "./Helpers/ShaderManager.js";
import { ErrorHandler } from "./Helpers/ErrorHandler.js";
import { Utils } from "./Helpers/Utils.js";

const settings = {
  flameCount: 100,
  flameParticleCount: 70,
  widthRange: [20, 35],
  heightRange: [40, 70],
  noiseRange: [10, 15],
  speedRange: [20, 80],
  particleTopColor: [1, 0.5, 0],
  particleBottomColor: [1, 0, 0],
}

ErrorHandler.handle();

/**
 * @type {null|{destroy:Function}}
 */
let currentApp = null;
/**
 * @type {null|number}
 */
let renderTimerId = null;

const flamesCountViewElement = document.querySelector("#flames-count-view");
const flamesCountInputElement = document.querySelector("#flames-count-input");
const fpsCountViewElement = document.querySelector("#fps-count-view");

flamesCountViewElement.innerText = `${settings.flameCount} flames`;
flamesCountInputElement.value = settings.flameCount;

flamesCountInputElement.addEventListener("input", (e) => {
  const flameCount = Number(e.target.value);

  flamesCountViewElement.innerText = `${flameCount} flames`;

  if (renderTimerId !== null) {
    clearTimeout(renderTimerId);
  }

  renderTimerId = setTimeout(
    () => {
      settings.flameCount = flameCount;

      if (currentApp !== null) {
        currentApp.destroy();
      }

      currentApp = renderApp(settings);
    },
    0,
  )
});

const renderApp = (settings) => {
  /**
   * @type {number|null}
   */
  let frameId = null;

  const MAX_PARTICLE_COUNT = settings.flameCount * settings.flameParticleCount;

  const { canvas, ctx } = GlManager.getRenderer("canvas");

  ResizeHandler.handle(canvas, ctx);

  ctx.enable(ctx.BLEND);
  ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);

  const vertexShader = ShaderManager.compileVertex(ctx, ShaderSource.VERTEX_SHADER_SOURCE);
  const fragmentShader = ShaderManager.compileFragment(ctx, ShaderSource.FRAGMENT_SHADER_SOURCE);

  const program = new Program(ctx, vertexShader, fragmentShader);

  program.use();

  program.setUniform3fv(ShaderSource.TOP_COLOR_UNIFORM, settings.particleTopColor);
  program.setUniform3fv(ShaderSource.BOTTOM_COLOR_UNIFORM, settings.particleBottomColor);

  const positionAttrLocation = program.getAttribLocation(ShaderSource.POSITION_ATTRIBUTE);
  const sizeAttrLocation = program.getAttribLocation(ShaderSource.SIZE_ATTRIBUTE);
  const timeAttrLocation = program.getAttribLocation(ShaderSource.TIME_ATTRIBUTE);

  ctx.enableVertexAttribArray(positionAttrLocation);
  ctx.enableVertexAttribArray(sizeAttrLocation);
  ctx.enableVertexAttribArray(timeAttrLocation);

  const positionArray = new Float32Array(MAX_PARTICLE_COUNT * 2);
  const positionBuffer = ctx.createBuffer();

  const timeArray = new Float32Array(MAX_PARTICLE_COUNT);
  const timeBuffer = ctx.createBuffer();

  const sizeArray = new Float32Array(MAX_PARTICLE_COUNT);
  const sizeBuffer = ctx.createBuffer();

  const particleSystem = new ParticleSystem({
    canvas,
    flameCount: settings.flameCount,
    flameParticlesCount: settings.flameParticleCount,
    widthRange: settings.widthRange,
    heightRange: settings.heightRange,
    noiseRange: settings.noiseRange,
    speedRange: settings.speedRange
  });

  let frames = 0;
  let fps = 0;
  let lastFpsUpdate = 0;

  const runRenderLoop = (timestamp) => {
    const now = performance.now();
    const deltaTime = Utils.msToSeconds(now - timestamp);

    frames++;
    if (now - lastFpsUpdate >= 1000) {
      fps = frames;
      frames = 0;
      lastFpsUpdate = now;

      fpsCountViewElement.innerText = `${fps} FPS`;
    }

    particleSystem.update(deltaTime);
    particleSystem.fillBuffers(positionArray, timeArray, sizeArray);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, positionArray, ctx.DYNAMIC_DRAW);
    ctx.vertexAttribPointer(positionAttrLocation, 2, ctx.FLOAT, false, 0, 0);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, sizeBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, sizeArray, ctx.DYNAMIC_DRAW);
    ctx.vertexAttribPointer(sizeAttrLocation, 1, ctx.FLOAT, false, 0, 0);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, timeBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, timeArray, ctx.DYNAMIC_DRAW);
    ctx.vertexAttribPointer(timeAttrLocation, 1, ctx.FLOAT, false, 0, 0);

    ctx.clearColor(0, 0, 0, 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    ctx.drawArrays(ctx.POINTS, 0, MAX_PARTICLE_COUNT);

    frameId = requestAnimationFrame(runRenderLoop.bind(null, now));
  }

  runRenderLoop(performance.now());

  return {
    destroy: () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      ctx.deleteBuffer(positionBuffer);
      ctx.deleteBuffer(sizeBuffer);
      ctx.deleteBuffer(timeBuffer);

      ctx.deleteProgram(program.program);
      ctx.deleteShader(vertexShader);
      ctx.deleteShader(fragmentShader);

      ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
      ctx.useProgram(null);
    },
  };
}

currentApp = renderApp(settings);
