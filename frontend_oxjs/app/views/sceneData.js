function updateScene(scene, queryText) {
  if (typeof window.SceneParser === "undefined") {
    console.error("SceneParser not available");
    return false;
  }

  const parsedScene = window.SceneParser.parse(queryText);
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
  if (typeof window.SceneParser === "undefined") {
    console.error("SceneParser not available");
    return;
  }

  app.data.screenplay.scenes.forEach(function (scene) {
    if (!scene.ast && scene.queryText) {
      updateScene(scene, scene.queryText);
    }
  });
}

export function updateSceneQuery(scene, queryText) {
  return updateScene(scene, queryText);
}
