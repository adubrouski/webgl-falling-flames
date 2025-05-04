class GlManager {
  /**
   * @param selector {string}
   */
  static getRenderer(selector) {
    const canvas = document.querySelector(selector);
    const ctx = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");

    if (!ctx) {
      throw new Error("WebGL not supported")
    }

    return { canvas, ctx };
  }
}

export { GlManager };
