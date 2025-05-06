class DprManager {
  static #DPR = Math.min(window.devicePixelRatio, 1);

  /**
   * @param value {number}
   *
   * @returns {number}
   */
  static toDpr(value) {
    return value * this.#DPR;
  }
}

export { DprManager };
