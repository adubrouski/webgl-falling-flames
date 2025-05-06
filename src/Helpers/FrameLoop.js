class FrameLoop {
  oneFrameMs;
  msCounter;
  subscribers = new Set();
  prevTimestamp = 0;

  constructor(fps) {
    this.oneFrameMs = 1000 / fps;
    this.msCounter = 0;

    this.#startLoop(0);
  }

  subscribe(callback) {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  #play(delta, timestamp) {
    this.msCounter += delta;

    if (this.msCounter > this.oneFrameMs) {
      this.msCounter = this.msCounter % this.oneFrameMs;

      this.subscribers.forEach(
        (it) => it(timestamp),
      );
    }
  }

  #startLoop(timestamp) {
    const delta = (timestamp - this.prevTimestamp);

    this.prevTimestamp = timestamp;

    this.#play(delta, timestamp);

    requestAnimationFrame(this.#startLoop.bind(this));
  }
}

export { FrameLoop };
