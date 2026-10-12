import { createAboutView } from "./app/views/About/AboutView.js";
import { createLandingView } from "./app/views/Landing/LandingView.js";
import { createWatchView } from "./app/views/Watch/WatchView.js";
import { createWriteView } from "./app/views/Write/WriteView.js";
import { storageManager } from "./app/core/Storage/StorageManager.js";

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
      storageManager.init(function (dbReady) {
        if (dbReady) {
          storageManager.load(function (savedData) {
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

    modeFromLocation: function () {
      var currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
      if (currentPath === "/watch") {
        return "play";
      }
      if (currentPath === "/write") {
        return "write";
      }
      return window.location.hash.slice(1) === "play" ? "play" : "write";
    },

    load: function (browserSupported) {
      app.state.mode = app.modeFromLocation();
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

      if (currentPath === "/") {
        app.$ui.landingView = createLandingView({
          onExited: function () {
            app.$ui.landingView.destroy();
            app.$ui.landingView = null;
          },
        });
        document.body.appendChild(app.$ui.landingView.element);
      }

      app.api = Ox.API({ url: API_URL }, function () {
        console.log("API initialized");

        app.ui.renderModePage();
        if (app.$ui.landingView) {
          // renderModePage empties the body, so put the landing back on top before fading
          document.body.appendChild(app.$ui.landingView.element);
          app.$ui.landingView.exit();
        }
        app.state.loaded = true;
        window.addEventListener("popstate", app.handlePopState);

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
          storageManager.save(app);
        }, 1000); // Save after 1 second of no changes
      };

      // Override data assignment to trigger saves
      window.addEventListener("change", triggerSave);
    },

    toggleMode: function () {
      app.state.mode = app.state.mode === "write" ? "play" : "write";
      console.log("Mode toggled to:", app.state.mode);

      var newPath = app.state.mode === "play" ? "/watch" : "/write";
      window.history.pushState({ mode: app.state.mode }, "", newPath);
      app.ui.renderModePage();
    },

    handlePopState: function () {
      var currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
      if (currentPath === "/about") {
        window.location.reload();
        return;
      }
      app.state.mode = app.modeFromLocation();
      app.ui.renderModePage();
    },

    ui: {
      renderModePage: function () {
        if (app.$ui.activePage) {
          app.$ui.activePage.destroy();
          app.$ui.activePage = null;
        }
        Ox.$body.empty();

        var createPage =
          app.state.mode === "play" ? createWatchView : createWriteView;
        app.$ui.activePage = createPage({
          app: app,
          onModeToggle: app.toggleMode,
          onTitleChange: function (newName) {
            app.data.screenplay.name = newName;
            storageManager.save(app);
          },
        });
        app.$ui.activePage.element.appendTo(Ox.$body);
        return app.$ui.activePage;
      },
    },
  });

  app.init();
});
