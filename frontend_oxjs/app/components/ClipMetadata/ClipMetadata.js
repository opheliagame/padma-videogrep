import "./ClipMetadata.css";

function formatTime(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(1).padStart(4, "0")}`;
}

export function createClipMetadata({ clip = {} } = {}) {
  const element = document.createElement("section");
  element.className = "clipMetadata";
  element.setAttribute("aria-label", "Clip metadata");

  const title = document.createElement("h2");
  title.className = "clipMetadata__title";
  title.textContent = clip.title || "Untitled clip";
  element.append(title);

  const details = document.createElement("dl");
  details.className = "clipMetadata__details";
  const addDetail = function (label, value) {
    if (value === undefined || value === null || value === "") return;
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = String(value);
    details.append(term, description);
  };
  addDetail("Source", clip.source);
  addDetail("Date", clip.date);
  addDetail("ID", clip.id);
  if (clip.in !== undefined && clip.in !== null) {
    addDetail("In", formatTime(clip.in));
  }
  if (clip.out !== undefined && clip.out !== null) {
    addDetail("Out", formatTime(clip.out));
  }
  if (
    clip.in != null &&
    clip.out != null &&
    Number(clip.out) >= Number(clip.in)
  ) {
    addDetail("Duration", formatTime(Number(clip.out) - Number(clip.in)));
  }
  if (Number(clip.videoAspectRatio) > 0) {
    addDetail("Aspect ratio", Number(clip.videoAspectRatio).toFixed(2));
  }
  element.append(details);

  const transcript = document.createElement("p");
  transcript.className = "clipMetadata__transcript";
  transcript.textContent =
    clip.transcript ||
    (clip.annotations || [])
      .map((annotation) => annotation.text)
      .filter(Boolean)
      .join("\n\n") ||
    "No transcript available.";
  const transcriptTitle = document.createElement("h3");
  transcriptTitle.className = "clipMetadata__label";
  transcriptTitle.textContent = "Transcript";
  element.append(transcriptTitle, transcript);
  return element;
}
