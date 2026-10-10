import { createHeader, destroyHeader } from "./app/components/Header/Header.js";
import { createAboutView } from "./app/views/About/AboutView.js";

// NOTE: Replace 'YOUR_SECRET_KEY' with a value loaded from environment variables during build
const CORS_PROXY = "https://corsproxy.io/?key=process.env.CORS_PROXY_KEY&url=";
const API_URL = `${CORS_PROXY}${"https%3A%2F%2Fpad.ma%2Fapi"}`;

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
            grammars: [{ name: "water", operatorname: "&" }],
            queryText: "water",
            ast: null,
          },
        ],
      },
      generativity: {},
    },
    state: {
      loaded: false,
      mode: "write",
    },

    init: function () {
      // Initialize storage and load saved data
      StorageManager.init(function (dbReady) {
        if (dbReady) {
          StorageManager.load(function (savedData) {
            if (savedData) {
              // Restore saved state and data
              app.state = Object.assign(app.state, savedData.state);
              app.data = Object.assign(app.data, savedData.data);
              console.log("App state restored from IndexedDB");
            }
          });
        }

        Ox.load("UI", { theme: "padmavideogrep" }, app.load);
      });
    },

    load: function (browserSupported) {
      var routeMode = window.location.hash.slice(1);
      if (routeMode === "write" || routeMode === "play") {
        app.state.mode = routeMode;
      }

      var currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
      if (currentPath === "/about") {
        app.$ui.aboutView = createAboutView({
          mode: app.state.mode,
          screenplayName: app.data.screenplay.name,
          navigate: function (path) {
            if (app.$ui.aboutView) {
              app.$ui.aboutView.destroy();
              app.$ui.aboutView = null;
            }
            window.location.assign(path);
          },
        });
        document.body.appendChild(app.$ui.aboutView.element);
        return;
      }

      app.api = Ox.API({ url: API_URL }, function () {
        console.log("API initialized");

        // Initialize scenes with parsed AST
        if (
          typeof SceneBuilderComponent !== "undefined" &&
          SceneBuilderComponent.initializeScenes
        ) {
          SceneBuilderComponent.initializeScenes(app);
        }

        app.$ui.appPanel = app.ui.appPanel().appendTo(Ox.$body);
        app.state.loaded = true;

        // Set up auto-save on state/data changes
        app.setupAutoSave();
      });
    },

    setupAutoSave: function () {
      // Debounce save to avoid too frequent writes
      var saveTimeout;
      var originalDataProxy = app.data;

      // Create a function to handle saves
      var triggerSave = function () {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(function () {
          StorageManager.save(app);
        }, 1000); // Save after 1 second of no changes
      };

      // Override data assignment to trigger saves
      window.addEventListener("change", triggerSave);
    },

    toggleMode: function () {
      app.state.mode = app.state.mode === "write" ? "play" : "write";
      console.log("Mode toggled to:", app.state.mode);

      var newPath = window.location.pathname + "#" + app.state.mode;
      window.history.pushState({ mode: app.state.mode }, "", newPath);

      // Rebuild both header and main panel with the new mode
      var $newHeader = app.ui.header();
      var $newMainPanel = app.ui.mainPanel();
      app.$ui.appPanel.replaceElement(0, $newHeader);
      app.$ui.appPanel.replaceElement(1, $newMainPanel);

      if (app.state.mode === "play") {
        setTimeout(function () {
          UIComponents.fetchClips(app);
        }, 50);
      }
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
        if (app.$ui.headerElement) {
          destroyHeader(app.$ui.headerElement);
        }

        var headerElement = createHeader({
          mode: app.state.mode,
          screenplayName: app.data.screenplay.name,
          currentScene: app.state.currentScene,
          onTitleChange: function (newName) {
            app.data.screenplay.name = newName;
            if (typeof StorageManager !== "undefined") {
              StorageManager.save(app);
            }
          },
          onModeToggle: app.toggleMode,
        });

        app.$ui.headerElement = headerElement;
        return Ox.Element().append(headerElement);
      },

      mainPanel: function () {
        return UIComponents.mainPanel(app);
      },
    },
  });

  app.init();
});
