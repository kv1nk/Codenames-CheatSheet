class BaseElementController {
  constructor(elementType) {
    this.types = {
      red: { color: "red", fillColor: "#EF5350" },
      blue: { color: "blue", fillColor: "#42A5F5" },
    };
    this.elementType = elementType;
    this.initialized = false;
    this.red = null;
    this.blue = null;
  }

  initialize() {
    if (this.initialized) return;

    this.red = this.createElementMethods("red");
    this.blue = this.createElementMethods("blue");
    this.initialized = true;
  }

  createElementMethods(type) {
    const typeInfo = this.types[type];

    return {
      move: (offsetX = 0, offsetY = 0, allowOverflow = false) => {
        if (!this.initialized) return;
        this.update(typeInfo, offsetX, offsetY, allowOverflow);
      },

      get: () => {
        if (!this.initialized) return null;
        return this.getPosition(typeInfo);
      },

      setOverflow: (allowOverflow = false) => {
        if (!this.initialized) return;
        const current = this.getPosition(typeInfo);
        this.update(typeInfo, current.offsetX, current.offsetY, allowOverflow);
      },

      info: () => {
        return { ...typeInfo, type: this.elementType };
      },
    };
  }

  update(typeInfo, offsetX = 0, offsetY = 0, allowOverflow = false) {
    const root = document.documentElement;
    const prefix = typeInfo.color;

    root.style.setProperty(`--${prefix}-${this.elementType}-offset-x`, offsetX + "px");
    root.style.setProperty(`--${prefix}-${this.elementType}-offset-y`, offsetY + "px");
    root.style.setProperty(`--${prefix}-${this.elementType}-overflow`, allowOverflow ? "visible" : "hidden");
  }

  getPosition(typeInfo) {
    const prefix = typeInfo.color;
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    return {
      offsetX: parseFloat(computedStyle.getPropertyValue(`--${prefix}-${this.elementType}-offset-x`)) || 0,
      offsetY: parseFloat(computedStyle.getPropertyValue(`--${prefix}-${this.elementType}-offset-y`)) || 0,
      overflow: computedStyle.getPropertyValue(`--${prefix}-${this.elementType}-overflow`) === "visible",
      type: typeInfo.color,
      color: typeInfo.color,
      elementType: this.elementType,
    };
  }
}

class MineController extends BaseElementController {
  constructor() {
    super("mine");
    this.initStyles();
  }

