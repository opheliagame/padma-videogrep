import "./GenerativityControls.css";

const lengths = ["short", "medium", "long"];
const sorts = [
  ["relevance", "Relevance"],
  ["date", "Date"],
  ["random", "Random"],
];
const durations = {
  short: "< 5 sec",
  medium: "5-15 sec",
  long: "> 15 sec",
};
const cleanupByElement = new WeakMap();
let nextInstanceId = 0;

/**
 * Creates generativity settings controls.
 * @param {{ initialValues?: { length?: string, sortBy?: string, limit?: number }, onChange?: (values: { length: string, sortBy: string, limit: number }) => void }} props
 * @returns {HTMLElement}
 */
export function createGenerativityControls({ initialValues = {}, onChange } = {}) {
  const instanceId = ++nextInstanceId;
  const state = {
    length: lengths.includes(initialValues.length)
      ? initialValues.length
      : "medium",
    sortBy: sorts.some(([value]) => value === initialValues.sortBy)
      ? initialValues.sortBy
      : "relevance",
    limit: Math.max(
      1,
      Math.min(50, Number.parseInt(initialValues.limit, 10) || 10),
    ),
  };
  const listeners = [];
  const listen = function (element, eventName, handler) {
    element.addEventListener(eventName, handler);
    listeners.push(() => element.removeEventListener(eventName, handler));
  };
  const emitChange = function () {
    if (typeof onChange === "function") {
      onChange({ ...state });
    }
  };

  const controls = document.createElement("section");
  const titleId = `generativityControlsTitle${instanceId}`;
  controls.className = "generativityControls";
  controls.setAttribute("aria-labelledby", titleId);

  const title = document.createElement("h2");
  title.id = titleId;
  title.className = "generativityControls__title";
  title.textContent = "generativity controls";
  controls.append(title);

  const lengthGroup = document.createElement("fieldset");
  lengthGroup.className = "generativityControls__group";
  const lengthLabel = document.createElement("legend");
  lengthLabel.className = "generativityControls__label";
  lengthLabel.textContent = "length";
  lengthGroup.append(lengthLabel);

  const lengthOptions = document.createElement("div");
  lengthOptions.className = "generativityControls__lengthOptions";
  lengths.forEach((length) => {
    const option = document.createElement("label");
    option.className = "generativityControls__lengthOption";

    const input = document.createElement("input");
    input.className = "generativityControls__lengthInput";
    input.type = "radio";
    input.name = `generativityLength${instanceId}`;
    input.value = length;
    input.checked = state.length === length;
    option.classList.toggle("is-active", input.checked);
    option.append(input, document.createTextNode(length));

    listen(input, "change", function () {
      if (!input.checked) return;
      state.length = length;
      lengthOptions.querySelectorAll(".generativityControls__lengthOption")
        .forEach((label) => {
          label.classList.toggle(
            "is-active",
            label.querySelector("input").checked,
          );
        });
      durationInfo.textContent = durations[state.length];
      emitChange();
    });

    lengthOptions.append(option);
  });
  lengthGroup.append(lengthOptions);
  controls.append(lengthGroup);

  const sortGroup = document.createElement("div");
  sortGroup.className = "generativityControls__group";
  const sortId = `generativitySort${instanceId}`;
  const sortLabel = document.createElement("label");
  sortLabel.className = "generativityControls__label";
  sortLabel.htmlFor = sortId;
  sortLabel.textContent = "sort";
  const sortSelect = document.createElement("select");
  sortSelect.id = sortId;
  sortSelect.className = "generativityControls__sortSelect";
  sortSelect.value = state.sortBy;
  sorts.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    sortSelect.append(option);
  });
  listen(sortSelect, "change", function () {
    state.sortBy = sortSelect.value;
    emitChange();
  });
  sortGroup.append(sortLabel, sortSelect);
  controls.append(sortGroup);

  const limitGroup = document.createElement("div");
  limitGroup.className = "generativityControls__group";
  const limitId = `generativityLimit${instanceId}`;
  const limitLabel = document.createElement("label");
  limitLabel.className = "generativityControls__label";
  limitLabel.htmlFor = limitId;
  limitLabel.textContent = "clip count";
  const limitInput = document.createElement("input");
  limitInput.id = limitId;
  limitInput.className = "generativityControls__limitInput";
  limitInput.type = "number";
  limitInput.min = "1";
  limitInput.max = "50";
  limitInput.value = String(state.limit);
  listen(limitInput, "change", function () {
    state.limit = Math.max(
      1,
      Math.min(50, Number.parseInt(limitInput.value, 10) || 10),
    );
    limitInput.value = String(state.limit);
    emitChange();
  });
  limitGroup.append(limitLabel, limitInput);
  controls.append(limitGroup);

  const durationInfo = document.createElement("p");
  durationInfo.className = "generativityControls__durationInfo";
  durationInfo.setAttribute("aria-live", "polite");
  durationInfo.textContent = durations[state.length];
  controls.append(durationInfo);

  cleanupByElement.set(controls, function () {
    listeners.forEach((removeListener) => removeListener());
  });
  return controls;
}

export function destroyGenerativityControls(controls) {
  const cleanup = cleanupByElement.get(controls);
  if (cleanup) {
    cleanup();
    cleanupByElement.delete(controls);
  }
}