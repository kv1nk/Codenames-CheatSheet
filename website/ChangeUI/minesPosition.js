class MineController {
  constructor() {
    this.types = {
      red: { color: "red", className: "bg-board-red" },
      blue: { color: "blue", className: "bg-board-blue" },
    };

    this.initialized = false;
    this.initStyles();
    this.setupGameListener();
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

      button.bg-board-red span:has(svg circle[r="7.5"]) {
        margin-top: var(--red-mine-offset-y);
        margin-left: var(--red-mine-offset-x);
      }

      button.bg-board-red:has(svg[viewBox="0 0 24 24"]) {
        overflow: var(--red-mine-overflow);
      }

      button.bg-board-blue span:has(svg circle[r="7.5"]) {
        margin-top: var(--blue-mine-offset-y);
        margin-left: var(--blue-mine-offset-x);
      }

      button.bg-board-blue:has(svg[viewBox="0 0 24 24"]) {
        overflow: var(--blue-mine-overflow);
      }

      button[data-mine-type="red"] span:has(svg circle[r="7.5"]) {
        margin-top: var(--red-mine-offset-y);
        margin-left: var(--red-mine-offset-x);
      }

      button[data-mine-type="blue"] span:has(svg circle[r="7.5"]) {
        margin-top: var(--blue-mine-offset-y);
        margin-left: var(--blue-mine-offset-x);
      }
    `;
    document.head.appendChild(style);
  }

  setupGameListener() {
    if (gameChecker.isGamePage) {
      this.initialize();
    }

    gameChecker.on(
      (checker) => checker.isGamePage && !this.initialized,
      () => {
        this.initialize();
      },
    );
  }

  initialize() {
    if (this.initialized) return;

    this.red = this.createMineMethods("red");
    this.blue = this.createMineMethods("blue");
    this.initialized = true;
  }

  createMineMethods(type) {
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
        return typeInfo;
      },
    };
  }

  update(typeInfo, offsetX = 0, offsetY = 0, allowOverflow = false) {
    const root = document.documentElement;
    const prefix = typeInfo.color;

    root.style.setProperty(`--${prefix}-mine-offset-x`, offsetX + "px");
    root.style.setProperty(`--${prefix}-mine-offset-y`, offsetY + "px");
    root.style.setProperty(`--${prefix}-mine-overflow`, allowOverflow ? "visible" : "hidden");
  }

  getPosition(typeInfo) {
    const prefix = typeInfo.color;
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    return {
      offsetX: parseFloat(computedStyle.getPropertyValue(`--${prefix}-mine-offset-x`)) || 0,
      offsetY: parseFloat(computedStyle.getPropertyValue(`--${prefix}-mine-offset-y`)) || 0,
      overflow: computedStyle.getPropertyValue(`--${prefix}-mine-overflow`) === "visible",
      type: typeInfo.color,
      color: typeInfo.color,
    };
  }
}

const mineController = new MineController();
