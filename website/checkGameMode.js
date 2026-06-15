class GameType {
  constructor() {
    this.standard = { name: "Стандартный" };
    this.gadgets = { name: "Гаджеты" };
    this.sapper = { name: "Сапёр" };
    this.swapCaptains = { name: "Свап капитанов" };
    this.captainChallenge = { name: "Капитан-челлендж" };
  }

  static getType(name) {
    const instance = new GameType();

    if (instance[name]) {
      return instance[name];
    }

    for (const key in instance) {
      if (instance[key].name === name) {
        return instance[key];
      }
    }

    return null;
  }
}

class GameMode {
  constructor() {
    this.currentGameMode = null;
    this.listenChange = false;
    this.select = document.querySelector(
      "span.text-xs.font-semibold.text-gray-400.bg-gray-800\\/80.border.border-gray-700.rounded-full.px-2\\.5.py-1",
    );
    this.initListener();
  }

  getGameMode() {
    return GameType.getType(this.select.textContent) || null;
  }

  setGameMode() {
    const newGameMode = this.getGameMode();
    this.currentGameMode = newGameMode;
    return newGameMode;
  }

  initListener() {
    if (this.select) {
      const observer = new MutationObserver(() => {
        if (this.listenChange) {
          this.onGameModeChange();
        }
      });

      observer.observe(this.select, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  }

  onGameModeChange() {
    this.currentGameMode = this.getGameMode();
  }
}

const gameMode = new GameMode();
