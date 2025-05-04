import { DprManager } from "./DprManager.js";
import { Utils } from "./Utils.js";

class ResizeHandler {
  static #DPR = DprManager.calculateDpr();

  static #doHandle(canvas, ctx, effect) {
    ctx.canvas.width = DprManager.toDpr(ctx.canvas.clientWidth, this.#DPR);
    ctx.canvas.height = DprManager.toDpr(ctx.canvas.clientHeight, this.#DPR);

    ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);

    effect();
  }

  static handle(canvas, ctx, effect) {
    window.addEventListener("resize", this.#doHandle.bind(this, canvas, ctx, effect));

    this.#doHandle(canvas, ctx, effect);
  }
}

export { ResizeHandler };
