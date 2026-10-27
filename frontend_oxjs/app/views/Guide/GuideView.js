import { marked } from "marked";
import { createHeader, destroyHeader } from "../../components/Header/Header.js";
import guideMarkdown from "./guide.md?raw";
import "./GuideView.css";

/**
 * Creates the static Guide view.
 * @param {{ navigate?: (path: string) => void, mode?: string, screenplayName?: string, homeHref?: string, aboutHref?: string }} context
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createGuideView({
  navigate,
  mode = "write",
  screenplayName = "Pad.ma Videogrep",
  homeHref = import.meta.env.BASE_URL,
  aboutHref = `${import.meta.env.BASE_URL}about`,
  guideHref = `${import.meta.env.BASE_URL}guide`,
} = {}) {
  const header = createHeader({
    mode,
    screenplayName,
    homeHref,
    aboutHref,
    guideHref,
    modeLabel: "Write",
    onModeToggle:
      typeof navigate === "function" ? () => navigate("/write") : undefined,
  });
  const element = document.createElement("div");
  element.className = "guideView";
  element.append(header);

  const main = document.createElement("main");
  main.className = "guideView__main";
  main.setAttribute("aria-labelledby", "guideViewTitle");

  const eyebrow = document.createElement("p");
  eyebrow.className = "guideView__eyebrow";
  eyebrow.textContent = "a guide to play with padma videogrep";

  const content = document.createElement("div");
  content.className = "guideView__content";
  // guide.md is bundled with the app, not user input, so rendering it as HTML is safe
  content.innerHTML = marked.parse(guideMarkdown);
  const title = content.querySelector("h1");
  if (title) {
    title.id = "guideViewTitle";
  }

  const actions = document.createElement("nav");
  actions.className = "guideView__actions";
  actions.setAttribute("aria-label", "Guide page links");

  const homeLink = document.createElement("a");
  homeLink.className = "guideView__link";
  homeLink.href = homeHref;
  homeLink.textContent = "Return to the project";

  const aboutLink = document.createElement("a");
  aboutLink.className = "guideView__link";
  aboutLink.href = aboutHref || `${homeHref.replace(/\/$/, "")}/about`;
  aboutLink.textContent = "About this project";

  const handleHomeNavigation = function (event) {
    if (typeof navigate === "function") {
      event.preventDefault();
      navigate("/");
    }
  };
  homeLink.addEventListener("click", handleHomeNavigation);

  actions.append(homeLink, aboutLink);
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
