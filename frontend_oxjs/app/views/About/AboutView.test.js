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
      "Stories change how we see things.",
    );
    expect(view.element.querySelectorAll("nav a")).toHaveLength(2);
    expect(view.element.querySelector('a[target="_blank"]').rel).toBe(
      "noopener noreferrer",
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
    expect(navigate.mock.calls).toEqual([["/"], ["/watch"]]);

    view.destroy();
    homeLink.click();
    modeButton.click();
    expect(navigate).toHaveBeenCalledTimes(2);
  });
});
