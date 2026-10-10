// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { createWriteView } from "./WriteView.js";

function createOxElement() {
  return {
    classes: [],
    children: [],
    addClass(className) {
      this.classes.push(className);
      return this;
    },
    append(child) {
      this.children.push(child);
      return this;
    },
  };
}

describe("createWriteView", () => {
  const originalOx = globalThis.Ox;
  const originalSceneBuilder = globalThis.SceneBuilderComponent;
  const originalGenerativityControls = globalThis.GenerativityControlsComponent;

  afterEach(() => {
    if (originalOx === undefined) {
      delete globalThis.Ox;
    } else {
      globalThis.Ox = originalOx;
    }
    if (originalSceneBuilder === undefined) {
      delete globalThis.SceneBuilderComponent;
    } else {
      globalThis.SceneBuilderComponent = originalSceneBuilder;
    }
    if (originalGenerativityControls === undefined) {
      delete globalThis.GenerativityControlsComponent;
    } else {
      globalThis.GenerativityControlsComponent = originalGenerativityControls;
    }
  });

  it("composes a page with a header and horizontal write panel", () => {
    const sceneBuilder = createOxElement();
    const controls = createOxElement();
    const contentPanel = createOxElement();
    const page = createOxElement();
    const splitPanelConfig = vi
      .fn()
      .mockReturnValueOnce(contentPanel)
      .mockReturnValueOnce(page);
    globalThis.Ox = { Element: createOxElement, SplitPanel: splitPanelConfig };
    globalThis.SceneBuilderComponent = {
      create: vi.fn(() => sceneBuilder),
    };
    globalThis.GenerativityControlsComponent = {
      create: vi.fn(() => controls),
    };
    const app = { $ui: {}, data: { screenplay: { name: "Test screenplay" } } };
    const onModeToggle = vi.fn();

    const view = createWriteView({ app, onModeToggle });

    expect(view.element).toBe(page);
    expect(contentPanel.classes).toContain("writeLeftPanel");
    expect(splitPanelConfig).toHaveBeenNthCalledWith(1, {
      elements: [{ element: sceneBuilder }, { element: controls, size: 220 }],
      orientation: "horizontal",
    });
    const pageConfig = splitPanelConfig.mock.calls[1][0];
    expect(pageConfig.orientation).toBe("vertical");
    expect(pageConfig.elements[0].size).toBe(80);
    expect(
      pageConfig.elements[0].element.children[0].getAttribute("role"),
    ).toBe("banner");
    expect(pageConfig.elements[1].element).toBe(contentPanel);

    const modeButton =
      pageConfig.elements[0].element.children[0].querySelector(
        ".headerModeButton",
      );
    modeButton.click();
    expect(onModeToggle).toHaveBeenCalledOnce();
    view.destroy();
    modeButton.click();
    expect(onModeToggle).toHaveBeenCalledOnce();
  });

  it("clears its controls reference without clearing a replacement", () => {
    const controlsReference = {};
    globalThis.Ox = {
      Element: createOxElement,
      SplitPanel: createOxElement,
    };
    globalThis.SceneBuilderComponent = {
      create: createOxElement,
    };
    globalThis.GenerativityControlsComponent = {
      create: vi.fn(() => createOxElement()),
    };
    const app = {
      $ui: { generativityControls: controlsReference },
      data: { screenplay: { name: "Test screenplay" } },
    };

    const view = createWriteView({ app });
    view.destroy();
    expect(app.$ui.generativityControls).toBeNull();

    app.$ui.generativityControls = "replacement";
    view.destroy();
    expect(app.$ui.generativityControls).toBe("replacement");
  });
});
