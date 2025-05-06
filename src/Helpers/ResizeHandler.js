import { DprManager } from "./DprManager.js";

class ResizeHandler {
  /**
   * @param canvas {HTMLCanvasElement}
   * @param ctx {WebGLRenderingContext}
   */
  static #doHandle(canvas, ctx) {
    ctx.canvas.width = DprManager.toDpr(ctx.canvas.clientWidth);
    ctx.canvas.height = DprManager.toDpr(ctx.canvas.clientHeight);

    ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
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
