// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchClips, playClips } from "./ui.js";

function setupPlayback() {
  const videos = [];
  vi.stubGlobal("Ox", {
    VideoPlayer: vi.fn(() => {
      const video = {
        bindEvent: vi.fn(function (events) {
          this.events = events;
          return this;
        }),
        appendTo: vi.fn(),
        playInToOut: vi.fn(),
      };
      videos.push(video);
      return video;
    }),
    $: () => ({ remove: vi.fn() }),
  });
  const app = {
    data: {
      currentIndex: 0,
      screenplay: {
        scenes: [
          { queryText: "water", ast: { type: "KEYWORD", value: "water" } },
          { queryText: "night", ast: { type: "KEYWORD", value: "night" } },
        ],
      },
    },
    $ui: {
      $playVideoContainer: {
        find: () => ({ remove: vi.fn() }),
        width: () => 1280,
        height: () => 720,
      },
    },
  };
  return { app, videos };
}

describe("scene playback notifications", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retains source scenes when API responses arrive out of order", () => {
    const { app } = setupPlayback();
    const callbacks = [];
    vi.stubGlobal("APIService", {
      findClipsByAST: vi.fn((app, ast, callback) => callbacks.push(callback)),
    });
    const onClipChange = vi.fn();
    fetchClips(app, { onClipChange });

    callbacks[1]([{ title: "Night interview", videoAspectRatio: 16 / 9 }]);
    callbacks[0]([{ title: "Water interview", videoAspectRatio: 16 / 9 }]);

    expect(onClipChange).toHaveBeenCalledWith(
      expect.objectContaining({
        sceneIndex: 1,
        sceneQuery: "night",
      }),
    );
    expect(app.$ui.$clips[1]).toEqual(
      expect.objectContaining({
        sceneIndex: 0,
        sceneQuery: "water",
      }),
    );
  });

  it("notifies the page on selection and automatic advancement", () => {
    const { app, videos } = setupPlayback();
    const clips = [
      { sceneIndex: 0, sceneQuery: "water", videoAspectRatio: 16 / 9 },
      { sceneIndex: 1, sceneQuery: "night", videoAspectRatio: 16 / 9 },
    ];
    const onClipChange = vi.fn();

    playClips(app, clips, 0, { onClipChange });
    videos[0].events.ended();

    expect(onClipChange).toHaveBeenNthCalledWith(1, clips[0]);
    expect(onClipChange).toHaveBeenNthCalledWith(2, clips[1]);
    expect(app.data.currentIndex).toBe(1);
  });
});
