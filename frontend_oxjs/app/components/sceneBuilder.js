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

    // Helper function to create and bind a scene textarea
    var createSceneElement = function (sceneObj, sceneIndex, $appendTo) {
      var $sceneContainer = Ox.Element()
        .addClass("sceneContainer")
        .appendTo($appendTo);

      var $sceneLabel = Ox.Element()
        .addClass("sceneLabel")
        .html("Scene " + (sceneIndex + 1))
        .appendTo($sceneContainer);

      // Create native textarea element
      var textarea = document.createElement("textarea");
      textarea.className = "sceneTextInput";
      textarea.placeholder =
        "Enter keywords (space-separated) • Enter to add scene";
      textarea.value = sceneObj.queryText;

      // Function to update scene from textarea
      var updateSceneFromTextarea = function () {
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
        sceneObj.queryText = updatedText;
        sceneObj.ast = parsedScene.ast;

        sceneObj.grammars = parsedScene.keywords.map(function (keyword, index) {
          return {
            name: keyword,
            operatorname:
              index < parsedScene.keywords.length - 1
                ? parsedScene.operator
                : "",
          };
        });
        console.log("Scene " + (sceneIndex + 1) + " updated:", {
          queryText: sceneObj.queryText,
          hasAST: sceneObj.ast !== null,
          grammars: sceneObj.grammars,
        });
      };

      // Bind change event
      textarea.addEventListener("change", function () {
        updateSceneFromTextarea();
        // Trigger save to IndexedDB
        if (typeof StorageManager !== "undefined") {
          StorageManager.save(app);
        }
      });

      // Bind Enter key (Ctrl+Enter) to create new scene
      textarea.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();

          // Update current scene
          updateSceneFromTextarea();

          // Create new scene
          var newScene = {
            name: "scene " + (scenes.length + 1),
            grammars: [],
            queryText: "",
            ast: null,
          };

          scenes.push(newScene);

          // Add new scene UI
          createSceneElement(newScene, scenes.length - 1, $container);

          // Trigger save to IndexedDB
          if (typeof StorageManager !== "undefined") {
            StorageManager.save(app);
          }

          // Focus the new textarea (it's the last one added)
          setTimeout(function () {
            var allTextareas = document.querySelectorAll(".sceneTextInput");
            if (allTextareas.length > 0) {
              allTextareas[allTextareas.length - 1].focus();
            }
          }, 10);
        }
      });

      // Append textarea to container
      $sceneContainer.append(textarea);
    };

    // Initialize all scenes
    scenes.forEach(function (scene, sceneIndex) {
      // Parse initial query if not already parsed
      if (!scene.ast && scene.queryText) {
        if (typeof window.SceneParser === "undefined") {
          console.warn("SceneParser not available yet");
        } else {
          var parsed = window.SceneParser.parse(scene.queryText);
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

      createSceneElement(scene, sceneIndex, $container);
    });

    return $container;
  },
};
