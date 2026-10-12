// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHeader, destroyHeader } from "./Header.js";

describe("createHeader", () => {
  it("renders a write-mode header with an editable title", () => {
    const header = createHeader({ screenplayName: "Water" });

    expect(header.tagName).toBe("HEADER");
    expect(header.getAttribute("role")).toBe("banner");
    expect(header.querySelector(".headerBrand").textContent).toBe(
      "pad.ma videogrep",
    );
    expect(header.querySelector(".headerTitleDisplay").textContent).toBe(
      "Water",
    );
    expect(header.querySelector(".headerModeButton").textContent).toBe("Play");
  });

  it("renders the project title in play mode without scene-specific content", () => {
    const header = createHeader({
      mode: "play",
      screenplayName: "<img src=x onerror=alert(1)>",
    });

    expect(header.classList.contains("playmode")).toBe(true);
    expect(header.querySelector(".headerBrand").textContent).toBe(
      "pad.ma videogrep",
    );
    expect(header.querySelector(".headerQuery")).toBeNull();
    expect(header.querySelector(".headerTitleDisplay").textContent).toBe(
      "<img src=x onerror=alert(1)>",
    );
    expect(header.querySelector("img")).toBeNull();
    expect(
      header.querySelector(".headerModeButton").getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("edits the title and updates its expanded accessibility state", () => {
    const onTitleChange = vi.fn();
    const header = createHeader({ screenplayName: "Old title", onTitleChange });
    const titleButton = header.querySelector(".headerTitleDisplay");
    const titleInput = header.querySelector(".headerTitleInput");

    titleButton.click();
    expect(titleButton.getAttribute("aria-expanded")).toBe("true");
    expect(titleInput.getAttribute("aria-hidden")).toBe("false");

    titleInput.value = "New title";
    titleInput.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );

    expect(onTitleChange).toHaveBeenCalledOnce();
    expect(onTitleChange).toHaveBeenCalledWith("New title");
    expect(titleButton.textContent).toBe("New title");
    expect(titleButton.getAttribute("aria-expanded")).toBe("false");
    expect(titleInput.getAttribute("aria-hidden")).toBe("true");
  });

  it("links to the about page and accepts a custom mode label", () => {
    const header = createHeader({ aboutHref: "/about", modeLabel: "Write" });

    expect(header.querySelector(".headerBrand").textContent).toBe(
      "pad.ma videogrep・about",
    );
    expect(header.querySelector(".headerLink").getAttribute("href")).toBe(
      "/about",
    );
    expect(header.querySelector(".headerModeButton").textContent).toBe("Write");
  });

  it("calls the mode callback and removes listeners on destroy", () => {
    const onModeToggle = vi.fn();
    const header = createHeader({ onModeToggle });
    const modeButton = header.querySelector(".headerModeButton");

    modeButton.click();
    expect(onModeToggle).toHaveBeenCalledOnce();

    destroyHeader(header);
    modeButton.click();
    expect(onModeToggle).toHaveBeenCalledOnce();
  });
});
