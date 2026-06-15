class UserInterface {
    constructor() {}
}

class Category {
    constructor() {}
}

class InteractiveObject {
    constructor(name) {
        this.name = name;
    }

    addEventListeners() {
        // Метод который нужно переопределять везде
    }
    getValue() {
        // Метод который нужно переопределять везде
        return null;
    }
    
}

class DropDownMenu extends InteractiveObject {
    constructor() {}
}

class Toggle extends InteractiveObject {
    constructor() {}
}

const appConfig = []