import { FlameCluster } from "./FlameCluster.js";

class ParticleSystem {
  /**
   * @param canvas {HTMLCanvasElement}
   * @param config {Object}
   * @param config.flameCount {number}
   * @param config.particlesCount {number}
   * @param config.widthRange {[number, number]}
   * @param config.heightRange {[number, number]}
   * @param config.noiseRange {[number, number]}
   * @param config.speedRange {[number, number]}
   */
  constructor(canvas, config) {
    this.canvas = canvas;
    this.flameCount = config.flameCount;
    this.particlesCount = config.particlesCount;
    this.widthRange = config.widthRange;
    this.heightRange = config.heightRange;
    this.noiseRange = config.noiseRange;
    this.speedRange = config.speedRange;

    this.clusters = [];

    for (let i = 0; i < this.flameCount; i++) {
      this.clusters.push(
        new FlameCluster(
          canvas,
          {
            particlesCount: this.particlesCount,
            widthRange: this.widthRange,
            heightRange: this.heightRange,
            noiseRange: this.noiseRange,
            speedRange: this.speedRange
          }
        )
      );
    }
  }

  /**
   * @param dt {number}
   */
  update(dt) {
    for (const cluster of this.clusters) {
      cluster.update(dt);
    }
  }

  /**
   * @param positions {Float32Array}
   * @param tArray {Float32Array}
   * @param sizesArr {Float32Array}
   * @returns {number}
   */
  fillBuffers(positions, tArray, sizesArr) {
    let offsetIndex = 0;

    for (const cluster of this.clusters) {
      offsetIndex = cluster.fillBuffers(positions, tArray, offsetIndex);

      const start = offsetIndex - cluster.particlesCount;

      sizesArr.set(cluster.sizes, start);
    }

    return offsetIndex;
  }
}

export { ParticleSystem };
