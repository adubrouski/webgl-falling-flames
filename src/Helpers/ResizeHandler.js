class ResizeHandler {
  /**
   * @param canvas {HTMLCanvasElement}
   * @param ctx {WebGLRenderingContext}
   */
  static #doHandle(canvas, ctx) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.viewport(0, 0, canvas.width, canvas.height);
  }

  /**
   * @param canvas {HTMLCanvasElement}
   * @param ctx {WebGLRenderingContext}
   */
  static handle(canvas, ctx) {
    window.addEventListener("resize", this.#doHandle.bind(null, canvas, ctx));

    this.#doHandle(canvas, ctx);
  }
}

export { ResizeHandler };
