import { sceneParser } from "../core/SceneParser/SceneParser.js";

function updateScene(scene, queryText) {
  const parsedScene = sceneParser.parse(queryText);
  scene.queryText = queryText;
  scene.ast = parsedScene.ast;
  scene.grammars = parsedScene.keywords.map(function (keyword, index) {
    return {
      name: keyword,
      operatorname:
        index < parsedScene.keywords.length - 1 ? parsedScene.operator : "",
    };
  });
  return true;
}

export function initializeScenes(app) {
  app.data.screenplay.scenes.forEach(function (scene) {
    if (!scene.ast && scene.queryText) {
      updateScene(scene, scene.queryText);
    }
  });
}

export function updateSceneQuery(scene, queryText) {
  return updateScene(scene, queryText);
}
