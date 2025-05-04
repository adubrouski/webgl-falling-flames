class Dom {
  static fpsCountViewElement = document.querySelector("#fps-count-view");
  static flamesCountViewElement = document.querySelector("#flames-count-view");
  static particlesCountViewElement = document.querySelector("#particles-count-view");
  static flamesCountInputElement = document.querySelector("#flames-count-input");

  static updateCanvasStats(flameCount, particleCount) {
    this.flamesCountViewElement.innerText = `${flameCount} flames`;
    this.particlesCountViewElement.innerText = `${flameCount * particleCount} particles`;
    this.flamesCountInputElement.value = flameCount;
  }

  static updateCanvasFps(fps) {
    this.fpsCountViewElement.innerText = `${fps} FPS`;
  }
}

export { Dom };
