// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createClipTimeline,
  destroyClipTimeline,
  updateClipTimeline,
} from "./ClipTimeline.js";

describe("ClipTimeline", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders clip sections with accessible selection state", () => {
    const timeline = createClipTimeline();
    updateClipTimeline(
      timeline,
      [
        { title: "Water interview", in: 10, out: 25 },
        { transcript: "climate change", in: 0, out: 60 },
      ],
      1,
    );
    const sections = timeline.querySelectorAll('[role="tab"]');

    expect(sections).toHaveLength(2);
    expect(sections[0].getAttribute("aria-selected")).toBe("false");
    expect(sections[1].getAttribute("aria-selected")).toBe("true");
    expect(sections[0].getAttribute("aria-label")).toBe(
      "Play clip 1: Water interview",
    );
    expect(sections[1].textContent).toContain("climate change");
    expect(
      timeline.querySelector(".clipTimeline__track").style.gridTemplateColumns,
    ).toBe("minmax(0, 15fr) minmax(0, 60fr)");
    expect(timeline.querySelector('[aria-live="polite"]').textContent).toBe(
      "02 / 02 · 1:15 total",
    );
  });

  it("forwards selected section index and removes its click listener on destroy", () => {
    const onSelect = vi.fn();
    const timeline = createClipTimeline({ onSelect });
    updateClipTimeline(timeline, [{ title: "Section one", in: 0, out: 5 }]);
    const section = timeline.querySelector("button");

    section.click();
    expect(onSelect).toHaveBeenCalledWith(0);

    destroyClipTimeline(timeline);
    section.click();
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("keeps full labels in tooltips for a large clip sequence", () => {
    const timeline = createClipTimeline();
    const clips = Array.from({ length: 50 }, (_, index) => ({
      title: `A long interview title for clip ${index + 1}`,
      transcript: `Full transcript for section ${index + 1}`,
      in: 0,
      out: 12,
    }));

    updateClipTimeline(timeline, clips, 49);
    const sections = timeline.querySelectorAll("button");

    expect(sections).toHaveLength(50);
    expect(sections[49].title).toBe(
      "Clip 50: A long interview title for clip 50\nFull transcript for section 50\nDuration: 0:12",
    );
    expect(sections[49].getAttribute("aria-selected")).toBe("true");

    updateClipTimeline(timeline, [
      { transcript: "Transcript only", in: 0, out: 3 },
    ]);
    expect(timeline.querySelector("button").title).toBe(
      "Clip 1: Transcript only\nDuration: 0:03",
    );
  });

  it("normalizes invalid durations and clears width weights on empty updates", () => {
    const timeline = createClipTimeline();
    updateClipTimeline(timeline, [
      { in: 10, out: 10 },
      { in: 10, out: 9 },
      { in: 0, out: 0.5 },
      {},
    ]);
    const track = timeline.querySelector(".clipTimeline__track");

    expect(track.style.gridTemplateColumns).toBe(
      "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.5fr) minmax(0, 1fr)",
    );

    updateClipTimeline(timeline, []);
    expect(track.style.gridTemplateColumns).toBe("");
    expect(track.children).toHaveLength(0);
  });
});
