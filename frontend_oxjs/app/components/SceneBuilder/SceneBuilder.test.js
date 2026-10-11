// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import {
  createSceneBuilder,
  destroySceneBuilder,
  renderSceneBuilder,
} from "./SceneBuilder.js";

describe("createSceneBuilder", () => {
  it("renders labelled scene inputs as text", () => {
    const element = createSceneBuilder({
      scenes: [{ queryText: "<img src=x>" }],
    });
    const input = element.querySelector("textarea");

    expect(element.getAttribute("role")).toBe("group");
    expect(element.getAttribute("aria-label")).toBe("Scenes");
    expect(element.querySelector("label").htmlFor).toBe(input.id);
    expect(input.value).toBe("<img src=x>");
    expect(element.querySelector("img")).toBeNull();
  });

  it("forwards scene edits and add requests", () => {
    const onSceneChange = vi.fn();
    const onSceneAdd = vi.fn();
    const element = createSceneBuilder({
      scenes: [{ queryText: "water" }],
      onSceneChange,
      onSceneAdd,
    });
    const input = element.querySelector("textarea");
    input.value = "rain";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onSceneChange).toHaveBeenCalledWith({
      sceneIndex: 0,
      queryText: "rain",
    });

    const enter = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(enter);

    expect(enter.defaultPrevented).toBe(true);
    expect(onSceneAdd).toHaveBeenCalledWith({
      sceneIndex: 0,
      queryText: "rain",
    });
  });

  it("rerenders scene data and removes forwarded event listeners on destroy", () => {
    const onSceneChange = vi.fn();
    const element = createSceneBuilder({ onSceneChange });
    renderSceneBuilder(element, [{ queryText: "new scene" }]);
    const input = element.querySelector("textarea");

    expect(input.value).toBe("new scene");
    destroySceneBuilder(element);
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onSceneChange).not.toHaveBeenCalled();
  });
});
