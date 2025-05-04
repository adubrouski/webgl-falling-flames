class Program {
  #ctx;
  #program;

  constructor(ctx, vertexShader, fragmentShader) {
    this.#ctx = ctx;
    this.#program = ctx.createProgram();

    ctx.attachShader(this.#program, vertexShader);
    ctx.attachShader(this.#program, fragmentShader);

    ctx.linkProgram(this.#program);

    if (!ctx.getProgramParameter(this.#program, ctx.LINK_STATUS)) {
      throw new Error(`Program link error: ${ctx.getProgramInfoLog(this.#program)}`);
    }
  }

  use() {
    this.#ctx.useProgram(this.#program);
  }

  destroy() {
    this.#ctx.deleteProgram(this.#program);
  }

  getAttribLocation(name) {
    return this.#ctx.getAttribLocation(this.#program, name);
  }

  getUniformLocation(name) {
    return this.#ctx.getUniformLocation(this.#program, name);
  }
}

export { Program };
