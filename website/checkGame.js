class CheckGame {
  constructor() {
    this.isGame = null;
    this.isGamePage = null;
    this.isStarted = false;
    this.listeners = [];
    this.check();
    this.observe();
  }

  check() {
    const wasGame = this.isGame;
    const wasPage = this.isGamePage;

    this.isGame = !!document.querySelector("span.tabular-nums.text-4xl.lg\\:text-7xl.text-gray-300");

    const hasNav = !!document.querySelector("nav.flex.items-center.justify-between");
    const hasCards = !!document.querySelector(".grid.grid-cols-5.gap-1");
    const hasTeams = !!document.querySelector(
      '[class*="bg-red-900"], [class*="bg-blue-900"], [class*="bg-gray-800/30"]',
    );
    const hasLobby =
      !!document.querySelector(".text-gray-500.text-lg") &&
      document.querySelector(".text-gray-500.text-lg")?.textContent?.includes("Waiting");

    this.isGamePage = hasNav && (hasCards || hasTeams || hasLobby);
    if (this.isGame) this.isGamePage = true;

    if (this.isGame === true && this.isGamePage === true) {
      this.isStarted = true;
    }

    if (wasGame === true && this.isGame === false && this.isGamePage === true) {
      this.isStarted = true;
    }

    if (wasPage === true && this.isGamePage === false) {
      this.isStarted = false;
    }
  }

  observe() {
    new MutationObserver(() => {
      const oldGame = this.isGame;
      const oldPage = this.isGamePage;
      const oldStarted = this.isStarted;
      this.check();
      if (oldGame !== this.isGame || oldPage !== this.isGamePage || oldStarted !== this.isStarted) {
        document.dispatchEvent(
          new CustomEvent("gameStateChange", {
            detail: {
              isGame: this.isGame,
              isGamePage: this.isGamePage,
              isStarted: this.isStarted,
            },
          }),
        );
        this.runListeners();
      }
    }).observe(document.body, { childList: true, subtree: true, attributes: true });
  }

  on(condition, callback) {
    this.listeners.push({ condition, callback });
    if (condition(this)) {
      callback(this);
    }
  }

  runListeners() {
    this.listeners.forEach(({ condition, callback }) => {
      if (condition(this)) {
        callback(this);
      }
    });
  }
}

const gameChecker = new CheckGame();
