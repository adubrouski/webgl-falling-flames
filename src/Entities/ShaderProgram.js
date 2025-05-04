class ShaderProgram {
  /**
   * @type {WebGLRenderingContext}
   */
  #ctx;
  /**
   * @type {WebGLProgram}
   */
  #program;
  /**
   * @type {Map<string, GLint>}
   */
  #attrLocations = new Map();
  /**
   * @type {Map<string, WebGLUniformLocation>}
   */
  #uniformLocations = new Map();
  
  /**
   * @param ctx {WebGLRenderingContext}
   * @param vsSource {string} — код вершинного шейдера GLSL
   * @param fsSource {string} — код фрагментного шейдера GLSL
   */
  constructor(ctx, vsSource, fsSource) {
    this.#ctx = ctx;
    this.#program = ctx.createProgram();

    ctx.attachShader(this.#program, this.#compileShader(vsSource, ctx.VERTEX_SHADER));
    ctx.attachShader(this.#program, this.#compileShader(fsSource, ctx.FRAGMENT_SHADER));

    ctx.linkProgram(this.#program);

    if (!ctx.getProgramParameter(this.#program, ctx.LINK_STATUS)) {
      throw new Error(`Program link error: ${ctx.getProgramInfoLog(this.#program)}`);
    }
  }

  use() {
    this.#ctx.useProgram(this.#program);
  }

  /**
   * @param name {string}
   * @returns {GLint}
   */
  getAttribLocation(name) {
    if (!this.#attrLocations.has(name)) {
      this.#attrLocations.set(name, this.#ctx.getAttribLocation(this.#program, name));
    }

    return this.#attrLocations.get(name);
  }

  /**
   * @param name {string}
   * @param value {Float32List}
   */
  setUniform3fv(name, value) {
    this.#ctx.uniform3fv(this.#getUniformLocation(name), value);
  }

  /**
   * @param name {string}
   * @returns {WebGLUniformLocation}
   */
  #getUniformLocation(name) {
    if (!this.#uniformLocations.has(name)) {
      this.#uniformLocations.set(name, this.#ctx.getUniformLocation(this.#program, name));
    }

    return this.#uniformLocations.get(name);
  }

  /**
   * @param src {string}
   * @param type {GLenum}
   * @returns {WebGLShader}
   */
  #compileShader(src, type) {
    const shader = this.#ctx.createShader(type);

    this.#ctx.shaderSource(shader, src);
    this.#ctx.compileShader(shader);

    if (!this.#ctx.getShaderParameter(shader, this.#ctx.COMPILE_STATUS)) {
      throw new Error(`Shader compilation error: ${this.#ctx.getShaderInfoLog(shader)}`);
    }

    return shader;
  }
}

export { ShaderProgram };
