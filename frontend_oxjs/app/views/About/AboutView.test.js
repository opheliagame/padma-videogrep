// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { createAboutView } from "./AboutView.js";

describe("createAboutView", () => {
  it("renders the project information and page navigation", () => {
    const view = createAboutView({ navigate: vi.fn() });

    expect(
      view.element.querySelector("main").getAttribute("aria-labelledby"),
    ).toBe("aboutViewTitle");
    expect(view.element.querySelector("h1").textContent).toBe(
      "pad.ma videogrep",
    );
    expect(view.element.querySelectorAll("nav a")).toHaveLength(2);
    expect(view.element.querySelector('a[target="_blank"]').rel).toBe(
      "noopener noreferrer",
    );

    view.destroy();
  });

  it("renders the about content and usage guide from markdown", () => {
    const view = createAboutView({ navigate: vi.fn() });
    const content = view.element.querySelector(".aboutView__content");

    expect(
      [...content.querySelectorAll("h2")].map((h) => h.textContent),
    ).toEqual(["what is pad.ma", "what is videogrep", "How to use"]);
    expect(
      [...content.querySelectorAll("h3")].map((h) => h.textContent),
    ).toEqual([
      "Getting started",
      "Writing queries",
      "Generativity controls",
      "Where clips come from",
      "Work in progress",
    ]);
    expect(content.querySelector("table")).not.toBeNull();
    expect(content.textContent).toContain(
      "Random sort does not work right now.",
    );

    view.destroy();
  });

  it("navigates through the supplied router callback and removes listeners on destroy", () => {
    const navigate = vi.fn();
    const view = createAboutView({ navigate });
    const homeLink = view.element.querySelector(".aboutView__link");
    const modeButton = view.element.querySelector(".headerModeButton");

    homeLink.click();
    modeButton.click();
    expect(navigate.mock.calls).toEqual([["/"], ["/write"]]);

    view.destroy();
    homeLink.click();
    modeButton.click();
    expect(navigate).toHaveBeenCalledTimes(2);
  });
});
