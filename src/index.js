import { ResizeHandler } from "./Helpers/ResizeHandler.js";
import { GlManager } from "./Helpers/GlManager.js";
import { ShaderProgram } from "./Entities/ShaderProgram.js";
import { ParticleSystem } from "./Entities/ParticleSystem.js";
import { ShaderSource } from "./ShaderSource/ShaderSource.js";

const FLAME_COUNT = 30;
const FLAME_PARTICLES_COUNT = 100;
const WIDTH_RANGE = [10, 20];
const HEIGHT_RANGE = [40, 80];
const NOISE_RANGE = [10, 15];
const SPEED_RANGE = [30, 100];
const COLOR_BOTTOM = [1, 0, 0];
const COLOR_TOP = [1, 0.5, 0];

try {
  const { canvas, ctx } = GlManager.getRenderer("canvas");

  ResizeHandler.handle(canvas, ctx);

  const shader = new ShaderProgram(ctx, ShaderSource.VERTEX_SHADER_SOURCE, ShaderSource.FRAGMENT_SHADER_SOURCE);

  shader.use();
  shader.setUniform3fv("u_colorBottom", COLOR_BOTTOM);
  shader.setUniform3fv("u_colorTop", COLOR_TOP);

  const aPosLoc = shader.getAttribLocation("a_pos");
  const aSizeLoc = shader.getAttribLocation("a_size");
  const aTLoc = shader.getAttribLocation("a_t");

  ctx.enable(ctx.BLEND);
  ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);

  const system = new ParticleSystem(
    canvas,
    {
      flameCount: FLAME_COUNT,
      particlesCount: FLAME_PARTICLES_COUNT,
      widthRange: WIDTH_RANGE,
      heightRange: HEIGHT_RANGE,
      noiseRange: NOISE_RANGE,
      speedRange: SPEED_RANGE
    },
  );

  const maxTotal = FLAME_COUNT * FLAME_PARTICLES_COUNT;
  const positions = new Float32Array(maxTotal * 2);
  const tArray = new Float32Array(maxTotal);
  const sizesArr = new Float32Array(maxTotal);

  const bufPos = ctx.createBuffer();
  const bufSize = ctx.createBuffer();
  const bufT = ctx.createBuffer();

  let lastTime = performance.now();

  const animate = () => {
    const now = performance.now();
    const dt = (now - lastTime) * 0.001;

    lastTime  = now;

    system.update(dt);
    const totalCount = system.fillBuffers(positions, tArray, sizesArr);

    shader.use();

    ctx.bindBuffer(ctx.ARRAY_BUFFER, bufPos);
    ctx.bufferData(ctx.ARRAY_BUFFER, positions, ctx.DYNAMIC_DRAW);
    ctx.enableVertexAttribArray(aPosLoc);
    ctx.vertexAttribPointer(aPosLoc, 2, ctx.FLOAT, false, 0, 0);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, bufSize);
    ctx.bufferData(ctx.ARRAY_BUFFER, sizesArr, ctx.DYNAMIC_DRAW);
    ctx.enableVertexAttribArray(aSizeLoc);
    ctx.vertexAttribPointer(aSizeLoc, 1, ctx.FLOAT, false, 0, 0);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, bufT);
    ctx.bufferData(ctx.ARRAY_BUFFER, tArray, ctx.DYNAMIC_DRAW);
    ctx.enableVertexAttribArray(aTLoc);
    ctx.vertexAttribPointer(aTLoc, 1, ctx.FLOAT, false, 0, 0);

    ctx.clearColor(0, 0, 0, 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    ctx.drawArrays(ctx.POINTS, 0, totalCount);

    requestAnimationFrame(animate);
  }

  animate();
} catch (error) {
  document.body.innerText = error.message;
  throw error;
}
