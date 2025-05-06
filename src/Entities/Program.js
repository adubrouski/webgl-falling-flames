class Program {
  /**
   * @type {WebGLRenderingContext}
   */
  #ctx;
  /**
   * @type {WebGLProgram}
   */
  program;
  
  /**
   * @param ctx {WebGLRenderingContext}
   * @param vertexShader {WebGLShader}
   * @param fragmentShader {WebGLShader}
   */
  constructor(ctx, vertexShader, fragmentShader) {
    this.#ctx = ctx;
    this.program = ctx.createProgram();

    ctx.attachShader(this.program, vertexShader);
    ctx.attachShader(this.program, fragmentShader);

    ctx.linkProgram(this.program);

    if (!ctx.getProgramParameter(this.program, ctx.LINK_STATUS)) {
      throw new Error(`Program link error: ${ctx.getProgramInfoLog(this.program)}`);
    }
  }

  use() {
    this.#ctx.useProgram(this.program);
  }

  /**
   * @param name {string}
   *
   * @returns {GLint}
   */
  getAttribLocation(name) {
    return this.#ctx.getAttribLocation(this.program, name);
  }

  /**
   * @param name {string}
   * @param value {Float32List}
   */
  setUniform3fv(name, value) {
    this.#ctx.uniform3fv(
      this.#ctx.getUniformLocation(this.program, name),
      value,
    );
  }
}

export { Program };
