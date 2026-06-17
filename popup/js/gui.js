class UserInterface {
  constructor() {
    this.categories = [];
    this.storageKey = "savedSettings";
  }

  addCategory(category) {
    category.ui = this;

    category.elements.forEach((element) => {
      element.ui = this;
      element.category = category;
      this.loadElementValue(element);
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
    if (!element.id) {
      return;
    }

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

    this.categories.forEach((category) => {
      const categoryValues = {};

      category.elements.forEach((element) => {
        if (!element.id) {
          return;
        }

        if (element.value !== element.defaultValue) {
          categoryValues[element.id] = element.value;
        }
      });

      if (Object.keys(categoryValues).length > 0) {
        result[category.name] = categoryValues;
      }
    });

    localStorage.setItem(this.storageKey, JSON.stringify(result));
  }

  getValues() {
    const result = {};

    this.categories.forEach((category) => {
      result[category.name] = category.getValues();
    });

    return result;
  }

  render() {
    const gui = document.getElementById("GUI");

    gui.innerHTML = "";

    this.categories.forEach((category) => {
      category.render(gui);
    });
  }
}

class Category {
  constructor(name) {
    this.name = name;
    this.elements = [];
  }

  addInteractiveElement(element) {
    element.category = this;

    this.elements.push(element);
  }

  getValues() {
    const values = {};

    this.elements.forEach((element) => {
      values[element.name] = element.getValue();
    });

    return values;
  }

  render(container) {
    const categoryContainer = document.createElement("div");

    categoryContainer.className = "category";

    const title = document.createElement("h3");

    title.textContent = this.name;

    categoryContainer.appendChild(title);

    this.elements.forEach((element) => {
      element.render(categoryContainer);
    });

    container.appendChild(categoryContainer);
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

  setValue(value) {
    this.value = value;

    if (this.ui) {
      this.ui.saveSettings();
    }

    if (typeof this.onChange === "function") {
      this.onChange(value, this);
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
  constructor(options) {
    super(options);
  }

  render(container) {
    const wrapper = document.createElement("div");

    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = this.value;

    checkbox.addEventListener("change", () => {
      this.setValue(checkbox.checked);
    });

    label.appendChild(checkbox);
    label.append(this.name);

    wrapper.appendChild(label);

    container.appendChild(wrapper);
  }
}

class Slider extends InteractiveObject {
  constructor(options) {
    super(options);

    this.min = options.min;
    this.max = options.max;
    this.allowInput = options.allowInput ?? false;
  }

  render(container) {
    const wrapper = document.createElement("div");

    const title = document.createElement("div");
    title.textContent = this.name;

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = this.min;
    slider.max = this.max;
    slider.value = this.value;

    wrapper.appendChild(title);

    let numberInput = null;

    if (this.allowInput) {
      numberInput = document.createElement("input");

      numberInput.type = "number";
      numberInput.value = this.value;

      numberInput.addEventListener("input", () => {
        const value = Number(numberInput.value);

        this.setValue(value);
        slider.value = value;
      });

      wrapper.appendChild(numberInput);
      wrapper.appendChild(document.createElement("br"));
    } else {
      const valueLabel = document.createElement("span");
      valueLabel.textContent = this.value;

      slider.addEventListener("input", () => {
        const value = Number(slider.value);

        this.setValue(value);
        valueLabel.textContent = value;
      });

      wrapper.appendChild(valueLabel);
      wrapper.appendChild(document.createElement("br"));
    }

    slider.addEventListener("input", () => {
      const value = Number(slider.value);

      this.setValue(value);

      if (numberInput) {
        numberInput.value = value;
      }
    });

    wrapper.appendChild(slider);

    container.appendChild(wrapper);
  }
}

class DropdownMenu extends InteractiveObject {
  constructor(options) {
    super({
      ...options,
      defaultValue: options.defaultValue ?? options.options?.[0] ?? null,
    });

    this.options = options.options ?? [];
  }

  render(container) {
    const wrapper = document.createElement("div");

    const label = document.createElement("div");
    label.textContent = this.name;

    const select = document.createElement("select");

    this.options.forEach((option) => {
      const optionElement = document.createElement("option");

      optionElement.value = option;
      optionElement.textContent = option;

      if (option === this.value) {
        optionElement.selected = true;
      }

      select.appendChild(optionElement);
    });

    select.addEventListener("change", () => {
      this.setValue(select.value);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);

    container.appendChild(wrapper);
  }
}
