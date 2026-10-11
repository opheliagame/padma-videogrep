// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchClips } from "../../components/ui.js";
import { createWatchView } from "./WatchView.js";

vi.mock("../../components/ui.js", () => ({ fetchClips: vi.fn() }));

function createOxElement() {
  return {
    classes: [],
    children: [],
    addClass(className) {
      this.classes.push(className);
      return this;
    },
    appendTo(parent) {
      parent.children.push(this);
      return this;
    },
    append(child) {
      this.children.push(child);
      return this;
    },
    html(content) {
      this.content = content;
      return this;
    },
  };
}

function createApp() {
  return {
    $ui: {},
    data: {
      screenplay: {
        name: "Test screenplay",
        scenes: [
          { queryText: "water" },
          { grammars: [{ name: "night" }, { name: "train" }] },
        ],
      },
    },
    state: { currentScene: null },
  };
}

describe("createWatchView", () => {
  const originalOx = globalThis.Ox;

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    if (originalOx === undefined) {
      delete globalThis.Ox;
    } else {
      globalThis.Ox = originalOx;
    }
  });

  it("builds a page with a header and video, scene, and metadata panels", () => {
    vi.useFakeTimers();
    const splitPanel = createOxElement();
    const splitPanelConfig = vi.fn(() => splitPanel);
    globalThis.Ox = {
      Element: createOxElement,
      SplitPanel: splitPanelConfig,
    };
    const app = createApp();
    const onModeToggle = vi.fn();

    const view = createWatchView({ app, onModeToggle });
    const [middleSection, bottomSection] =
      splitPanelConfig.mock.calls[0][0].elements;
    const sceneList = bottomSection.element.children[0].children[0].children[1];

    expect(view.element).toBe(splitPanel);
    expect(splitPanelConfig.mock.calls[0][0].orientation).toBe("vertical");
    expect(middleSection.element.classes).toContain(
      "playSectionMiddle playmode",
    );
    expect(sceneList.children).toHaveLength(2);
    expect(app.data.screenplay.scenes[0].ast).toEqual({
      type: "KEYWORD",
      value: "water",
    });
    expect(sceneList.children[0].children[1].content).toBe("water");
    expect(sceneList.children[1].children[1].content).toBe("night train");
    expect(app.$ui.$playVideoContainer).toBe(middleSection.element);
    expect(app.$ui.$clipMetadata.classes).toContain(
      "playClipMetadata playmode",
    );
    const pageConfig = splitPanelConfig.mock.calls[1][0];
    expect(pageConfig.orientation).toBe("vertical");
    expect(pageConfig.elements[0].size).toBe(80);
    expect(pageConfig.elements[1].element).toBe(splitPanel);
    const modeButton =
      pageConfig.elements[0].element.children[0].querySelector(
        ".headerModeButton",
      );
    expect(modeButton.textContent).toBe("Write");
    modeButton.click();
    expect(onModeToggle).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(50);
    expect(fetchClips).toHaveBeenCalledOnce();
    expect(fetchClips).toHaveBeenCalledWith(app);
    view.destroy();
    modeButton.click();
    expect(onModeToggle).toHaveBeenCalledOnce();
  });

  it("clears its app references on destroy without clearing replacements", () => {
    vi.useFakeTimers();
    globalThis.Ox = {
      Element: createOxElement,
      SplitPanel: () => createOxElement(),
    };
    const app = createApp();
    const view = createWatchView({ app });

    view.destroy();
    expect(app.$ui.$playVideoContainer).toBeNull();
    expect(app.$ui.$clipMetadata).toBeNull();
    vi.advanceTimersByTime(50);
    expect(fetchClips).not.toHaveBeenCalled();

    app.$ui.$playVideoContainer = "new view";
    app.$ui.$clipMetadata = "new metadata";
    view.destroy();
    expect(app.$ui.$playVideoContainer).toBe("new view");
    expect(app.$ui.$clipMetadata).toBe("new metadata");
  });
});
