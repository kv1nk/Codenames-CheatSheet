/**
 * Типы игр
 */
class CodeGameTypes {
  constructor() {
    this.standard = { name: "Стандартный" };
    this.gadgets = { name: "Гаджеты" };
    this.sapper = { name: "Сапёр" };
    this.swapCaptains = { name: "Свап капитанов" };
    this.captainChallenge = { name: "Капитан-челлендж" };
  }

  /**
   * Функция для получения типа игры по названию
   */
  static getType(name) {
    const instance = new CodeGameTypes();

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

/**
 * Класс для определения типа игры
 */
class CodeMode {
  constructor() {
    this.currentGameMode = null;
    this.select = null;
    this.init();
  }

  /**
   * Найти элемент определяющий тип игры
   */
  findSelect() {
    return document.querySelector(
      "span.text-xs.font-semibold.text-gray-400.bg-gray-800\\/80.border.border-gray-700.rounded-full.px-2\\.5.py-1",
    );
  }

  /**
   * Получить тип игры
   */
  getGameMode() {
    if (!this.select) return null;
    return CodeGameTypes.getType(this.select.textContent.trim()) || null;
  }

  /**
   * Обновить тип игры
   */
  updateGameMode() {
    this.currentGameMode = this.getGameMode();
    return this.currentGameMode;
  }

  /**
   * Сбросить состояние
   */
  resetState() {
    this.select = null;
    this.currentGameMode = null;
  }

  /**
   * Инициализировать обновления
   */
  init() {
    gameChecker.on(
      (checker) => checker.isGamePage === true && checker.isStarted === false,
      () => {
        this.select = this.findSelect();
        if (this.select) {
          this.updateGameMode();
          this.initSelectObserver();
        }
      },
    );

    gameChecker.on(
      (checker) => checker.isStarted === true,
      () => {
        if (this.select) {
          this.updateGameMode();
        }
      },
    );

    gameChecker.on(
      (checker) => checker.isGamePage === false,
      () => {
        this.resetState();
      },
    );

    if (gameChecker.isGamePage) {
      this.select = this.findSelect();
      if (this.select) {
        this.updateGameMode();
        this.initSelectObserver();
      }
    }
  }

  /**
   * Следить за обновление типа игры
   */
  initSelectObserver() {
    if (!this.select) return;

    const observer = new MutationObserver(() => {
      if (gameChecker && gameChecker.isStarted) {
        this.updateGameMode();
      }
    });

    observer.observe(this.select, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
}

const codeMode = new CodeMode();
