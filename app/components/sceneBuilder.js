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

      var sceneKeywords = scene.grammars
        .map(function (g) {
          return g.name;
        })
        .join(" ");

      // Create native textarea element
      var textarea = document.createElement("textarea");
      textarea.className = "sceneTextInput";
      textarea.placeholder = "Enter keywords (space-separated)";
      textarea.value = sceneKeywords;

      // Bind change event directly to textarea
      textarea.addEventListener("change", function () {
        var updatedText = textarea.value;
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
        console.log("Scene " + (sceneIndex + 1) + " updated:", scene.grammars);
      });

      // Append textarea directly to container
      $sceneContainer.append(textarea);
    });

    return $container;
  },
};
