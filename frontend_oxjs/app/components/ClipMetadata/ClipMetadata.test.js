// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { createClipMetadata } from "./ClipMetadata.js";

describe("ClipMetadata", () => {
  it("renders transcript and available clip details as text", () => {
    const metadata = createClipMetadata({
      clip: {
        title: "Interview",
        transcript: "<img src=x>\nA second line",
        source: "Archive",
        date: "2025-11-12",
        id: "ABC",
        in: 0,
        out: 12.5,
        videoAspectRatio: 4 / 3,
      },
    });
    expect(metadata.querySelector("img")).toBeNull();
    expect(
      metadata.querySelector(".clipMetadata__transcript").textContent,
    ).toBe("<img src=x>\nA second line");
    expect(metadata.textContent).toContain("Archive");
    expect(metadata.textContent).toContain("2025-11-12");
    expect(metadata.textContent).toContain("ABC");
    expect(metadata.textContent).toContain("0:00.0");
    expect(metadata.textContent).toContain("0:12.5");
    expect(metadata.textContent).toContain("1.33");
  });

  it("uses annotations when transcript is missing without inventing source or date", () => {
    const metadata = createClipMetadata({
      clip: {
        annotations: [{ text: "First" }, { text: "Second" }],
      },
    });
    expect(
      metadata.querySelector(".clipMetadata__transcript").textContent,
    ).toBe("First\n\nSecond");
    expect(metadata.querySelector("dl").children).toHaveLength(0);
    expect(createClipMetadata().textContent).toContain(
      "No transcript available.",
    );
  });
});
