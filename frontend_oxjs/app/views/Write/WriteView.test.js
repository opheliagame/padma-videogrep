// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { createWriteView } from "./WriteView.js";

vi.mock("../../core/Storage/StorageManager.js", () => ({
  storageManager: { save: vi.fn() },
}));

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

  afterEach(() => {
    vi.useRealTimers();
    if (originalOx === undefined) {
      delete globalThis.Ox;
    } else {
      globalThis.Ox = originalOx;
    }
  });

  it("composes a page with a header and horizontal write panel", () => {
    const contentPanel = createOxElement();
    const page = createOxElement();
    const splitPanelConfig = vi
      .fn()
      .mockReturnValueOnce(contentPanel)
      .mockReturnValueOnce(page);
    globalThis.Ox = { Element: createOxElement, SplitPanel: splitPanelConfig };
    const app = {
      $ui: {},
      data: {
        screenplay: {
          name: "Test screenplay",
          scenes: [{ name: "scene 1", queryText: "water", ast: null }],
        },
      },
      state: {},
    };
    const onModeToggle = vi.fn();

    const view = createWriteView({ app, onModeToggle });

    expect(view.element).toBe(page);
    expect(contentPanel.classes).toContain("writeLeftPanel");
    const writePanelConfig = splitPanelConfig.mock.calls[0][0];
    const sceneBuilder = writePanelConfig.elements[0].element.children[0];
    expect(sceneBuilder.className).toBe("sceneBuilder");
    expect(sceneBuilder.querySelector("textarea").value).toBe("water");
    expect(writePanelConfig.elements[1].size).toBe(220);
    expect(writePanelConfig.elements[1].element.children[0].className).toBe(
      "generativityControls",
    );
    expect(writePanelConfig.orientation).toBe("horizontal");
    expect(app.state.generativity).toEqual({
      length: "medium",
      sortBy: "relevance",
      limit: 10,
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

  it("writes control changes to app state", () => {
    globalThis.Ox = {
      Element: createOxElement,
      SplitPanel: vi
        .fn()
        .mockReturnValueOnce(createOxElement())
        .mockReturnValueOnce(createOxElement()),
    };
    const app = {
      $ui: {},
      data: { screenplay: { name: "Test screenplay", scenes: [] } },
      state: {},
    };

    createWriteView({ app });
    const controls =
      globalThis.Ox.SplitPanel.mock.calls[0][0].elements[1].element.children[0];
    const sortSelect = controls.querySelector("select");
    sortSelect.value = "date";
    sortSelect.dispatchEvent(new Event("change", { bubbles: true }));

    expect(app.state.generativity.sortBy).toBe("date");
  });
});
