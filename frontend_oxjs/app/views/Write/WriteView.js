import { createHeader, destroyHeader } from "../../components/Header/Header.js";
import {
  createGenerativityControls,
  destroyGenerativityControls,
} from "../../components/GenerativityControls/GenerativityControls.js";
import { storageManager } from "../../core/Storage/StorageManager.js";
import {
  createSceneBuilder,
  destroySceneBuilder,
  renderSceneBuilder,
} from "../../components/SceneBuilder/SceneBuilder.js";
import { initializeScenes, updateSceneQuery } from "../sceneData.js";
import "./WriteView.css";

/**
 * Creates the write page with its header, scene editor, and generativity controls.
 * @param {{ app: Object, homeHref?: string, aboutHref?: string, guideHref?: string, onModeToggle?: () => void, onTitleChange?: (name: string) => void }} context
 * @returns {{ element: Object, destroy: () => void }}
 */
export function createWriteView({
  app,
  homeHref,
  aboutHref,
  guideHref,
  onModeToggle,
  onTitleChange,
}) {
  initializeScenes(app);

  const header = createHeader({
    mode: "write",
    screenplayName: app.data.screenplay.name,
    homeHref,
    aboutHref,
    guideHref,
    onModeToggle,
    onTitleChange,
  });
  const headerSection = Ox.Element().append(header);

  const scenes = app.data.screenplay.scenes;
  let focusTimeout = null;
  const saveScenes = function () {
    storageManager.save(app);
  };
  const handleSceneChange = function ({ sceneIndex, queryText }) {
    const scene = scenes[sceneIndex];
    if (scene && updateSceneQuery(scene, queryText)) {
      saveScenes();
    }
  };
  let sceneBuilder;
  const handleSceneAdd = function ({ sceneIndex, queryText }) {
    const scene = scenes[sceneIndex];
    if (!scene || !updateSceneQuery(scene, queryText)) return;

    scenes.push({
      name: `scene ${scenes.length + 1}`,
      grammars: [],
      queryText: "",
      ast: null,
    });
    renderSceneBuilder(sceneBuilder, scenes);
    saveScenes();

    clearTimeout(focusTimeout);
    focusTimeout = setTimeout(function () {
      const inputs = sceneBuilder.querySelectorAll(".sceneBuilder__input");
      inputs[inputs.length - 1]?.focus();
    }, 10);
  };
  sceneBuilder = createSceneBuilder({
    scenes,
    onSceneChange: handleSceneChange,
    onSceneAdd: handleSceneAdd,
  });
  const sceneBuilderPanel = Ox.Element().append(sceneBuilder);
  app.state.generativity = Object.assign(
    { length: "medium", sortBy: "relevance", limit: 10 },
    app.state.generativity,
  );
  const generativityControls = createGenerativityControls({
    initialValues: app.state.generativity,
    onChange(values) {
      app.state.generativity = values;
      storageManager.save(app);
    },
  });
  const generativityControlsPanel = Ox.Element().append(generativityControls);

  const content = Ox.SplitPanel({
    elements: [
      { element: sceneBuilderPanel },
      { element: generativityControlsPanel, size: 220 },
    ],
    orientation: "horizontal",
  }).addClass("writeLeftPanel");

  const element = Ox.SplitPanel({
    elements: [{ element: headerSection, size: 80 }, { element: content }],
    orientation: "vertical",
  });

  return {
    element,
    destroy() {
      clearTimeout(focusTimeout);
      destroyHeader(header);
      destroySceneBuilder(sceneBuilder);
      destroyGenerativityControls(generativityControls);
    },
  };
}
