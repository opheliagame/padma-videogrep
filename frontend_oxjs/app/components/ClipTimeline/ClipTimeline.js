import "./ClipTimeline.css";

const instances = new WeakMap();

function getClipDuration(clip) {
  const duration = Number(clip.out) - Number(clip.in);
  return Number.isFinite(duration) && duration > 0 ? duration : 1;
}

function formatDuration(seconds) {
  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  return `${minutes}:${String(roundedSeconds % 60).padStart(2, "0")}`;
}

/**
 * Creates a selectable timeline of returned clip sections.
 * @param {{ onSelect?: (index: number) => void }} props
 * @returns {HTMLElement}
 */
export function createClipTimeline({ onSelect } = {}) {
  const element = document.createElement("section");
  const summary = document.createElement("div");
  const track = document.createElement("div");

  element.className = "clipTimeline";
  element.setAttribute("aria-label", "Clip timeline");
  summary.className = "clipTimeline__summary";
  summary.setAttribute("aria-live", "polite");
  summary.textContent = "Fetching clips";
  track.className = "clipTimeline__track";
  track.setAttribute("role", "tablist");
  track.setAttribute("aria-label", "Clip sections");
  element.append(summary, track);

  const handleClick = function (event) {
    const button = event.target.closest("button[data-clip-index]");
    if (!button || !element.contains(button)) return;
    onSelect?.(Number(button.dataset.clipIndex));
  };
  element.addEventListener("click", handleClick);
  instances.set(element, { handleClick, track, summary });
  return element;
}

export function updateClipTimeline(element, clips, activeIndex = 0) {
  const instance = instances.get(element);
  if (!instance) return;

  const totalDuration = clips.reduce(
    (total, clip) => total + getClipDuration(clip),
    0,
  );
  instance.summary.textContent = clips.length
    ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(clips.length).padStart(2, "0")} · ${formatDuration(totalDuration)} total`
    : "No clips found";
  instance.track.style.gridTemplateColumns = clips
    .map((clip) => `minmax(0, ${getClipDuration(clip)}fr)`)
    .join(" ");

  instance.track.replaceChildren(
    ...clips.map((clip, index) => {
      const button = document.createElement("button");
      const number = document.createElement("span");
      const label = document.createElement("span");
      const duration = document.createElement("span");
      const isActive = index === activeIndex;
      const clipLabel = clip.title || clip.transcript || `Clip ${index + 1}`;
      const clipDuration = formatDuration(getClipDuration(clip));

      button.type = "button";
      button.className = "clipTimeline__section";
      button.classList.toggle("is-active", isActive);
      button.dataset.clipIndex = String(index);
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(isActive));
      button.setAttribute(
        "aria-label",
        `Play clip ${index + 1}: ${clip.title || clip.transcript || "Untitled clip"}`,
      );
      button.title = [
        `Clip ${index + 1}: ${clipLabel}`,
        clip.title && clip.transcript ? clip.transcript : "",
        `Duration: ${clipDuration}`,
      ]
        .filter(Boolean)
        .join("\n");

      number.className = "clipTimeline__number";
      number.textContent = String(index + 1).padStart(2, "0");
      label.className = "clipTimeline__label";
      label.textContent = clipLabel;
      duration.className = "clipTimeline__duration";
      duration.textContent = clipDuration;
      button.append(number, label, duration);
      return button;
    }),
  );
}

export function destroyClipTimeline(element) {
  const instance = instances.get(element);
  if (!instance) return;

  element.removeEventListener("click", instance.handleClick);
  instances.delete(element);
}
