class ShaderSource {
  static POSITION_OFFSET_X_ATTRIBUTE = "a_offsetX";
  static PHASE_ATTRIBUTE = "a_phase";
  static SIZE_ATTRIBUTE = "a_size";
  static TIME_ATTRIBUTE = "a_t";

  static CENTER_X_ATTRIBUTE = "a_centerX";
  static BASE_Y_ATTRIBUTE = "a_baseY";
  static HEIGHT_ATTRIBUTE = "a_height";
  static NOISE_AMP_ATTRIBUTE = "a_noiseAmp";

  static TIME_VARYING = "v_t";

  static UNIFORM_NOW = "u_now";
  static UNIFORM_CANVAS_SIZE = "u_canvasSize";

  static TOP_COLOR_UNIFORM = "u_colorTop";
  static BOTTOM_COLOR_UNIFORM = "u_colorBottom";

  static VERTEX_SHADER_SOURCE = `
    attribute float ${this.POSITION_OFFSET_X_ATTRIBUTE};
    attribute float ${this.PHASE_ATTRIBUTE};
    attribute float ${this.SIZE_ATTRIBUTE};
    attribute float ${this.TIME_ATTRIBUTE};

    attribute float ${this.CENTER_X_ATTRIBUTE};
    attribute float ${this.HEIGHT_ATTRIBUTE};
    attribute float ${this.NOISE_AMP_ATTRIBUTE};
    attribute float ${this.BASE_Y_ATTRIBUTE};

    uniform float ${this.UNIFORM_NOW};
    uniform vec2 ${this.UNIFORM_CANVAS_SIZE};

    varying float ${this.TIME_VARYING};

    void main() {
      float sinSum = sin((${this.UNIFORM_NOW} * 0.001) + ${this.PHASE_ATTRIBUTE});

      float offsetXWithNoise = (${this.POSITION_OFFSET_X_ATTRIBUTE} + sinSum * ${this.NOISE_AMP_ATTRIBUTE}) * (1.0 - ${this.TIME_ATTRIBUTE});

      float x = ${this.CENTER_X_ATTRIBUTE} + offsetXWithNoise;
      float y = ${this.BASE_Y_ATTRIBUTE} - ${this.TIME_ATTRIBUTE} * ${this.HEIGHT_ATTRIBUTE};

      float invW = 1.0 / ${this.UNIFORM_CANVAS_SIZE}.x;
      float invH = 1.0 / ${this.UNIFORM_CANVAS_SIZE}.y;
      float scaleW = 2.0 * invW;

      gl_Position = vec4(x * scaleW - 1.0, (1.0 - y * invH) * 2.0 - 1.0, 0.0, 1.0);
      gl_PointSize = (${this.SIZE_ATTRIBUTE} * 5.0) * mix(2.0, 3.0, 1.0 - abs(2.0 * ${this.TIME_ATTRIBUTE} - 1.0));

      ${this.TIME_VARYING} = ${this.TIME_ATTRIBUTE};
    }
  `.trim();

  static FRAGMENT_SHADER_SOURCE = `
    precision mediump float;

    uniform vec3 ${this.TOP_COLOR_UNIFORM};
    uniform vec3 ${this.BOTTOM_COLOR_UNIFORM};

    varying float ${this.TIME_VARYING};

    void main() {
      if (distance(gl_PointCoord, vec2(0.5)) > 0.5) {
        discard;
      };

      gl_FragColor = vec4(
        mix(${this.BOTTOM_COLOR_UNIFORM}, ${this.TOP_COLOR_UNIFORM}, ${this.TIME_VARYING}),
        smoothstep(0.0, 0.2, ${this.TIME_VARYING}) * (1.0 - smoothstep(0.6, 1.0, ${this.TIME_VARYING}))
      );
    }
  `.trim();
}

export { ShaderSource };
