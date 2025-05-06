class ShaderSource {
  static POSITION_ATTRIBUTE = "a_pos";
  static SIZE_ATTRIBUTE = "a_size";
  static TIME_ATTRIBUTE = "a_t";

  static TIME_VARYING = "v_t";

  static TOP_COLOR_UNIFORM = "u_colorTop";
  static BOTTOM_COLOR_UNIFORM = "u_colorBottom";

  static VERTEX_SHADER_SOURCE = `
    attribute vec2 ${this.POSITION_ATTRIBUTE};
    attribute float ${this.SIZE_ATTRIBUTE};
    attribute float ${this.TIME_ATTRIBUTE};
    
    varying float ${this.TIME_VARYING};
    
    void main() {
      gl_PointSize = ${this.SIZE_ATTRIBUTE} * (1.0 + 2.0 * (1.0 - abs(0.5 - ${this.TIME_ATTRIBUTE})));
      gl_Position = vec4(${this.POSITION_ATTRIBUTE}, 0.0, 1.0);
      
      ${this.TIME_VARYING} = ${this.TIME_ATTRIBUTE};
    }
  `.trim();

  static FRAGMENT_SHADER_SOURCE = `
    precision mediump float;
    
    uniform vec3 ${this.TOP_COLOR_UNIFORM};
    uniform vec3 ${this.BOTTOM_COLOR_UNIFORM};
    
    varying float ${this.TIME_VARYING};
    
    void main() {     
      float d = distance(gl_PointCoord, vec2(0.5));
      float alpha = step(d, 0.5);
      
      gl_FragColor = vec4(
      mix(${this.BOTTOM_COLOR_UNIFORM}, ${this.TOP_COLOR_UNIFORM}, ${this.TIME_VARYING}),
       smoothstep(0.0, 0.2, ${this.TIME_VARYING}) * (1.0 - smoothstep(0.6, 1.0, ${this.TIME_VARYING}))
       );
      
      gl_FragColor = vec4(
        mix(${this.BOTTOM_COLOR_UNIFORM}, ${this.TOP_COLOR_UNIFORM}, ${this.TIME_VARYING}),
        smoothstep(0.0, 0.2, ${this.TIME_VARYING}) * (1.0 - smoothstep(0.6, 1.0, ${this.TIME_VARYING}))
      );
    }
  `.trim();
}

export { ShaderSource };
