import { marked } from "marked";
import { createHeader, destroyHeader } from "../../components/Header/Header.js";
import aboutMarkdown from "./about.md?raw";
import "./AboutView.css";

/**
 * Creates the static About view.
 * @param {{ navigate?: (path: string) => void, mode?: string, screenplayName?: string }} context
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createAboutView({
  navigate,
  mode = "write",
  screenplayName = "Pad.ma Videogrep",
} = {}) {
  const header = createHeader({
    mode,
    screenplayName,
    homeHref: import.meta.env.BASE_URL,
    modeLabel: "Write",
    onModeToggle:
      typeof navigate === "function" ? () => navigate("/write") : undefined,
  });
  const element = document.createElement("div");
  element.className = "aboutView";
  element.append(header);

  const main = document.createElement("main");
  main.className = "aboutView__main";
  main.setAttribute("aria-labelledby", "aboutViewTitle");

  const eyebrow = document.createElement("p");
  eyebrow.className = "aboutView__eyebrow";
  eyebrow.textContent = "About this project";

  const content = document.createElement("div");
  content.className = "aboutView__content";
  // about.md is bundled with the app, not user input, so rendering it as HTML is safe
  content.innerHTML = marked.parse(aboutMarkdown);
  const title = content.querySelector("h1");
  if (title) {
    title.id = "aboutViewTitle";
  }

  const actions = document.createElement("nav");
  actions.className = "aboutView__actions";
  actions.setAttribute("aria-label", "About page links");

  const homeLink = document.createElement("a");
  homeLink.className = "aboutView__link";
  homeLink.href = import.meta.env.BASE_URL;
  homeLink.textContent = "Return to the project";

  const essayLink = document.createElement("a");
  essayLink.className = "aboutView__link";
  essayLink.href =
    "https://opheliagame.github.io/garden/projects/experiments-with-text";
  essayLink.target = "_blank";
  essayLink.rel = "noopener noreferrer";
  essayLink.textContent = "Read the project notes";

  const handleHomeNavigation = function (event) {
    if (typeof navigate === "function") {
      event.preventDefault();
      navigate("/");
    }
  };
  homeLink.addEventListener("click", handleHomeNavigation);

  actions.append(homeLink, essayLink);
  main.append(eyebrow, content, actions);
  element.append(main);

  return {
    element,
    destroy: function () {
      homeLink.removeEventListener("click", handleHomeNavigation);
      destroyHeader(header);
    },
  };
}
