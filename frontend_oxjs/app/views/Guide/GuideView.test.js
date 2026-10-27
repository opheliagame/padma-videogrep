// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { createGuideView } from "./GuideView.js";

describe("createGuideView", () => {
  it("renders guide content and page navigation", () => {
    const view = createGuideView({
      navigate: vi.fn(),
      aboutHref: "/about",
      guideHref: "/guide",
    });

    expect(
      view.element.querySelector("main").getAttribute("aria-labelledby"),
    ).toBe("guideViewTitle");
    expect(
      [...view.element.querySelectorAll(".guideView__content h1")].map(
        (heading) => heading.textContent,
      ),
    ).toEqual(["1", "2", "3", "on syntax", "on controls"]);
    expect(
      view.element.querySelector(".guideView__content").textContent,
    ).toContain("write a poem with what you found");
    expect(view.element.querySelector(".guideView__content").textContent).toContain(
      "clip count",
    );
    expect(view.element.querySelector(".guideView__content table")).not.toBeNull();
    expect(view.element.querySelectorAll(".guideView__actions a")).toHaveLength(
      2,
    );
    expect(
      view.element.querySelector(".guideView__actions a[href='/about']"),
    ).not.toBeNull();
    expect(view.element.querySelectorAll(".headerLink")).toHaveLength(2);
    expect(
      [...view.element.querySelectorAll(".headerLink")].map((link) =>
        link.getAttribute("href"),
      ),
    ).toEqual(["/about", "/guide"]);

    view.destroy();
  });

  it("navigates through the supplied router callback and removes listeners on destroy", () => {
    const navigate = vi.fn();
    const view = createGuideView({ navigate });
    const homeLink = view.element.querySelector(".guideView__link");
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
