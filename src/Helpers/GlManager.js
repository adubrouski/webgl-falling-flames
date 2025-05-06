class GlManager {
  /**
   * @param selector
   * @returns {{canvas: HTMLCanvasElement, ctx: WebGLRenderingContext}}
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
