class Utils {
  static getRandomInRange([min, max]) {
    return min + Math.random() * (max - min);
  }

  static msToSeconds(ms) {
    return ms * 0.001;
  }

  static debounce(fn, delay) {
    let timer;

    return (...args) => {
      clearTimeout(timer);

      timer = setTimeout(() => fn(...args), delay);
    };
  }
}

export { Utils };
