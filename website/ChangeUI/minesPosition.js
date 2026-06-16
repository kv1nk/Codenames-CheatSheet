const style = document.createElement("style");
style.textContent = `
  :root {
    --code-span-margin-top: -10px;
    --code-span-margin-left: -10px;
    --code-button-overflow: visible;
  }

  span:has(svg circle[r="7.5"]) {
    margin-top: var(--code-span-margin-top);
    margin-left: var(--code-span-margin-left);
  }

  button:has(svg[viewBox="0 0 24 24"]) {
    overflow: var(--code-button-overflow);
  }
`;
document.head.appendChild(style);

const root = document.documentElement;

function changedMinesPosition(dx, dy, showOut) {
  root.style.setProperty("--code-span-margin-left", dx + "px");
  root.style.setProperty("--code-span-margin-top", dy + "px");
  root.style.setProperty("--code-button-overflow", showOut ? "visible" : "hidden");
}
