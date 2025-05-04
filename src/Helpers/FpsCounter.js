class FpsCounter {
  onUpdate = null;

  constructor() {
    this._frames = 0;
    this._lastUpdate = performance.now();
  }

  update(timestamp) {
    this._frames++;
    if (timestamp - this._lastUpdate >= 1000) {
      const fps = this._frames;
      if (this.onUpdate) {
        this.onUpdate(fps);
      }
      this._frames = 0;
      this._lastUpdate = timestamp;
    }
  }

  reset() {
    this._frames = 0;
    this._lastUpdate = performance.now();
    this.onUpdate = null;
  }
}

export { FpsCounter };
