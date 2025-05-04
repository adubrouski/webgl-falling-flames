class ShaderSource {
  static VERTEX_SHADER_SOURCE = `
    attribute vec2 a_pos;
    attribute float a_size;
    attribute float a_t;
    
    varying float v_t;
    
    void main() {
      float sz = a_size * (1.0 + 2.0 * (1.0 - abs(0.5 - a_t)));
      
      gl_PointSize = sz;
      gl_Position = vec4(a_pos, 0.0, 1.0);
      
      v_t = a_t;
    }
  `;

  static FRAGMENT_SHADER_SOURCE = `
    precision mediump float;
    
    uniform vec3 u_colorBottom;
    uniform vec3 u_colorTop;
    
    varying float v_t;
    
    void main() {
      float d = distance(gl_PointCoord, vec2(0.5));
      
      if (d > 0.5) discard;
      
      vec3 col = mix(u_colorBottom, u_colorTop, v_t);
      float alpha = smoothstep(0.0, 0.2, v_t) * (1.0 - smoothstep(0.6, 1.0, v_t));
      
      gl_FragColor = vec4(col, alpha);
    }
  `;
}

export { ShaderSource };
