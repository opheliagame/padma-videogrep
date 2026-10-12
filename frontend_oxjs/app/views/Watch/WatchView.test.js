// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchClips, playClips } from "../../components/ui.js";
import { updateClipTimeline } from "../../components/ClipTimeline/ClipTimeline.js";
import { createWatchView } from "./WatchView.js";

vi.mock("../../components/ui.js", () => ({
  fetchClips: vi.fn(),
  playClips: vi.fn(),
}));

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
    globalThis.Ox = { Element: createOxElement };
    const app = createApp();
    const onModeToggle = vi.fn();

    const view = createWatchView({ app, onModeToggle });
    const stage = view.element.children[0];
    const [headerSection, middleSection, metadataPanel] = stage.children;

    expect(view.element.classes).toContain("watchPage");
    expect(stage.classes).toContain("watchStage");
    expect(middleSection.classes).toContain("playSectionMiddle");
    expect(app.data.screenplay.scenes[0].ast).toEqual({
      type: "KEYWORD",
      value: "water",
    });
    expect(app.$ui.$playVideoContainer).toBe(middleSection);
    expect(metadataPanel.children[0].classes).toContain("playClipMetadata");
    expect(stage.children[3].children[0].className).toBe("clipTimeline");
    const modeButton = headerSection.children[0].querySelector(
      ".watchSceneHeading__modeButton",
    );
    expect(modeButton.textContent).toBe("Write");
    modeButton.click();
    expect(onModeToggle).toHaveBeenCalledOnce();

    const clips = [{ title: "Water section", in: 0, out: 12 }];
    app.$ui.$clips = clips;
    updateClipTimeline(app.$ui.$clipTimeline, clips);
    app.$ui.$clipTimeline.querySelector("button").click();
    expect(playClips).toHaveBeenCalledWith(app, clips, 0, expect.any(Object));
    const playbackOptions = playClips.mock.calls[0][3];
    playbackOptions.onClipChange({ sceneIndex: 1, sceneQuery: "night train" });
    const header = headerSection.children[0];
    expect(header.querySelector(".watchSceneHeading__scene").textContent).toBe(
      "scene 2",
    );
    expect(header.querySelector(".watchSceneHeading__title").textContent).toBe(
      "night train",
    );

    vi.advanceTimersByTime(50);
    expect(fetchClips).toHaveBeenCalledOnce();
    expect(fetchClips).toHaveBeenCalledWith(app, playbackOptions);
    view.destroy();
    modeButton.click();
    expect(onModeToggle).toHaveBeenCalledOnce();
    expect(app.$ui.$clipTimeline).toBeNull();
    playbackOptions.onClipChange({ sceneIndex: 0, sceneQuery: "water" });
    expect(header.querySelector(".watchSceneHeading__scene").textContent).toBe(
      "scene 2",
    );
  });

  it("clears its app references on destroy without clearing replacements", () => {
    vi.useFakeTimers();
    globalThis.Ox = { Element: createOxElement };
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
