class ShaderManager {
  /**
   * @param ctx {WebGLRenderingContext}
   * @param source {string}
   * @param type {GLenum}
   *
   * @returns {WebGLShader}
   */
  static #doCompile(ctx, source, type) {
    const shader = ctx.createShader(type);

    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);

    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
      throw new Error(`Shader compilation error: ${ctx.getShaderInfoLog(shader)}`);
    }

    return shader;
  }

  /**
   * @param ctx {WebGLRenderingContext}
   * @param source {string}
   *
   * @returns {WebGLShader}
   */
  static compileVertex(ctx, source) {
    return this.#doCompile(ctx, source, ctx.VERTEX_SHADER)
  }

  /**
   * @param ctx {WebGLRenderingContext}
   * @param source {string}
   *
   * @returns {WebGLShader}
   */
  static compileFragment(ctx, source) {
    return this.#doCompile(ctx, source, ctx.FRAGMENT_SHADER)
  }
}

export { ShaderManager };
