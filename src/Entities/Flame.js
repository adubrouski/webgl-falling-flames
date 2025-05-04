import { Utils } from "../Helpers/Utils.js";
import { DprManager } from "../Helpers/DprManager.js";

class Flame {
  sharedArrayOffset;

  #dpr;
  #particleCount;
  #centerX;
  #baseY;
  #noiseAmp;
  #width;
  #height;
  #speed;

  #canvasSize;
  #widthRange;
  #heightRange;
  #noiseRange;
  #speedRange;
  
  #ageArray;
  #liveArray;
  #invertedLiveArray;

  #sizeSharedArray;
  #offsetXSharedArray;
  #phaseSharedArray;
  #timeSharedArray;
  #baseYSharedArray;

  constructor(config) {
    this.sharedArrayOffset = config.arrayOffset;

    this.#dpr = config.dpr;
    this.#particleCount = config.particlesCount;

    this.#ageArray = new Float32Array(this.#particleCount);
    this.#liveArray = new Float32Array(this.#particleCount);
    this.#invertedLiveArray = new Float32Array(this.#particleCount);

    this.#sizeSharedArray = config.sharedArrays.sizes;
    this.#offsetXSharedArray = config.sharedArrays.offsets;
    this.#phaseSharedArray = config.sharedArrays.phases;
    this.#timeSharedArray = config.sharedArrays.times;
    this.#baseYSharedArray = config.sharedArrays.baseYArray;

    this.#canvasSize = config.canvas;
    this.#widthRange = config.widthRange;
    this.#heightRange = config.heightRange;
    this.#noiseRange = config.noiseRange;
    this.#speedRange = config.speedRange;

    this.#init(config.dpr);
  }

  static create(config) {
    const flame = new Flame({
      canvas: config.canvas,
      particlesCount: config.particlesCount,
      widthRange: config.widthRange,
      heightRange: config.heightRange,
      noiseRange: config.noiseRange,
      speedRange: config.speedRange,
      sharedArrays: config.sharedArrays,
      arrayOffset: config.offset,
      dpr: config.dpr,
    });

    for (let i = 0; i < flame.#particleCount; i++) {
      const index = config.offset + i;

      config.centerXArray[index] = flame.#centerX;
      config.heightArray[index] = flame.#height;
      config.noiseAmpArray[index] = flame.#noiseAmp;
    }

    return flame;
  }

  update(deltaTime) {
    this.#baseY += this.#speed * deltaTime;

    if (this.#baseY > this.#canvasSize.height + this.#height) {
      this.#init(this.#dpr);

      this.#baseY = -this.#height;
    }

    for (let i = 0; i < this.#particleCount; i++) {
      this.#ageArray[i] += deltaTime;

      const sharedIndex = this.sharedArrayOffset + i;

      this.#timeSharedArray[sharedIndex] = this.#ageArray[i] * this.#invertedLiveArray[i];
      this.#baseYSharedArray[sharedIndex] = this.#baseY;

      if (this.#ageArray[i] >= this.#liveArray[i]) {
        this.#offsetXSharedArray[sharedIndex] = this.#calculateXOffset();
        this.#liveArray[i] = this.#calculateLive();
        this.#invertedLiveArray[i] = 1 / this.#liveArray[i];
        this.#ageArray[i] = 0;
        this.#timeSharedArray[sharedIndex] = 0;
        this.#sizeSharedArray[sharedIndex] = DprManager.toDpr(Math.random(), this.#dpr);
      }
    }
  }

  #init(dpr) {
    this.#centerX = Math.random() * this.#canvasSize.width;
    this.#baseY = Math.random() * this.#canvasSize.height;
    this.#speed = DprManager.toDpr(Utils.getRandomInRange(this.#speedRange), dpr);
    this.#width = DprManager.toDpr(Utils.getRandomInRange(this.#widthRange), dpr);
    this.#height = DprManager.toDpr(Utils.getRandomInRange(this.#heightRange), dpr);
    this.#noiseAmp = Utils.getRandomInRange(this.#noiseRange);

    for (let i = 0; i < this.#particleCount; i++) {
      const sharedIndex = this.sharedArrayOffset + i;

      this.#baseYSharedArray[sharedIndex] = this.#baseY;
      this.#offsetXSharedArray[sharedIndex] = this.#calculateXOffset();
      this.#liveArray[i] = this.#calculateLive();
      this.#invertedLiveArray[i] = 1 / this.#liveArray[i];
      this.#ageArray[i] = Math.random() * this.#liveArray[i];
      this.#timeSharedArray[sharedIndex] = this.#ageArray[i] * this.#invertedLiveArray[i];
      this.#sizeSharedArray[sharedIndex] = DprManager.toDpr(Math.random(), dpr);
      this.#phaseSharedArray[sharedIndex] = Math.random() * Math.PI * 2;
    }
  }

  #calculateXOffset() {
    return (Math.random() * this.#width) - (this.#width * 0.5);
  }

  #calculateLive() {
    return Math.random() + 0.8;
  }
}

export { Flame };
