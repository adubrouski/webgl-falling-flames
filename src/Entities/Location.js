import {ShaderSource} from "../ShaderSource/ShaderSource.js";

class Location {
  static getAttributes(program) {
    return {
      OFFSET_X: program.getAttribLocation(ShaderSource.POSITION_OFFSET_X_ATTRIBUTE),
      PHASE: program.getAttribLocation(ShaderSource.PHASE_ATTRIBUTE),
      SIZE: program.getAttribLocation(ShaderSource.SIZE_ATTRIBUTE),
      TIME: program.getAttribLocation(ShaderSource.TIME_ATTRIBUTE),
      CENTER_X: program.getAttribLocation(ShaderSource.CENTER_X_ATTRIBUTE),
      HEIGHT: program.getAttribLocation(ShaderSource.HEIGHT_ATTRIBUTE),
      NOISE_AMP: program.getAttribLocation(ShaderSource.NOISE_AMP_ATTRIBUTE),
      BASE_Y: program.getAttribLocation(ShaderSource.BASE_Y_ATTRIBUTE),
    }
  }

  static getUniforms(program) {
    return {
      NOW: program.getUniformLocation(ShaderSource.UNIFORM_NOW),
      CANVAS_SIZE: program.getUniformLocation(ShaderSource.UNIFORM_CANVAS_SIZE),
      TOP_COLOR: program.getUniformLocation(ShaderSource.TOP_COLOR_UNIFORM),
      BOTTOM_COLOR: program.getUniformLocation(ShaderSource.BOTTOM_COLOR_UNIFORM),
    }
  }
}

export { Location };
