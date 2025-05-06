import { Flame } from "./Flame.js";
import { Utils } from "../Helpers/Utils.js";

class ParticleSystem {
  /**
   * @type {Flame[]}
   */
  #flames = [];

  /**
   * @param config {Object}
   * @param config.canvas {HTMLCanvasElement}
   * @param config.flameCount {number}
   * @param config.flameParticlesCount {number}
   * @param config.widthRange {[number, number]}
   * @param config.heightRange {[number, number]}
   * @param config.noiseRange {[number, number]}
   * @param config.speedRange {[number, number]}
   */
  constructor(config) {
    for (let i = 0; i < config.flameCount; i++) {
      this.#flames.push(
        new Flame({
          canvas: config.canvas,
          particlesCount: config.flameParticlesCount,
          widthRange: config.widthRange,
          heightRange: config.heightRange,
          noiseRange: config.noiseRange,
          speedRange: config.speedRange
        })
      );
    }
  }

  /**
   * @param deltaTime {number}
   */
  update(deltaTime) {
    for (const cluster of this.#flames) {
      cluster.update(deltaTime);
    }
  }

  /**
   * @param positionArray {Float32Array}
   * @param timeArray {Float32Array}
   * @param sizeArray {Float32Array}
   */
  fillBuffers(positionArray, timeArray, sizeArray) {
    const now = Utils.msToSeconds(performance.now());

    for (let i = 0; i < this.#flames.length; i++) {
      const cluster = this.#flames[i];

      const offset = i * cluster.particlesCount;

      cluster.fillBuffers(positionArray, timeArray, offset, now);

      sizeArray.set(cluster.sizes, offset)
    }
  }
}

export { ParticleSystem };
