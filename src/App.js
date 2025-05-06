import { ResizeHandler } from "./Helpers/ResizeHandler.js";
import { GlManager } from "./Helpers/GlManager.js";
import { Program } from "./Entities/Program.js";
import { ParticleSystem } from "./Entities/ParticleSystem.js";
import { ShaderSource } from "./ShaderSource/ShaderSource.js";
import { ShaderManager } from "./Helpers/ShaderManager.js";
import { Utils } from "./Helpers/Utils.js";
import { FrameLoop } from "./Helpers/FrameLoop.js";

const frameLoop = new FrameLoop(60);

/**
 * @param config {Object}
 * @param config.fpsCountViewElement {Element}
 * @param config.settings.flameCount {number}
 * @param config.settings.flameParticleCount {number}
 * @param config.settings.widthRange {[number, number]}
 * @param config.settings.heightRange {[number, number]}
 * @param config.settings.noiseRange {[number, number]}
 * @param config.settings.speedRange {[number, number]}
 * @param config.settings.particleTopColor {[number, number, number]}
 * @param config.settings.particleBottomColor {[number, number, number]}
 *
 * @returns {{destroy:Function}}
 */
const renderApp = (config) => {
  const { fpsCountViewElement, settings } = config;

  let unsubscriber = null;

  const MAX_PARTICLE_COUNT = settings.flameCount * settings.flameParticleCount;

  const { canvas, ctx } = GlManager.getRenderer("canvas");

  ResizeHandler.handle(canvas, ctx);

  ctx.enable(ctx.BLEND);
  ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);

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

  let previousFrameTimestamp = performance.now();

  unsubscriber = frameLoop.subscribe(
    () => runRenderLoop(previousFrameTimestamp),
  )

  const runRenderLoop = (timestamp) => {
    const now = performance.now();
    const deltaTime = Utils.msToSeconds(now - timestamp);

    previousFrameTimestamp = now;

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
  }

  runRenderLoop(performance.now());

  return {
    destroy: () => {
      if (unsubscriber !== null) {
        unsubscriber();
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

export { renderApp };
