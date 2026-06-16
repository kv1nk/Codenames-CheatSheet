class Scroll {
  constructor() {
    this.disableScroll = false;
    this.disableScrollCheck();
  }
  disableScrollCheck(isDisable = false) {
    document.addEventListener(
      "wheel",
      (e) => {
        if (!this.disableScroll) {
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
