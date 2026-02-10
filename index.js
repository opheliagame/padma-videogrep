"use strict";

const CORS_PROXY = "https://corsproxy.io/?url=";
const API_URL = `${CORS_PROXY}${"https://pad.ma/api"}`;

window.onerror = function (error, url) {
  if (!url) {
    console.error("Error loading application:", error);
  }
};

Ox.load(function () {
  var app = (window.oxjs = {
    $ui: {},
    data: {
      currentIndex: 0,
      screenplay: {
        name: "a story about water",
        scenes: [
          {
            name: "scene 1",
            grammars: [{ name: "water", operatorname: "and" }],
          },
          {
            name: "scene 2",
            grammars: [{ name: "bucket", operatorname: "and" }],
          },
        ],
      },
    },
    state: {
      loaded: false,
      mode: "write",
    },

    init: function () {
      Ox.load("UI", { theme: "oxlight" }, app.load);
    },

    load: function (browserSupported) {
      app.api = Ox.API({ url: API_URL }, function () {
        console.log("API initialized");
        app.$ui.appPanel = app.ui.appPanel().appendTo(Ox.$body);
        app.state.loaded = true;
      });
    },

    toggleMode: function () {
      app.state.mode = app.state.mode === "write" ? "play" : "write";
      console.log("Mode toggled to:", app.state.mode);

      // Rebuild both header and main panel with the new mode
      var $newHeader = app.ui.header();
      var $newMainPanel = app.ui.mainPanel();
      app.$ui.appPanel.replaceElement(0, $newHeader);
      app.$ui.appPanel.replaceElement(1, $newMainPanel);
    },

    ui: {
      appPanel: function () {
        return Ox.SplitPanel({
          elements: [
            { element: app.ui.header(), size: 80 },
            { element: app.ui.mainPanel() },
          ],
          orientation: "vertical",
        });
      },

      header: function () {
        return HeaderComponent.create(app);
      },

      mainPanel: function () {
        return UIComponents.mainPanel(app);
      },
    },
  });

  app.init();
});
