class ErrorHandler {
  /**
   * @param message {string}
   */
  static #doHandle(message) {
    document.body.innerText = message;
  }

  static handle() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error("Global error:", { message, source, lineno, colno, error });

      this.#doHandle(error.message);
    };

    window.onunhandledrejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);

      this.#doHandle(event.reason);
    };
  }
}

export { ErrorHandler };