  initStyles() {
    if (document.getElementById("mine-styles")) return;

    const style = document.createElement("style");
    style.id = "mine-styles";
    style.textContent = `
      :root {
        --red-mine-offset-x: 0px;
        --red-mine-offset-y: 0px;
        --red-mine-overflow: hidden;
        --blue-mine-offset-x: 0px;
        --blue-mine-offset-y: 0px;
        --blue-mine-overflow: hidden;
      }

      /* Ищем мины ТОЛЬКО внутри игрового поля (контейнер с карточками) */
      .grid button.bg-board-red span:has(svg circle[r="7.5"]) {
        margin-top: var(--red-mine-offset-y) !important;
        margin-left: var(--red-mine-offset-x) !important;
      }

      .grid button.bg-board-red:has(svg[viewBox="0 0 24 24"]) {
        overflow: var(--red-mine-overflow) !important;
      }

      .grid button.bg-board-blue span:has(svg circle[r="7.5"]) {
        margin-top: var(--blue-mine-offset-y) !important;
        margin-left: var(--blue-mine-offset-x) !important;
      }

      .grid button.bg-board-blue:has(svg[viewBox="0 0 24 24"]) {
        overflow: var(--blue-mine-overflow) !important;
      }

      /* Для карточек с data-атрибутами */
      .grid button[data-mine-type="red"] span:has(svg circle[r="7.5"]) {
        margin-top: var(--red-mine-offset-y) !important;
        margin-left: var(--red-mine-offset-x) !important;
      }

      .grid button[data-mine-type="blue"] span:has(svg circle[r="7.5"]) {
        margin-top: var(--blue-mine-offset-y) !important;
        margin-left: var(--blue-mine-offset-x) !important;
      }

      .grid button[data-mine-type="red"]:has(svg[viewBox="0 0 24 24"]) {
        overflow: var(--red-mine-overflow) !important;
      }

      .grid button[data-mine-type="blue"]:has(svg[viewBox="0 0 24 24"]) {
        overflow: var(--blue-mine-overflow) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

class TagController extends BaseElementController {
  constructor() {
    super("tag");
    this.initStyles();
  }

  initStyles() {
    if (document.getElementById("tag-styles")) return;

    const style = document.createElement("style");
    style.id = "tag-styles";
    style.textContent = `
      :root {
        --red-tag-offset-x: 0px;
        --red-tag-offset-y: 0px;
        --red-tag-overflow: hidden;
        --blue-tag-offset-x: 0px;
        --blue-tag-offset-y: 0px;
        --blue-tag-overflow: hidden;
      }

      /* Ищем теги ТОЛЬКО внутри карточек в игровом поле */
      .grid .card-reveal .absolute:has(svg g[fill="#EF5350"]) {
        margin-top: var(--red-tag-offset-y) !important;
        margin-left: var(--red-tag-offset-x) !important;
      }

      .grid .card-reveal:has(.absolute svg g[fill="#EF5350"]) {
        overflow: var(--red-tag-overflow) !important;
      }

      .grid .card-reveal .absolute:has(svg g[fill="#42A5F5"]) {
        margin-top: var(--blue-tag-offset-y) !important;
        margin-left: var(--blue-tag-offset-x) !important;
      }

      .grid .card-reveal:has(.absolute svg g[fill="#42A5F5"]) {
        overflow: var(--blue-tag-overflow) !important;
      }

      /* Для rect */
      .grid .card-reveal .absolute:has(svg rect[fill="#EF5350"]) {
        margin-top: var(--red-tag-offset-y) !important;
        margin-left: var(--red-tag-offset-x) !important;
      }

      .grid .card-reveal:has(.absolute svg rect[fill="#EF5350"]) {
        overflow: var(--red-tag-overflow) !important;
      }

      .grid .card-reveal .absolute:has(svg rect[fill="#42A5F5"]) {
        margin-top: var(--blue-tag-offset-y) !important;
        margin-left: var(--blue-tag-offset-x) !important;
      }

      .grid .card-reveal:has(.absolute svg rect[fill="#42A5F5"]) {
        overflow: var(--blue-tag-overflow) !important;
      }

      /* Для path со stroke */
      .grid .card-reveal .absolute:has(svg path[stroke="#EF5350"]) {
        margin-top: var(--red-tag-offset-y) !important;
        margin-left: var(--red-tag-offset-x) !important;
      }

      .grid .card-reveal:has(.absolute svg path[stroke="#EF5350"]) {
        overflow: var(--red-tag-overflow) !important;
      }

      .grid .card-reveal .absolute:has(svg path[stroke="#42A5F5"]) {
        margin-top: var(--blue-tag-offset-y) !important;
        margin-left: var(--blue-tag-offset-x) !important;
      }

      .grid .card-reveal:has(.absolute svg path[stroke="#42A5F5"]) {
        overflow: var(--blue-tag-overflow) !important;
      }

      /* Универсальный селектор */
      .grid .card-reveal .absolute:has(svg [fill="#EF5350"], svg [stroke="#EF5350"]) {
        margin-top: var(--red-tag-offset-y) !important;
        margin-left: var(--red-tag-offset-x) !important;
      }

      .grid .card-reveal:has(.absolute svg [fill="#EF5350"], .absolute svg [stroke="#EF5350"]) {
        overflow: var(--red-tag-overflow) !important;
      }

      .grid .card-reveal .absolute:has(svg [fill="#42A5F5"], svg [stroke="#42A5F5"]) {
        margin-top: var(--blue-tag-offset-y) !important;
        margin-left: var(--blue-tag-offset-x) !important;
      }

      .grid .card-reveal:has(.absolute svg [fill="#42A5F5"], .absolute svg [stroke="#42A5F5"]) {
        overflow: var(--blue-tag-overflow) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

class BoardTagsController {
  constructor() {
    this.mineController = new MineController();
    this.tagController = new TagController();
    this.initialized = false;

    this.initialize();
  }

  initialize() {
    if (this.initialized) return;

    this.mineController.initialize();
    this.tagController.initialize();

    this.initialized = true;
  }

  moveAll(offsetX = 0, offsetY = 0, allowOverflow = false) {
    this.mineController.red.move(offsetX, offsetY, allowOverflow);
    this.mineController.blue.move(offsetX, offsetY, allowOverflow);
    this.tagController.red.move(offsetX, offsetY, allowOverflow);
    this.tagController.blue.move(offsetX, offsetY, allowOverflow);
  }

  resetAll() {
    this.moveAll(0, 0, false);
  }

  getAllPositions() {
    return {
      mines: {
        red: this.mineController.red.get(),
        blue: this.mineController.blue.get(),
      },
      tags: {
        red: this.tagController.red.get(),
        blue: this.tagController.blue.get(),
      },
    };
  }

  get mines() {
    return this.mineController;
  }

  get tags() {
    return this.tagController;
  }
}

const boardController = new BoardTagsController();
