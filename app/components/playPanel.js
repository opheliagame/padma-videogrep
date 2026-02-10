/**
 * Play Panel Component
 * Displays video player and clip list in play mode
 */

window.PlayPanelComponent = {
  create: function (app) {
    var $mainContainer = Ox.Element().addClass("playMainContainer");
    var $videoPlayerContainer = Ox.Element().addClass("playVideoContainer");
    var $clipMetadata = Ox.Element().addClass("playClipMetadata");
    var $clipList = Ox.Element().addClass("playClipList");

    app.$ui.$playVideoContainer = $videoPlayerContainer;
    app.$ui.$clipMetadata = $clipMetadata;
    app.$ui.$clipList = $clipList;

    $videoPlayerContainer.append($clipMetadata);
    $mainContainer.append($videoPlayerContainer);
    $mainContainer.append($clipList);

    return $mainContainer;
  },

  renderClipList: function (app, items) {
    if (!app.$ui.$clipList) {
      console.error("Clip list container not found.");
      return;
    }

    app.$ui.$clipList.empty();

    items.forEach(function (item, index) {
      var $clipItem = Ox.Element()
        .addClass("clipItem")
        .css({
          padding: "10px",
          borderBottom: "1px solid rgb(200, 200, 200)",
          cursor: "pointer",
          color: app.data.currentIndex === index ? "blue" : "black",
        })
        .html(item.title)
        .bindEvent({
          click: function () {
            app.data.currentIndex = index;
            UIComponents.playClips(app, items);
          },
        });

      app.$ui.$clipList.append($clipItem);
    });
  },
};
