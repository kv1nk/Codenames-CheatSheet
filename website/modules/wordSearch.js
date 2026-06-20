class WordSearch {
  constructor() {
    this.hideWordsButton = null;
    this.toolsBox = null;
    this.searchButton = null;
    this.svgUrl = null;
    this.svgContent = null;
    this.searchButtonSelector =
      'button.h-9.w-9.rounded-lg.bg-gray-700.hover\\:bg-gray-600.text-gray-300.transition-colors.inline-flex.items-center.justify-center.flex-shrink-0[aria-label="Поиск"]';

    this.init();
  }

  initializeElements() {
    this.hideWordsButton = document.querySelector(
      'button.h-9.w-9.rounded-lg.bg-gray-700.hover\\:bg-gray-600.text-gray-300.transition-colors.inline-flex.items-center.justify-center.flex-shrink-0[aria-label="Скрыть слова"]',
    );

    if (!this.hideWordsButton) {
      console.warn("Hide words button not found");
      return false;
    }

    const existingSearchButton = document.querySelector(this.searchButtonSelector);
    if (existingSearchButton) {
      console.log("Search button already exists on the page");
      return false;
    }

    this.toolsBox = this.hideWordsButton.parentElement;
    this.searchButton = this.hideWordsButton.cloneNode(true);
    this.svgUrl = chrome.runtime.getURL("media/searchIcon.svg");

    return true;
  }

  init() {
    gameChecker.on(
      (checker) => checker.isGamePage === true,
      () => {
        if (!this.initializeElements()) {
          return;
        }

        this.fetchAndSetupSearchButton();
      },
    );
  }

  fetchAndSetupSearchButton() {
    fetch(this.svgUrl)
      .then((response) => {
        return response.text();
      })
      .then((svgContent) => {
        this.svgContent = svgContent;
        this.setupSearchButton();
      });
  }

  setupSearchButton() {
    this.searchButton.innerHTML = "";
    this.searchButton.insertAdjacentHTML("beforeend", this.svgContent);

    const svgElement = this.searchButton.querySelector("svg");
    if (svgElement) {
      svgElement.removeAttribute("class");
      svgElement.setAttribute("class", "w-5 h-5");

      if (!svgElement.hasAttribute("viewBox")) {
        svgElement.setAttribute("viewBox", "0 0 24 24");
      }
    }

    this.searchButton.setAttribute("aria-label", "Поиск");
    this.searchButton.setAttribute("title", "Поиск");

    this.searchButton.addEventListener("click", () => {
      click();
    });

    this.toolsBox.insertBefore(this.searchButton, this.hideWordsButton);
  }

  click() {}
}

const wordSearch = new WordSearch();
