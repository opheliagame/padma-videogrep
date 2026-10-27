// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./landingSketch.js", () => ({
  startLandingSketch: vi.fn(),
}));

import { startLandingSketch } from "./landingSketch.js";
import { createLandingView } from "./LandingView.js";

describe("createLandingView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps the landing clear while the sketch loads", async () => {
    let resolveSketch;
    startLandingSketch.mockReturnValue(
      new Promise((resolve) => {
        resolveSketch = resolve;
      }),
    );

    const view = createLandingView();
    const stopSketch = vi.fn();

    expect(view.element.className).toBe("landingView");
    expect(view.element.querySelector("canvas")).not.toBeNull();
    expect(view.element.querySelector("h1")).toBeNull();

    resolveSketch(stopSketch);
    await Promise.resolve();
    await Promise.resolve();
    expect(view.element.querySelector("h1")).toBeNull();

    view.destroy();
    expect(stopSketch).toHaveBeenCalledOnce();
  });
});
