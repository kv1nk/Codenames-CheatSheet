class Scroll {
  constructor() {
    this.disableScroll = false;
    this.disableScrollCheck();
  }
  disableScrollCheck(isDisable = false) {
    document.addEventListener(
      "wheel",
      (e) => {
        if (!this.disableScroll && gameChecker.isGamePage) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      },
      {
        passive: false,
        capture: true,
      },
    );
  }
}
