import {
  createWatchSceneHeading,
  destroyWatchSceneHeading,
  updateWatchSceneHeading,
} from "../../components/WatchSceneHeading/WatchSceneHeading.js";
import { fetchClips, playClips } from "../../components/ui.js";
import {
  createClipTimeline,
  destroyClipTimeline,
} from "../../components/ClipTimeline/ClipTimeline.js";
import { initializeScenes } from "../sceneData.js";
import "./WatchView.css";

/**
 * Creates the watch-mode view using the existing OxJS layout primitives.
 * @param {{ app: Object }} context
 * @returns {{ element: Object, destroy: () => void }}
 */
export function createWatchView({ app, onModeToggle }) {
  initializeScenes(app);

  const activeScene = app.data.screenplay.scenes[0] || {};
  const heading = createWatchSceneHeading({
    index: 0,
    query: activeScene.queryText || "",
    onModeToggle,
  });
  const headerSection = Ox.Element()
    .addClass("watchStage__header")
    .append(heading);
  let isMounted = true;
  const playbackOptions = {
    onClipChange(clip) {
      if (!isMounted) return;
      const index = clip.sceneIndex ?? 0;
      const scene = app.data.screenplay.scenes[index] || {};
      updateWatchSceneHeading(heading, {
        index,
        query: clip.sceneQuery ?? scene.queryText ?? "",
      });
    },
  };

  const page = Ox.Element().addClass("watchPage");
  const stage = Ox.Element().addClass("watchStage");
  const middleSection = Ox.Element().addClass("playSectionMiddle");
  app.$ui.$playVideoContainer = middleSection;

  const metadataPanel = Ox.Element().addClass("watchStage__metadata");
  const clipMetadata = Ox.Element()
    .addClass("playClipMetadata")
    .appendTo(metadataPanel);
  app.$ui.$clipMetadata = clipMetadata;

  const timeline = createClipTimeline({
    onSelect(index) {
      if (app.$ui.$clips) {
        playClips(app, app.$ui.$clips, index, playbackOptions);
      }
    },
  });
  app.$ui.$clipTimeline = timeline;
  const timelinePanel = Ox.Element()
    .addClass("watchStage__timeline")
    .append(timeline);

  stage
    .append(headerSection)
    .append(middleSection)
    .append(metadataPanel)
    .append(timelinePanel);
  page.append(stage);

  const fetchTimeout = setTimeout(() => fetchClips(app, playbackOptions), 50);

  return {
    element: page,
    destroy() {
      isMounted = false;
      clearTimeout(fetchTimeout);
      destroyWatchSceneHeading(heading);
      destroyClipTimeline(timeline);
      if (app.$ui.$playVideoContainer === middleSection) {
        app.$ui.$playVideoContainer = null;
      }
      if (app.$ui.$clipMetadata === clipMetadata) {
        app.$ui.$clipMetadata = null;
      }
      if (app.$ui.$clipTimeline === timeline) {
        app.$ui.$clipTimeline = null;
      }
    },
  };
}
