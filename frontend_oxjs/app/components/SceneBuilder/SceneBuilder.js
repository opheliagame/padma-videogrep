import "./SceneBuilder.css";

const instances = new WeakMap();
let nextInstanceId = 0;

/**
 * Creates the scene editor's presentational controls.
 * @param {{ scenes?: Array<{ queryText?: string }>, onSceneChange?: (change: { sceneIndex: number, queryText: string }) => void, onSceneAdd?: (change: { sceneIndex: number, queryText: string }) => void }} props
 * @returns {HTMLElement}
 */
export function createSceneBuilder({
  scenes = [],
  onSceneChange,
  onSceneAdd,
} = {}) {
  const instanceId = ++nextInstanceId;
  const element = document.createElement("section");
  const list = document.createElement("div");
  const handleChange = function (event) {
    const input = event.target.closest?.(".sceneBuilder__input");
    if (!input || !element.contains(input)) return;
    onSceneChange?.({
      sceneIndex: Number(input.dataset.sceneIndex),
      queryText: input.value,
    });
  };
  const handleKeydown = function (event) {
    if (event.key !== "Enter") return;
    const input = event.target.closest?.(".sceneBuilder__input");
    if (!input || !element.contains(input)) return;
    event.preventDefault();
    onSceneAdd?.({
      sceneIndex: Number(input.dataset.sceneIndex),
      queryText: input.value,
    });
  };

  element.className = "sceneBuilder";
  element.setAttribute("role", "group");
  element.setAttribute("aria-label", "Scenes");
  list.className = "sceneBuilder__list";
  element.append(list);
  element.addEventListener("change", handleChange);
  element.addEventListener("keydown", handleKeydown);
  instances.set(element, {
    instanceId,
    list,
    handleChange,
    handleKeydown,
    onSceneAdd,
    onSceneChange,
  });
  renderSceneBuilder(element, scenes);

  return element;
}

export function renderSceneBuilder(element, scenes) {
  const instance = instances.get(element);
  if (!instance) return;

  const fragment = document.createDocumentFragment();
  scenes.forEach((scene, sceneIndex) => {
    const sceneContainer = document.createElement("div");
    sceneContainer.className = "sceneBuilder__scene";

    const inputId = `sceneBuilder${instance.instanceId}Input${sceneIndex}`;
    const label = document.createElement("label");
    label.className = "sceneBuilder__label";
    label.htmlFor = inputId;
    label.textContent = `Scene ${sceneIndex + 1}`;

    const input = document.createElement("textarea");
    input.id = inputId;
    input.className = "sceneBuilder__input";
    input.dataset.sceneIndex = String(sceneIndex);
    input.placeholder = "Enter keywords (space-separated) • Enter to add scene";
    input.value = scene.queryText || "";

    sceneContainer.append(label, input);
    fragment.append(sceneContainer);
  });

  instance.list.replaceChildren(fragment);
}

export function destroySceneBuilder(element) {
  const instance = instances.get(element);
  if (!instance) return;

  element.removeEventListener("change", instance.handleChange);
  element.removeEventListener("keydown", instance.handleKeydown);
  instances.delete(element);
}
