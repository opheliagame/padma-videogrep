// BACKUP: Old rightPanel implementation from write mode
// Saved on: 2026-02-01
// This was the original concept with video list, video panel, and transcript

function rightPanel_BACKUP() {
  app.$ui.$videoListPanel = Ox.Element().css({
    background: "rgb(250, 250, 250)",
  });

  app.$ui.$videoPanel = Ox.Element().css({
    overflow: "hidden",
    background: "rgb(240, 240, 240)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  app.$ui.$videoTranscript = Ox.Element().css({
    padding: "12px 16px",
    background: "rgb(250, 250, 250)",
    borderTop: "1px solid rgb(200, 200, 200)",
    overflowY: "auto",
  });

  Ox.$window.on("resize", function () {
    $("video").css({
      width: Ox.$window.width() - 320,
    });
  });

  return Ox.SplitPanel({
    elements: [
      { element: app.$ui.$videoListPanel, size: 256 },
      { element: app.$ui.$videoPanel },
      { element: app.$ui.$videoTranscript, size: 120, resizable: true },
    ],
    orientation: "vertical",
  });
}

// Related findClipsByTranscript code that used this panel:
/*
var $videoList = Ox.TableList({
  columns: [
    {
      format: function (value) {
        return value;
      },
      id: "id",
      operator: "-",
      title: "id",
      width: 80,
    },
    {
      format: function (value) {
        return value;
      },
      id: "title",
      title: "title",
      width: 150,
      visible: true,
    },
  ],
  columnsMovable: true,
  columnsRemovable: true,
  columnsVisible: true,
  scrollbarVisible: true,
  items: listItems,
  max: 1,
  unique: "id",
})
  .bindEvent({
    select: function (data) {
      console.log("Selected:", data);
    },
  })
  .appendTo(app.$ui.$videoListPanel);
*/
