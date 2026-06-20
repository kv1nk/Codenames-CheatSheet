class WordSearch {
  constructor() {
    this.init();
  }

  init() {
    gameChecker.on(
      (checker) => checker.isGamePage === true,
      () => {
        const hideWordsButton = document.querySelector(
          'button.h-9.w-9.rounded-lg.bg-gray-700.hover\\:bg-gray-600.text-gray-300.transition-colors.inline-flex.items-center.justify-center.flex-shrink-0[aria-label="Скрыть слова"]',
        );
        const toolsBox = hideWordsButton.parentElement;
        const searchButton = hideWordsButton.cloneNode(true);

        const svgUrl = chrome.runtime.getURL("media/searchIcon.svg");

        fetch(svgUrl)
          .then((response) => {
            return response.text();
          })
          .then((svgContent) => {
            searchButton.innerHTML = "";

            searchButton.insertAdjacentHTML("beforeend", svgContent);

            const svgElement = searchButton.querySelector("svg");
            if (svgElement) {
              svgElement.removeAttribute("class");
              svgElement.setAttribute("class", "w-5 h-5");

              if (!svgElement.hasAttribute("viewBox")) {
                svgElement.setAttribute("viewBox", "0 0 24 24");
              }
            }

            searchButton.setAttribute("aria-label", "Поиск");
            searchButton.setAttribute("title", "Поиск");

            searchButton.addEventListener("click", () => {
              console.log("Search button clicked");
            });

            toolsBox.insertBefore(searchButton, hideWordsButton);
          });
      },
    );
  }
}

const wordSearch = new WordSearch();
