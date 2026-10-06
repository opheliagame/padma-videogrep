/**
 * Play Panel Component
 * Displays video player with sections from top to bottom using SplitPanel
 */

window.PlayPanelComponent = {
  create: function (app) {
    // Middle section: Video player
    var $middleSection = Ox.Element().addClass("playSectionMiddle playmode");

    app.$ui.$playVideoContainer = $middleSection;

    // Bottom section: Metadata and scene list
    var $bottomSection = Ox.Element().addClass("playSectionBottom playmode");
    var $bottomContent = Ox.Element()
      .addClass("playBottomContent playmode")
      .appendTo($bottomSection);

    // Left: Scene list
    var $scenePanel = Ox.Element()
      .addClass("playScenePanel playmode")
      .appendTo($bottomContent);
    var $sceneHeader = Ox.Element()
      .addClass("sceneHeader")
      .html("Scenes")
      .appendTo($scenePanel);

    var $sceneList = Ox.Element()
      .addClass("playSceneList playmode")
      .appendTo($scenePanel);

    app.data.screenplay.scenes.forEach(function (scene, idx) {
      var $sceneItem = Ox.Element().addClass("playSceneItem playmode");

      var $sceneLabel = Ox.Element()
        .addClass("sceneLabel")
        .html("scene " + (idx + 1))
        .appendTo($sceneItem);

      var queryText =
        scene.queryText || scene.grammars.map((g) => g.name).join(" ");
      var $sceneQuery = Ox.Element()
        .addClass("playSceneQuery playmode")
        .html(queryText)
        .appendTo($sceneItem);

      $sceneList.append($sceneItem);
    });

    // Right: Metadata
    var $metadataPanel = Ox.Element()
      .addClass("playMetadataPanel playmode")
      .appendTo($bottomContent);
    var $clipMetadata = Ox.Element()
      .addClass("playClipMetadata playmode")
      .appendTo($metadataPanel);

    app.$ui.$clipMetadata = $clipMetadata;

    // Create vertical SplitPanel with three sections
    var $splitPanel = Ox.SplitPanel({
      elements: [
        {
          element: $middleSection,
          resize: [200, 400, 600],
        },
        {
          element: $bottomSection,
          size: 200,
        },
      ],
      orientation: "vertical",
    }).addClass("playSplitPanel playmode");

    return $splitPanel;
  },

  renderClipList: function (app, items) {
    // Not needed with new layout, but keep for compatibility
  },
};
