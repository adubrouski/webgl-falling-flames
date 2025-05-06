import { Utils } from "../Helpers/Utils.js";
import { DprManager } from "../Helpers/DprManager.js";

class Flame {
  /**
   * @type {number}
   */
  particlesCount;
  /**
   * @type {Float32Array}
   */
  sizes;
  
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas;
  /**
   * @type {[number, number]}
   */
  #widthRange;
  /**
   * @type {[number, number]}
   */
  #heightRange;
  /**
   * @type {[number, number]}
   */
  #noiseRange;
  /**
   * @type {[number, number]}
   */
  #speedRange;
  /**
   * @type {Float32Array}
   */
  #offsets;
  /**
   * @type {Float32Array}
   */
  #ages;
  /**
   * @type {Float32Array}
   */
  #lives;
  /**
   * @type {Float32Array}
   */
  #sinPhases;
  /**
   * @type {Float32Array}
   */
  #cosPhases;
  /**
   * @type {number}
   */
  #centerX = 0;
  /**
   * @type {number}
   */
  #baseY = 0;
  /**
   * @type {number}
   */
  #speed = 0;
  /**
   * @type {number}
   */
  #width = 0;
  /**
   * @type {number}
   */
  #height = 0;
  /**
   * @type {number}
   */
  #noiseAmp = 0;
  
  /**
   * @param config {Object}
   * @param config.canvas {HTMLCanvasElement}
   * @param config.particlesCount {number}
   * @param config.widthRange {[number, number]}
   * @param config.heightRange {[number, number]}
   * @param config.noiseRange {[number, number]}
   * @param config.speedRange {[number, number]}
   */
  constructor(config) {
    this.particlesCount = config.particlesCount;
    this.#canvas = config.canvas;
    this.#widthRange = config.widthRange;
    this.#heightRange = config.heightRange;
    this.#noiseRange = config.noiseRange;
    this.#speedRange = config.speedRange;

    this.sizes = new Float32Array(this.particlesCount);
    this.#offsets = new Float32Array(this.particlesCount);
    this.#ages = new Float32Array(this.particlesCount);
    this.#lives = new Float32Array(this.particlesCount);
    this.#sinPhases = new Float32Array(this.particlesCount);
    this.#cosPhases = new Float32Array(this.particlesCount);

    this.#init();
  }

  /**
   * @param deltaTime {number}
   */
  update(deltaTime) {
    this.#baseY += this.#speed * deltaTime;

    if (this.#baseY > this.#canvas.height + this.#height) {
      this.#init();

      this.#baseY = -this.#height;
    }

    for (let i = 0; i < this.particlesCount; i++) {
      this.#ages[i] += deltaTime;

      if (this.#ages[i] >= this.#lives[i]) {
        this.#offsets[i] = (Math.random() * this.#width) - (this.#width * 0.5);
        this.#lives[i] = 0.8 + (Math.random() * 1.2);
        this.#ages[i] = 0;
        this.sizes[i] = DprManager.toDpr(2 + (Math.random() * 3));
      }
    }
  }

  /**
   * @param positionArray {Float32Array}
   * @param timeArray {Float32Array}
   * @param offset {number}
   */
  fillBuffers(positionArray, timeArray, offset) {
    const now = Utils.msToSeconds(performance.now());
    const invW = 1 / this.#canvas.width;
    const invH = 1 / this.#canvas.height;

    const sinNow = Math.sin(now);
    const cosNow = Math.cos(now);

    for (let i = 0; i < this.particlesCount; i++) {
      const t = Math.min(this.#ages[i] / this.#lives[i], 1);
      const oneMinusT = 1 - t;
      const doubleOffset = 2 * offset;

      const sinSum = sinNow * this.#cosPhases[i] + cosNow * this.#sinPhases[i];

      const x = this.#centerX +
        (this.#offsets[i] * oneMinusT + sinSum * this.#noiseAmp * oneMinusT);
      const y = this.#baseY - (t * this.#height);

      positionArray[doubleOffset] = (x * invW) * 2 - 1;
      positionArray[doubleOffset + 1] = (1 - y * invH) * 2 - 1;

      timeArray[offset] = t;

      offset++;
    }
  }


  #init() {
    this.#centerX = Math.random() * this.#canvas.width;
    this.#baseY = Math.random() * (this.#canvas.height + this.#height) - this.#height;
    this.#speed = DprManager.toDpr(Utils.getRandomInRange(this.#speedRange));
    this.#width = DprManager.toDpr(Utils.getRandomInRange(this.#widthRange));
    this.#height = DprManager.toDpr(Utils.getRandomInRange(this.#heightRange));
    this.#noiseAmp = Utils.getRandomInRange(this.#noiseRange);

    for (let i = 0; i < this.particlesCount; i++) {
      this.#offsets[i] = Math.random() * this.#width - this.#width * 0.5;
      this.#lives[i] = 0.8 + Math.random() * 1.2;
      this.#ages[i] = Math.random() * this.#lives[i];

      const phase = Math.random() * Math.PI * 2;
      this.#sinPhases[i] = Math.sin(phase);
      this.#cosPhases[i] = Math.cos(phase);

      this.sizes[i] = DprManager.toDpr(2 + Math.random() * 3);
    }
  }

}

export { Flame };
