import { createHeader, destroyHeader } from "../../components/Header/Header.js";
import "./WriteView.css";

/**
 * Creates the write page with its header, scene editor, and generativity controls.
 * @param {{ app: Object, onModeToggle?: () => void, onTitleChange?: (name: string) => void }} context
 * @returns {{ element: Object, destroy: () => void }}
 */
export function createWriteView({ app, onModeToggle, onTitleChange }) {
  const header = createHeader({
    mode: "write",
    screenplayName: app.data.screenplay.name,
    onModeToggle,
    onTitleChange,
  });
  const headerSection = Ox.Element().append(header);

  const sceneBuilder = window.SceneBuilderComponent.create(app);
  const generativityControls = window.GenerativityControlsComponent.create(app);
  const controlsReference = app.$ui.generativityControls;

  const content = Ox.SplitPanel({
    elements: [
      { element: sceneBuilder },
      { element: generativityControls, size: 220 },
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
      destroyHeader(header);
      if (app.$ui.generativityControls === controlsReference) {
        app.$ui.generativityControls = null;
      }
    },
  };
}
