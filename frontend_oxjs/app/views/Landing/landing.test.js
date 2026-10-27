// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./LandingView.js", () => ({
  createLandingView: vi.fn(),
}));

import { createLandingView } from "./LandingView.js";

describe("landing startup", () => {
  afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.classList.remove("landingLoading");
    window.history.replaceState({}, "", "/");
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("mounts the landing without waiting for OxJS initialization", async () => {
    window.history.replaceState({}, "", import.meta.env.BASE_URL);
    document.documentElement.classList.add("landingLoading");
    const view = { element: document.createElement("div"), destroy: vi.fn() };
    createLandingView.mockReturnValue(view);

    const { landingView } = await import("./landing.js");

    expect(landingView).toBe(view);
    expect(document.body.contains(view.element)).toBe(true);
    expect(document.documentElement.classList.contains("landingLoading")).toBe(
      false,
    );
    createLandingView.mock.calls[0][0].onExited();
    expect(view.destroy).toHaveBeenCalledOnce();
  });

  it("does not start the sketch on other routes", async () => {
    window.history.replaceState({}, "", `${import.meta.env.BASE_URL}write`);

    const { landingView } = await import("./landing.js");

    expect(landingView).toBeNull();
    expect(createLandingView).not.toHaveBeenCalled();
  });
});
