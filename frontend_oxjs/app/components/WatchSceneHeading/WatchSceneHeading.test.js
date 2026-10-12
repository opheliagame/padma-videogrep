// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import {
  createWatchSceneHeading,
  updateWatchSceneHeading,
  destroyWatchSceneHeading,
} from "./WatchSceneHeading.js";

describe("WatchSceneHeading", () => {
  it("renders defaults and updates scene text without interpreting markup", () => {
    const heading = createWatchSceneHeading();
    expect(heading.getAttribute("role")).toBe("banner");
    expect(heading.querySelector("span").textContent).toBe("scene 1");
    expect(heading.querySelector("h1").getAttribute("aria-live")).toBe(
      "polite",
    );

    updateWatchSceneHeading(heading, { index: 2, query: "<img src=x>" });
    expect(heading.querySelector("span").textContent).toBe("scene 3");
    expect(heading.querySelector("h1").textContent).toBe("<img src=x>");
    expect(heading.querySelector("h1").title).toBe("<img src=x>");
    expect(heading.querySelector("img")).toBeNull();
  });

  it("forwards navigation and stops callbacks and updates after teardown", () => {
    const onModeToggle = vi.fn();
    const heading = createWatchSceneHeading({ query: "water", onModeToggle });
    const button = heading.querySelector("button");
    button.click();
    expect(onModeToggle).toHaveBeenCalledOnce();

    destroyWatchSceneHeading(heading);
    destroyWatchSceneHeading(heading);
    button.click();
    updateWatchSceneHeading(heading, { index: 3, query: "night" });
    expect(onModeToggle).toHaveBeenCalledOnce();
    expect(heading.querySelector("h1").textContent).toBe("water");
  });
});
