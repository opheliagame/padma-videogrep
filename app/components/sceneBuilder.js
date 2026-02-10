/**
 * Scene Builder Component
 * Displays and manages scene inputs in write mode
 */

window.SceneBuilderComponent = {
  create: function (app) {
    var scenes = app.data.screenplay.scenes,
      $container = Ox.Element().addClass("writeSceneList");

    scenes.forEach(function (scene, sceneIndex) {
      var $sceneContainer = Ox.Element()
        .addClass("sceneContainer")
        .appendTo($container);

      var $sceneLabel = Ox.Element()
        .addClass("sceneLabel")
        .html("Scene " + (sceneIndex + 1))
        .appendTo($sceneContainer);

      var $sceneTextInput = Ox.Element()
        .addClass("sceneTextInput")
        .options({
          value: scene.grammars
            .map(function (g) {
              return g.name;
            })
            .join(" "),
        })
        .bindEvent({
          input: function () {
            var updatedText = $sceneTextInput.options("value");
            var parsedScene = SceneParser.parse(updatedText);
            scene.grammars = parsedScene.keywords.map(function (keyword, index) {
              return {
                name: keyword,
                operatorname:
                  index < parsedScene.keywords.length - 1
                    ? parsedScene.operator
                    : "",
              };
            });
          },
        })
        .appendTo($sceneContainer);

      $sceneTextInput.html($sceneTextInput.options("value"));
    });

    return $container;
  },
};
