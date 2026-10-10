import { createHeader, destroyHeader } from "../../components/Header/Header.js";
import { fetchClips } from "../../components/ui.js";
import "./WatchView.css";

/**
 * Creates the watch-mode view using the existing OxJS layout primitives.
 * @param {{ app: Object }} context
 * @returns {{ element: Object, destroy: () => void }}
 */
export function createWatchView({ app, onModeToggle, onTitleChange }) {
  const header = createHeader({
    mode: "play",
    screenplayName: app.data.screenplay.name,
    currentScene: app.state.currentScene,
    onModeToggle,
    onTitleChange,
  });
  const headerSection = Ox.Element().append(header);

  const middleSection = Ox.Element().addClass("playSectionMiddle playmode");
  app.$ui.$playVideoContainer = middleSection;

  const bottomSection = Ox.Element().addClass("playSectionBottom playmode");
  const bottomContent = Ox.Element()
    .addClass("playBottomContent playmode")
    .appendTo(bottomSection);

  const scenePanel = Ox.Element()
    .addClass("playScenePanel playmode")
    .appendTo(bottomContent);
  Ox.Element().addClass("sceneHeader").html("Scenes").appendTo(scenePanel);

  const sceneList = Ox.Element()
    .addClass("playSceneList playmode")
    .appendTo(scenePanel);

  app.data.screenplay.scenes.forEach((scene, index) => {
    const sceneItem = Ox.Element().addClass("playSceneItem playmode");
    Ox.Element()
      .addClass("sceneLabel")
      .html("scene " + (index + 1))
      .appendTo(sceneItem);

    const queryText =
      scene.queryText ||
      (scene.grammars || []).map((grammar) => grammar.name).join(" ");
    Ox.Element()
      .addClass("playSceneQuery playmode")
      .html(queryText)
      .appendTo(sceneItem);

    sceneList.append(sceneItem);
  });

  const metadataPanel = Ox.Element()
    .addClass("playMetadataPanel playmode")
    .appendTo(bottomContent);
  const clipMetadata = Ox.Element()
    .addClass("playClipMetadata playmode")
    .appendTo(metadataPanel);
  app.$ui.$clipMetadata = clipMetadata;

  const content = Ox.SplitPanel({
    elements: [
      { element: middleSection, resize: [200, 400, 600] },
      { element: bottomSection, size: 200 },
    ],
    orientation: "vertical",
  }).addClass("playSplitPanel playmode");
  const element = Ox.SplitPanel({
    elements: [{ element: headerSection, size: 80 }, { element: content }],
    orientation: "vertical",
  });
  const fetchTimeout = setTimeout(() => fetchClips(app), 50);

  return {
    element,
    destroy() {
      clearTimeout(fetchTimeout);
      destroyHeader(header);
      if (app.$ui.$playVideoContainer === middleSection) {
        app.$ui.$playVideoContainer = null;
      }
      if (app.$ui.$clipMetadata === clipMetadata) {
        app.$ui.$clipMetadata = null;
      }
    },
  };
}
