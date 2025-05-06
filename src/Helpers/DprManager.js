class DprManager {
  static #DPR = Math.min(window.devicePixelRatio, 2);

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
