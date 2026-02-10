/**
 * Header Component
 * Displays the application header with title and mode toggle button
 */

window.HeaderComponent = {
  create: function (app) {
    var $header = Ox.Element().addClass("padmaHeader");

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
              '<h1 class="headerTitle">' +
                app.data.screenplay.name +
                "</h1>",
            );

    var $rightSection = Ox.Element().addClass("headerRight");

    var $modeButton = Ox.Button({
      title: app.state.mode === "play" ? "Fetch Clips" : "play mode",
      width: 120,
    })
      .addClass("headerModeButton playButton")
      .bindEvent({
        click: function () {
          if (app.state.mode === "play") {
            // Already in play mode, just fetch and play clips
            UIComponents.fetchClips(app);
          } else {
            // In write mode, toggle to play mode
            app.state.mode = "play";
            console.log("Mode toggled to:", app.state.mode);

            // Rebuild UI
            var $newHeader = HeaderComponent.create(app);
            var $newMainPanel = UIComponents.mainPanel(app);
            app.$ui.appPanel.replaceElement(0, $newHeader);
            app.$ui.appPanel.replaceElement(1, $newMainPanel);

            // After a small delay to allow DOM to settle, fetch clips
            setTimeout(function () {
              UIComponents.fetchClips(app);
            }, 50);
          }
        },
      })
      .appendTo($rightSection);

    $header.append($leftSection);
    $header.append($centerSection);
    $header.append($rightSection);

    return $header;
  },
};
