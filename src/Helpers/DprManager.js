class DprManager {
  static toDpr(value, dpr) {
    return value * dpr;
  }

  static calculateDpr() {
    return Math.min(window.devicePixelRatio, 1);
  }
}

export { DprManager };
