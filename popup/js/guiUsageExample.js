/* ===========================
   TOGGLE
=========================== */

const shadows = new Toggle({
  id: "enableShadows",
  name: "Enable shadows",
  defaultValue: true,
  onChange: (value, element) => {
    console.log("Toggle changed");
    console.log("ID:", element.id);
    console.log("Value:", value);
  },
});

/* ===========================
   SLIDER
=========================== */

const brightness = new Slider({
  id: "brightness",
  name: "Brightness",
  min: 0,
  max: 100,
  defaultValue: 50,
  onChange: (value, element) => {
    console.log("Brightness:", value);
  },
});

/* ===========================
   SLIDER С ВВОДОМ ЧИСЛА
=========================== */

const volume = new Slider({
  id: "volume",
  name: "Volume",
  min: 0,
  max: 100,
  defaultValue: 25,
  allowInput: true,
  onChange: (value) => {
    console.log("Volume:", value);
  },
});

/* ===========================
   DROPDOWN
=========================== */

const quality = new DropdownMenu({
  id: "quality",
  name: "Quality",
  options: ["Low", "Medium", "High"],
  defaultValue: "Medium",
  onChange: (value) => {
    console.log("Quality:", value);
  },
});

/* ===========================
   КАТЕГОРИЯ ГРАФИКИ
=========================== */

const graphics = new Category("Graphics");

graphics.addInteractiveElement(shadows);
graphics.addInteractiveElement(brightness);
graphics.addInteractiveElement(volume);
graphics.addInteractiveElement(quality);

/* ===========================
   ЕЩЕ ОДНА КАТЕГОРИЯ
=========================== */

const gameplay = new Category("Gameplay");

gameplay.addInteractiveElement(
  new Toggle({
    id: "showHints",
    name: "Show hints",
    defaultValue: false,
    onChange: (value) => {
      console.log("Hints:", value);
    },
  }),
);

gameplay.addInteractiveElement(
  new DropdownMenu({
    id: "difficulty",
    name: "Difficulty",
    options: ["Easy", "Normal", "Hard", "Nightmare"],
    defaultValue: "Normal",
    onChange: (value) => {
      console.log("Difficulty:", value);
    },
  }),
);

gameplay.addInteractiveElement(
  new Slider({
    id: "enemyCount",
    name: "Enemy count",
    min: 1,
    max: 100,
    defaultValue: 20,
    allowInput: true,
    onChange: (value) => {
      console.log("Enemies:", value);
    },
  }),
);

/* ===========================
   СОЗДАНИЕ UI
=========================== */

const ui = new UserInterface();

ui.addCategory(graphics);
ui.addCategory(gameplay);

ui.render();

/* ===========================
   ПОЛУЧЕНИЕ ВСЕХ ЗНАЧЕНИЙ
=========================== */

console.log(ui.getValues());

/*
{
  Graphics: {
    enableShadows: true,
    brightness: 50,
    volume: 25,
    quality: "Medium"
  },

  Gameplay: {
    showHints: false,
    difficulty: "Normal",
    enemyCount: 20
  }
}
*/

/* ===========================
   ДОСТУП ИЗ КОНСОЛИ
=========================== */

window.ui = ui;

/* ===========================
   ПОЛУЧЕНИЕ ЗНАЧЕНИЙ ПОЗЖЕ
=========================== */

document.getElementById("saveButton")?.addEventListener("click", () => {
  const settings = ui.getValues();

  console.log("Current settings:", settings);

  /*
      Можно отправить на сервер:

      fetch("/save", {
        method: "POST",
        body: JSON.stringify(settings)
      });
    */
});
