import { Utils } from "../Helpers/Utils.js";

export class FlameCluster {
  /**
   * @param canvas {HTMLCanvasElement}
   * @param config {Object}
   * @param config.particlesCount {number}
   * @param config.widthRange {[number, number]}
   * @param config.heightRange {[number, number]}
   * @param config.noiseRange {[number, number]}
   * @param config.speedRange {[number, number]}
   */
  constructor(canvas, {
    particlesCount,
    widthRange,
    heightRange,
    noiseRange,
    speedRange
  }) {
    this.canvas = canvas;
    this.particlesCount = particlesCount;
    this.widthRange = widthRange;
    this.heightRange = heightRange;
    this.noiseRange = noiseRange;
    this.speedRange = speedRange;

    this.offsets = new Float32Array(this.particlesCount);
    this.ages = new Float32Array(this.particlesCount);
    this.lives = new Float32Array(this.particlesCount);
    this.phases = new Float32Array(this.particlesCount);
    this.sizes = new Float32Array(this.particlesCount);

    this.centerX = 0;
    this.baseY = 0;
    this.speed = 0;
    this.width = 0;
    this.height = 0;
    this.noiseAmp = 0;

    this.initCluster();
  }

  initCluster() {
    const { widthRange, heightRange, noiseRange, speedRange, particlesCount } = this;

    this.centerX = Math.random() * this.canvas.width;
    this.baseY = Math.random() * (this.canvas.height + this.height) - this.height;
    this.speed = Utils.getRandomInRange(speedRange);
    this.width = Utils.getRandomInRange(widthRange);
    this.height = Utils.getRandomInRange(heightRange);
    this.noiseAmp = Utils.getRandomInRange(noiseRange);

    for (let i = 0; i < particlesCount; i++) {
      this.offsets[i] = Math.random() * this.width - this.width * 0.5;
      this.lives[i] = 0.8 + Math.random() * 1.2;
      this.ages[i] = Math.random() * this.lives[i];
      this.phases[i] = Math.random() * Math.PI * 2;
      this.sizes[i] = 2 + Math.random() * 3;
    }
  }

  /**
   * @param dt {number}
   */
  update(dt) {
    this.baseY += this.speed * dt;

    if (this.baseY > this.canvas.height + this.height) {
      this.initCluster();
      this.baseY = -this.height;
    }

    for (let i = 0; i < this.particlesCount; i++) {
      this.ages[i] += dt;
      if (this.ages[i] >= this.lives[i]) {
        this.offsets[i] = Math.random() * this.width - this.width * 0.5;
        this.lives[i] = 0.8 + Math.random() * 1.2;
        this.ages[i] = 0;
        this.phases[i] = Math.random() * Math.PI * 2;
        this.sizes[i] = 2 + Math.random() * 3;
      }
    }
  }

  /**
   * @param outPositions {Float32Array}
   * @param outT {Float32Array}
   * @param offsetIndex {number}
   * @returns {number}
   */
  fillBuffers(outPositions, outT, offsetIndex) {
    const h = this.height;
    const cx = this.centerX;
    const by = this.baseY;
    const now = performance.now();

    for (let i = 0; i < this.particlesCount; i++) {
      const t = Math.min(this.ages[i] / this.lives[i], 1);

      const x = cx + this.offsets[i] * (1 - t)
        + Math.sin(now * 0.001 + this.phases[i]) * this.noiseAmp * (1 - t);
      const y = by - t * h;

      outPositions[2 * offsetIndex] = (x / this.canvas.width) * 2 - 1;
      outPositions[2 * offsetIndex + 1] = (1 - y / this.canvas.height) * 2 - 1;
      outT[offsetIndex] = t;

      offsetIndex++;
    }

    return offsetIndex;
  }
}
