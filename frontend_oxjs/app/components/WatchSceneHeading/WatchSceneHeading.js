import "./WatchSceneHeading.css";

const instances = new WeakMap();

/**
 * Creates the watch page's scene display and navigation control.
 * @param {{ index?: number, query?: string, onModeToggle?: () => void }} props
 * @returns {HTMLElement}
 */
export function createWatchSceneHeading({
  index = 0,
  query = "",
  onModeToggle,
} = {}) {
  const element = document.createElement("header");
  const scene = document.createElement("span");
  const title = document.createElement("h1");
  const button = document.createElement("button");

  element.className = "watchSceneHeading";
  element.setAttribute("role", "banner");
  scene.className = "watchSceneHeading__scene";
  title.className = "watchSceneHeading__title";
  title.setAttribute("aria-live", "polite");
  button.className = "watchSceneHeading__modeButton";
  button.type = "button";
  button.textContent = "Write";
  button.setAttribute("aria-label", "Switch to write mode");

  const handleClick = () => onModeToggle?.();
  button.addEventListener("click", handleClick);
  element.append(scene, title, button);
  instances.set(element, { scene, title, button, handleClick });
  updateWatchSceneHeading(element, { index, query });
  return element;
}

export function updateWatchSceneHeading(
  element,
  { index = 0, query = "" } = {},
) {
  const instance = instances.get(element);
  if (!instance) return;

  instance.scene.textContent = `scene ${index + 1}`;
  instance.title.textContent = query;
  instance.title.title = query;
}

export function destroyWatchSceneHeading(element) {
  const instance = instances.get(element);
  if (!instance) return;

  instance.button.removeEventListener("click", instance.handleClick);
  instances.delete(element);
}
