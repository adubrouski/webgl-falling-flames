class Utils {
  /**
   * @param range {[number, number]}
   * @returns {number}
   */
  static getRandomInRange([min, max]) {
    return min + Math.random() * (max - min);
  }
}

export { Utils };
