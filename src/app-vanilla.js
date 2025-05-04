import { Program } from "./Entities/Program.js";
import { ShaderSource } from "./ShaderSource/ShaderSource.js";
import { ShaderManager } from "./Helpers/ShaderManager.js";
import { Utils } from "./Helpers/Utils.js";
import { Flame } from "./Entities/Flame.js";
import { BufferUtils } from "./Helpers/BufferUtils.js";
import { Location } from "./Entities/Location.js";

const renderApp = (config) => {
  const { ctx, canvas, settings, fpsCounter, frameLoop, totalParticleCount, deltaTimer, dpr } = config;

  ctx.enable(ctx.BLEND);
  ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);

  const vertexShader = ShaderManager.compileVertex(ctx, ShaderSource.VERTEX_SHADER_SOURCE);
  const fragmentShader = ShaderManager.compileFragment(ctx, ShaderSource.FRAGMENT_SHADER_SOURCE);

  const program = new Program(ctx, vertexShader, fragmentShader);
  program.use();

  const attrLocation = Location.getAttributes(program);
  const uniformLocation = Location.getUniforms(program);

  ctx.uniform3fv(uniformLocation.TOP_COLOR, settings.particleTopColor);
  ctx.uniform3fv(uniformLocation.BOTTOM_COLOR, settings.particleBottomColor);

  const offsetXArray = new Float32Array(totalParticleCount);
  const phaseArray = new Float32Array(totalParticleCount);
  const centerXArray = new Float32Array(totalParticleCount);
  const heightArray = new Float32Array(totalParticleCount);
  const noiseAmpArray = new Float32Array(totalParticleCount);

  const sizeArray = new Float32Array(totalParticleCount);
  const timeArray = new Float32Array(totalParticleCount);
  const baseYArray = new Float32Array(totalParticleCount);

  const flames = [];

  for (let i = 0; i < settings.flameCount; i++) {
    const offset = i * settings.flameParticleCount;

    flames.push(
      Flame.create({
        canvas,
        offset,
        centerXArray,
        heightArray,
        noiseAmpArray,
        particlesCount: settings.flameParticleCount,
        widthRange: settings.widthRange,
        heightRange: settings.heightRange,
        noiseRange: settings.noiseRange,
        speedRange: settings.speedRange,
        sharedArrays: {
          offsets: offsetXArray,
          phases: phaseArray,
          sizes: sizeArray,
          times: timeArray,
          baseYArray,
        },
        dpr,
      }),
    );
  }

  const offsetXBuffer = BufferUtils.createAndBindBuffer(ctx, offsetXArray, ctx.STATIC_DRAW, attrLocation.OFFSET_X);
  const phaseBuffer = BufferUtils.createAndBindBuffer(ctx, phaseArray, ctx.STATIC_DRAW, attrLocation.PHASE);
  const centerXBuffer = BufferUtils.createAndBindBuffer(ctx, centerXArray, ctx.STATIC_DRAW, attrLocation.CENTER_X);
  const heightBuffer = BufferUtils.createAndBindBuffer(ctx, heightArray, ctx.STATIC_DRAW, attrLocation.HEIGHT);
  const noiseAmpBuffer = BufferUtils.createAndBindBuffer(ctx, noiseAmpArray, ctx.STATIC_DRAW, attrLocation.NOISE_AMP);

  const baseYBuffer = BufferUtils.createAndBindBuffer(ctx, baseYArray, ctx.DYNAMIC_DRAW, attrLocation.BASE_Y);
  const sizeBuffer = BufferUtils.createAndBindBuffer(ctx, sizeArray, ctx.DYNAMIC_DRAW, attrLocation.SIZE);
  const timeBuffer = BufferUtils.createAndBindBuffer(ctx, timeArray, ctx.DYNAMIC_DRAW, attrLocation.TIME);

  const doRenderFrame = (now) => {
    BufferUtils.updateBuffer(ctx, sizeBuffer, sizeArray);
    BufferUtils.updateBuffer(ctx, timeBuffer, timeArray);
    BufferUtils.updateBuffer(ctx, baseYBuffer, baseYArray);

    ctx.uniform1f(uniformLocation.NOW, now);
    ctx.uniform2fv(uniformLocation.CANVAS_SIZE, [canvas.width, canvas.height]);

    ctx.clearColor(0, 0, 0, 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    ctx.drawArrays(ctx.POINTS, 0, totalParticleCount);
  };

  const renderFrame = () => {
    const now = performance.now();

    const delta = Utils.msToSeconds(deltaTimer.getDelta());

    fpsCounter.update(now);

    for (let i = 0; i < flames.length; i++) {
      flames[i].update(delta);
    }

    doRenderFrame(now);
  };

  const frameLoopUnsubscriber = frameLoop.subscribe(renderFrame);

  return {
    destroy: () => {
      frameLoopUnsubscriber();
      deltaTimer.reset();
      fpsCounter.reset();
      program.destroy();

      ctx.deleteBuffer(offsetXBuffer);
      ctx.deleteBuffer(phaseBuffer);
      ctx.deleteBuffer(sizeBuffer);
      ctx.deleteBuffer(timeBuffer);
      ctx.deleteBuffer(centerXBuffer);
      ctx.deleteBuffer(heightBuffer);
      ctx.deleteBuffer(noiseAmpBuffer);
      ctx.deleteBuffer(baseYBuffer);

      ctx.deleteShader(vertexShader);
      ctx.deleteShader(fragmentShader);
      ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
      ctx.useProgram(null);
    },
  };
};

export { renderApp };
