class InteractiveObject {
    constructor(name) {
        this.name = name;
    }

    render(container) {
        throw new Error(
            `${this.constructor.name}: render() must be implemented`
        );
    }

    getValue() {
        return null;
    }
}

class Toggle extends InteractiveObject {
    constructor(name, defaultValue = false) {
        super(name);

        this.value = defaultValue;
    }

    render(container) {
        const wrapper = document.createElement("div");

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = this.value;

        checkbox.addEventListener("change", () => {
            this.value = checkbox.checked;
        });

        label.appendChild(checkbox);
        label.append(` ${this.name}`);

        wrapper.appendChild(label);

        container.appendChild(wrapper);
    }

    getValue() {
        return this.value;
    }
}

class Slider extends InteractiveObject {
    constructor(name, min, max, defaultValue) {
        super(name);

        this.min = min;
        this.max = max;
        this.value = defaultValue;
    }

    render(container) {
        const wrapper = document.createElement("div");

        const title = document.createElement("div");
        title.textContent = this.name;

        const valueLabel = document.createElement("span");
        valueLabel.textContent = this.value;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = this.min;
        slider.max = this.max;
        slider.value = this.value;

        slider.addEventListener("input", () => {
            this.value = Number(slider.value);
            valueLabel.textContent = this.value;
        });

        wrapper.appendChild(title);
        wrapper.appendChild(valueLabel);
        wrapper.appendChild(document.createElement("br"));
        wrapper.appendChild(slider);

        container.appendChild(wrapper);
    }

    getValue() {
        return this.value;
    }
}

class DropdownMenu extends InteractiveObject {
    constructor(name, options = []) {
        super(name);

        this.options = options;
        this.value = options.length > 0
            ? options[0]
            : null;
    }

    render(container) {
        const wrapper = document.createElement("div");

        const label = document.createElement("div");
        label.textContent = this.name;

        const select = document.createElement("select");

        this.options.forEach(option => {
            const optionElement =
                document.createElement("option");

            optionElement.value = option;
            optionElement.textContent = option;

            select.appendChild(optionElement);
        });

        select.addEventListener("change", () => {
            this.value = select.value;
        });

        wrapper.appendChild(label);
        wrapper.appendChild(select);

        container.appendChild(wrapper);
    }

    getValue() {
        return this.value;
    }
}

class Category {
    constructor(name) {
        this.name = name;
        this.elements = [];
    }

    addInteractiveElement(element) {
        if (!(element instanceof InteractiveObject)) {
            throw new Error(
                "Element must inherit InteractiveObject"
            );
        }

        this.elements.push(element);
    }

    getValues() {
        const values = {};

        this.elements.forEach(element => {
            values[element.name] =
                element.getValue();
        });

        return values;
    }

    render(container) {
        const categoryContainer =
            document.createElement("div");

        categoryContainer.className =
            "category";

        const title =
            document.createElement("h3");

        title.textContent = this.name;

        categoryContainer.appendChild(title);

        this.elements.forEach(element => {
            element.render(categoryContainer);
        });

        container.appendChild(categoryContainer);
    }
}

class UserInterface {
    constructor() {
        this.categories = [];
    }

    addCategory(category) {
        this.categories.push(category);
    }

    getValues() {
        const result = {};

        this.categories.forEach(category => {
            result[category.name] =
                category.getValues();
        });

        return result;
    }

    render() {
        const gui =
            document.getElementById("GUI");

        if (!gui) {
            throw new Error(
                'Element with id="GUI" not found'
            );
        }

        gui.innerHTML = "";

        this.categories.forEach(category => {
            category.render(gui);
        });
    }
}

/* ===========================
   ПРИМЕР ИСПОЛЬЗОВАНИЯ
=========================== */

const graphics = new Category(
    "Graphics"
);

const shadows = new Toggle(
    "Enable shadows",
    true
);

const brightness = new Slider(
    "Brightness",
    0,
    100,
    50
);

const quality = new DropdownMenu(
    "Quality",
    [
        "Low",
        "Medium",
        "High"
    ]
);

graphics.addInteractiveElement(
    shadows
);

graphics.addInteractiveElement(
    brightness
);

graphics.addInteractiveElement(
    quality
);

const ui = new UserInterface();

ui.addCategory(graphics);

ui.render();

/* Для проверки */

window.ui = ui;

console.log(
    ui.getValues()
);