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
        : Ox.Element()
            .addClass("headerCenter")
            .html(
              '<h1 class="headerTitle">' + app.data.screenplay.name + "</h1>",
            );

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
