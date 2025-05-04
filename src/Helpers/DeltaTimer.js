class DeltaTimer {
  #last;

  constructor() {
    this.#last = performance.now();
  }

  getDelta() {
    const now = performance.now();
    const delta = now - this.#last;
    this.#last = now;
    return delta;
  }

  reset() {
    this.#last = performance.now();
  }
}

export { DeltaTimer };
