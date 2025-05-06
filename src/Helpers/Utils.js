class Utils {
  /**
   * @param range {[number, number]}
   * @returns {number}
   */
  static getRandomInRange([min, max]) {
    return min + Math.random() * (max - min);
  }

  /**
   *
   * @param ms {number}
   * @returns {number}
   */
  static msToSeconds(ms) {
    return ms / 1_000;
  }
}

export { Utils };
