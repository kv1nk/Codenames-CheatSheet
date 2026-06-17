class UserInterface {
  constructor() {
    this.categories = [];
    this.storageKey = "savedSettings";
  }

  addCategory(category) {
    category.ui = this;

    category.elements.forEach((el) => {
      el.ui = this;
      el.category = category;
      this.loadElementValue(el);
    });

    this.categories.push(category);
  }

  getSavedSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || "{}");
    } catch {
      return {};
    }
  }

  loadElementValue(element) {
    if (!element.id) return;

    const settings = this.getSavedSettings();
    const categoryData = settings[element.category?.name];

    if (categoryData && Object.prototype.hasOwnProperty.call(categoryData, element.id)) {
      element.value = categoryData[element.id];

      if (element.callOnLoad && element.value !== element.defaultValue) {
        element.triggerChange();
      }
    }
  }

  saveSettings() {
    const result = {};

    this.categories.forEach((cat) => {
      const values = {};

      cat.elements.forEach((el) => {
        if (!el.id) return;

        if (el.value !== el.defaultValue) {
          values[el.id] = el.value;
        }
      });

      if (Object.keys(values).length) {
        result[cat.name] = values;
      }
    });

    localStorage.setItem(this.storageKey, JSON.stringify(result));
  }

  getValues() {
    const res = {};

    this.categories.forEach((cat) => {
      res[cat.name] = cat.getValues();
    });

    return res;
  }

  render() {
    const gui = document.getElementById("GUI");
    gui.innerHTML = "";

    this.categories.forEach((cat) => cat.render(gui));
  }
}

class Category {
  constructor(name, opened = false) {
    this.name = name;
    this.opened = opened;
    this.elements = [];
  }

  addInteractiveElement(el) {
    el.category = this;
    this.elements.push(el);
    return this;
  }

  getValues() {
    const res = {};

    this.elements.forEach((el) => {
      res[el.name] = el.getValue();
    });

    return res;
  }

  render(container) {
    const wrapper = document.createElement("div");
    wrapper.className = "category";

    const header = document.createElement("button");
    header.className = "category-header";

    const title = document.createElement("span");
    title.textContent = this.name;

    const arrow = document.createElement("span");
    arrow.className = "category-arrow";
    arrow.textContent = "▼";

    const content = document.createElement("div");
    content.className = "category-content";

    if (this.opened) {
      content.classList.add("open");
      arrow.classList.add("open");
    }

    header.append(title, arrow);

    header.addEventListener("click", () => {
      content.classList.toggle("open");
      arrow.classList.toggle("open");
    });

    this.elements.forEach((el) => {
      el.render(content);
    });

    wrapper.append(header, content);
    container.appendChild(wrapper);
  }
}

class InteractiveObject {
  constructor({ id = null, name, defaultValue = null, onChange = null, callOnLoad = true }) {
    this.id = id;
    this.name = name;
    this.value = defaultValue;
    this.defaultValue = defaultValue;
    this.onChange = onChange;
    this.callOnLoad = callOnLoad;
  }

  setValue(v) {
    this.value = v;

    if (this.ui) this.ui.saveSettings();

    if (typeof this.onChange === "function") {
      this.onChange(v, this);
    }
  }

  triggerChange() {
    if (typeof this.onChange === "function") {
      this.onChange(this.value, this);
    }
  }

  getValue() {
    return this.value;
  }
}

class Toggle extends InteractiveObject {
  render(container) {
    const row = document.createElement("div");
    row.className = "setting-row";

    const label = document.createElement("span");
    label.className = "setting-label";
    label.textContent = this.name;

    const sw = document.createElement("label");
    sw.className = "switch";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = this.value;

    const slider = document.createElement("span");
    slider.className = "switch-slider";

    input.addEventListener("change", () => {
      this.setValue(input.checked);
    });

    sw.append(input, slider);
    row.append(label, sw);
    container.appendChild(row);
  }
}

class Slider extends InteractiveObject {
  constructor(options) {
    super(options);

    this.min = options.min;
    this.max = options.max;
    this.step = options.step ?? 1;
    this.allowInput = options.allowInput ?? false;
  }

  render(container) {
    const wrapper = document.createElement("div");
    wrapper.className = "slider-wrapper";

    const header = document.createElement("div");
    header.className = "slider-header";

    const title = document.createElement("span");
    title.textContent = this.name;

    header.append(title);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "slider-input";
    slider.min = this.min;
    slider.max = this.max;
    slider.step = this.step;
    slider.value = this.value;

    let numberInput = null;
    let valueLabel = null;

    if (this.allowInput) {
      numberInput = document.createElement("input");
      numberInput.className = "slider-number";
      numberInput.type = "number";
      numberInput.value = this.value;

      header.append(numberInput);

      numberInput.addEventListener("input", () => {
        const v = Number(numberInput.value);
        slider.value = v;
        this.setValue(v);
      });
    } else {
      valueLabel = document.createElement("span");
      valueLabel.className = "slider-value";
      valueLabel.textContent = this.value;

      header.append(valueLabel);
    }

    slider.addEventListener("input", () => {
      const v = Number(slider.value);

      if (numberInput) numberInput.value = v;
      if (valueLabel) valueLabel.textContent = v;

      this.setValue(v);
    });

    wrapper.append(header, slider);
    container.appendChild(wrapper);
  }
}

class DropdownMenu extends InteractiveObject {
  constructor(options) {
    super({
      ...options,
      defaultValue: options.defaultValue ?? options.options?.[0],
    });

    this.options = options.options ?? [];
  }

  render(container) {
    const row = document.createElement("div");
    row.className = "setting-row";

    const label = document.createElement("span");
    label.className = "setting-label";
    label.textContent = this.name;

    const select = document.createElement("select");
    select.className = "setting-select";

    this.options.forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      if (opt === this.value) o.selected = true;
      select.appendChild(o);
    });

    select.addEventListener("change", () => {
      this.setValue(select.value);
    });

    row.append(label, select);
    container.appendChild(row);
  }
}
