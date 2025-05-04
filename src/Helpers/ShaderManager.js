class ShaderManager {
  static #doCompile(ctx, source, type) {
    const shader = ctx.createShader(type);

    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);

    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
      throw new Error(`Shader compilation error: ${ctx.getShaderInfoLog(shader)}`);
    }

    return shader;
  }

  static compileVertex(ctx, source) {
    return this.#doCompile(ctx, source, ctx.VERTEX_SHADER)
  }

  static compileFragment(ctx, source) {
    return this.#doCompile(ctx, source, ctx.FRAGMENT_SHADER)
  }
}

export { ShaderManager };
