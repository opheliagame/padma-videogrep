/**
 * Scene Builder Component
 * Displays and manages scene inputs in write mode
 */

window.SceneBuilderComponent = {
  /**
   * Initialize all scenes with parsed AST
   * Call this after parser is loaded
   */
  initializeScenes: function (app) {
    if (typeof window.SceneParser === "undefined") {
      console.error("SceneParser not available");
      return;
    }

    app.data.screenplay.scenes.forEach(function (scene, idx) {
      if (!scene.ast && scene.queryText) {
        var parsed = window.SceneParser.parse(scene.queryText);
        scene.ast = parsed.ast;
        console.log("Scene " + (idx + 1) + " initialized with AST");
      }
    });
  },

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

      // Parse initial query if not already parsed
      if (!scene.ast && sceneKeywords) {
        if (typeof window.SceneParser === "undefined") {
          console.warn("SceneParser not available yet");
        } else {
          var parsed = window.SceneParser.parse(sceneKeywords);
          scene.queryText = sceneKeywords;
          scene.ast = parsed.ast;

          console.log("Initial parse for scene " + (sceneIndex + 1) + ":", {
            queryText: scene.queryText,
            ast: scene.ast,
            keywords: parsed.keywords,
            operator: parsed.operator,
            hasAST: parsed.ast !== null,
          });
        }
      }

      // Create native textarea element
      var textarea = document.createElement("textarea");
      textarea.className = "sceneTextInput";
      textarea.placeholder = "Enter keywords (space-separated)";
      textarea.value = sceneKeywords;

      // Bind change event directly to textarea
      textarea.addEventListener("change", function () {
        var updatedText = textarea.value;

        if (typeof window.SceneParser === "undefined") {
          console.error("SceneParser not available");
          return;
        }

        var parsedScene = window.SceneParser.parse(updatedText);

        console.log("Parsed query:", {
          text: updatedText,
          keywords: parsedScene.keywords,
          operator: parsedScene.operator,
          hasAST: parsedScene.ast !== null,
          ast: parsedScene.ast,
        });

        // Store AST and queryText on the scene
        scene.queryText = updatedText;
        scene.ast = parsedScene.ast;

        scene.grammars = parsedScene.keywords.map(function (keyword, index) {
          return {
            name: keyword,
            operatorname:
              index < parsedScene.keywords.length - 1
                ? parsedScene.operator
                : "",
          };
        });
        console.log("Scene " + (sceneIndex + 1) + " updated:", {
          queryText: scene.queryText,
          hasAST: scene.ast !== null,
          grammars: scene.grammars,
        });
      });

      // Append textarea directly to container
      $sceneContainer.append(textarea);
    });

    return $container;
  },
};
