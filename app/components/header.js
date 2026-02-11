/**
 * Header Component
 * Displays the application header with title and mode toggle button
 */

window.HeaderComponent = {
  create: function (app) {
    var $header = Ox.Element().addClass("padmaHeader");

    // Add playmode class if in play mode
    if (app.state.mode === "play") {
      $header.addClass("playmode");
    }

    var $leftSection =
      app.state.mode === "play" && app.state.currentScene
        ? Ox.Element()
            .addClass("headerLeft")
            .html(
              '<span class="headerBrand">scene ' +
                (app.state.currentScene.index + 1) +
                "</span>",
            )
        : Ox.Element()
            .addClass("headerLeft")
            .html('<span class="headerBrand">padma videogrep</span>');

    var $centerSection =
      app.state.mode === "play" && app.state.currentScene
        ? Ox.Element()
            .addClass("headerCenter")
            .html(
              '<h1 class="headerTitle headerQuery">' +
                app.state.currentScene.query +
                "</h1>",
            )
        : Ox.Element().addClass("headerCenter headerTitleEditable");

    // Create or reuse editable title elements
    if (!app.$ui.titleDisplay) {
      var $titleDisplay = Ox.Element()
        .addClass("headerTitleDisplay")
        .html(app.data.screenplay.name);

      var $titleInput = Ox.Input({
        value: app.data.screenplay.name,
      })
        .addClass("headerTitleInput")
        .hide();

      // Save on blur or Enter
      var saveTitle = function () {
        var newName = $titleInput.value().trim();
        if (newName && newName !== app.data.screenplay.name) {
          app.data.screenplay.name = newName;
          $titleDisplay.html(newName);
        }
        app.state.editingTitle = false;
        $titleInput.hide();
        $titleDisplay.show();
      };

      // Bind events once during creation
      $titleDisplay.bindEvent({
        anyclick: function () {
          if (app.state.mode === "play") return;
          app.state.editingTitle = true;
          $titleDisplay.hide();
          $titleInput.show();
          $titleInput.focusInput();
        },
      });

      $titleInput.bindEvent({
        blur: saveTitle,
        submit: function () {
          saveTitle();
          app.state.editingTitle = false;
          $titleInput.hide();
          $titleDisplay.show();
        },
      });

      app.$ui.titleDisplay = $titleDisplay;
      app.$ui.titleInput = $titleInput;
    } else {
      // Update value in case screenplay name changed externally
      app.$ui.titleDisplay.html(app.data.screenplay.name);
      app.$ui.titleInput.value(app.data.screenplay.name);
    }

    // Show/hide based on mode and conditionally append
    if (app.state.mode !== "play" || !app.state.currentScene) {
      // Only append if not already a child
      if (!app.$ui.titleDisplay.$element.parentNode) {
        $centerSection.append(app.$ui.titleDisplay);
        $centerSection.append(app.$ui.titleInput);
      }
      app.$ui.titleDisplay.show();
    } else {
      app.$ui.titleDisplay.hide();
      app.$ui.titleInput.hide();
    }

    var $rightSection = Ox.Element().addClass("headerRight");

    var $modeButton = Ox.Button({
      title: app.state.mode === "play" ? "Write" : "Play",
      width: 100,
    })
      .addClass("headerModeButton playButton")
      .bindEvent({
        click: function () {
          // Toggle between modes
          app.state.mode = app.state.mode === "play" ? "write" : "play";
          console.log("Mode toggled to:", app.state.mode);

          // Update URL
          var newPath = window.location.pathname + "#" + app.state.mode;
          window.history.pushState({ mode: app.state.mode }, "", newPath);

          // Rebuild UI
          var $newHeader = HeaderComponent.create(app);
          var $newMainPanel = UIComponents.mainPanel(app);
          app.$ui.appPanel.replaceElement(0, $newHeader);
          app.$ui.appPanel.replaceElement(1, $newMainPanel);

          // If switching to play mode, fetch clips
          if (app.state.mode === "play") {
            setTimeout(function () {
              UIComponents.fetchClips(app);
            }, 50);
          }
        },
      })
      .appendTo($rightSection);

    $leftSection.append($centerSection);
    $header.append($leftSection);
    $header.append($rightSection);

    return $header;
  },
};
