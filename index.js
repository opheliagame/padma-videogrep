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

      // Rebuild the main panel with the new mode
      var $newMainPanel = app.ui.mainPanel();
      app.$ui.appPanel.replaceElement(1, $newMainPanel);
    },

    parseScene: function (sceneText) {
      // Simple scene parser that handles "and", "or", and brackets
      // Returns array of keywords and the operator structure

      // Remove extra spaces and normalize
      sceneText = sceneText.trim().replace(/\s+/g, " ");

      // Extract all keywords (words that aren't operators or brackets)
      var keywords = [];
      var tokens = sceneText.split(/\s+/);
      var hasOr = sceneText.toLowerCase().includes(" or ");
      var operator = hasOr ? "|" : "&";

      tokens.forEach(function (token) {
        var lowerToken = token.toLowerCase();
        if (
          lowerToken !== "and" &&
          lowerToken !== "or" &&
          token !== "(" &&
          token !== ")"
        ) {
          keywords.push(token);
        }
      });

      return {
        keywords: keywords,
        operator: operator,
        originalText: sceneText,
      };
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
        return app.ui.createHeader();
      },

      mainPanel: function () {
        return app.state.mode === "play"
          ? app.ui.playPanel()
          : app.ui.leftPanel();
      },

      leftPanel: function () {
        return app.ui.createLeftPanel();
      },

      sceneBuilder: function () {
        return app.ui.createSceneBuilder();
      },

      playPanel: function () {
        return app.ui.createPlayPanel();
      },

      createHeader: function () {
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
                app.toggleMode();
              } else {
                app.ui.fetchClips();
                app.toggleMode();
              }
            },
          })
          .appendTo($rightSection);

        $header.append($leftSection);
        $header.append($centerSection);
        $header.append($rightSection);

        return $header;
      },

      createLeftPanel: function () {
        var $sceneBuilder = app.ui.createSceneBuilder();

        return Ox.Element()
          .addClass("writeLeftPanel")
          .append(
            Ox.Element().addClass("sceneHeader").html("Scenes"),
            $sceneBuilder,
          );
      },

      createSceneBuilder: function () {
        var scenes = app.data.screenplay.scenes,
          $container = Ox.Element().addClass("writeSceneList");

        scenes.forEach(function (scene, sceneIndex) {
          var $sceneContainer = Ox.Element()
            .addClass("sceneContainer")
            .appendTo($container);

          var $sceneLabel = Ox.Element()
            .addClass("sceneLabel")
            .html("Scene " + (sceneIndex + 1))
            .appendTo($sceneContainer);

          var $sceneTextInput = Ox.Element()
            .addClass("sceneTextInput")
            .options({
              value: scene.grammars
                .map(function (g) {
                  return g.name;
                })
                .join(" "),
            })
            .bindEvent({
              input: function () {
                var updatedText = $sceneTextInput.options("value");
                var parsedScene = app.parseScene(updatedText);
                scene.grammars = parsedScene.keywords.map(
                  function (keyword, index) {
                    return {
                      name: keyword,
                      operatorname:
                        index < parsedScene.keywords.length - 1
                          ? parsedScene.operator
                          : "",
                    };
                  },
                );
              },
            })
            .appendTo($sceneContainer);

          $sceneTextInput.html($sceneTextInput.options("value"));
        });

        return $container;
      },

      createPlayPanel: function () {
        var $videoPlayerContainer = Ox.Element().addClass("playVideoContainer");

        var $clipMetadata = Ox.Element().addClass("playClipMetadata");

        app.$ui.$playVideoContainer = $videoPlayerContainer;
        app.$ui.$clipMetadata = $clipMetadata;

        $videoPlayerContainer.append($clipMetadata);

        var $clipList = Ox.Element().addClass("playClipList");

        app.$ui.$clipList = $clipList;

        return $videoPlayerContainer;
      },

      fetchClips: function () {
        console.log("Fetching clips...");

        var scenes = app.data.screenplay.scenes
          .map(function (scene) {
            return scene.grammars.map(function (g) {
              return g.name;
            });
          })
          .flat();

        var allClips = [];
        var processedScenes = 0;

        // scenes.forEach(function (scene, index) {
        //   var operator = app.data.screenplay.scenes[index].grammars.some(
        //     function (g) {
        //       return g.operatorname === "or";
        //     },
        //   )
        //     ? "|"
        //     : "&";
        // });

        let tempOperator = "&";

        console.log(`debug, ${scenes}`);

        app.findClipsByTranscript(scenes, tempOperator, function (clips) {
          allClips = allClips.concat(clips);
          processedScenes++;

          if (processedScenes === scenes.length) {
            console.log("All clips fetched:", allClips);
            app.playClips(allClips);
          }
        });
      },
    },

    // API Methods
    findByTranscript: function (value, operator, callback) {
      var request = {
        keys: ["title", "annotations", "id", "in", "out", "videoRatio"],
        range: [0, 100],
        sort: [{ key: "title", operator: "+" }],
        query: {
          conditions: [
            {
              key: "layer",
              operator: "&",
              value: [
                "transcripts",
                "keywords",
                "places",
                "events",
                "descriptions",
              ],
            },

            {
              conditions: value.map(function (v) {
                return {
                  key: "transcripts",
                  value: v,
                  operator: "=",
                };
              }),
              operator: "&",
            },
          ],
          operator: "&",
        },
      };

      app.api.findClips(request, callback);
    },

    findClipsByTranscript: function (value, operator, callback) {
      app.findByTranscript(value, operator, function (result) {
        if (!result || !result.data || !result.data.items) {
          console.error("No clips found or invalid response from API.");
          return;
        }

        var items = result.data.items;

        if (items.length === 0) {
          console.warn("No clips found for the given query.");
          return;
        }

        var clips = items.map(function (i) {
          var id = i.id.split("/")[0];
          var mediaUrl = "https://video28.pad.ma/" + id + "/240p1.mp4";
          var timelineUrl = "https://media.pad.ma/" + id + "/timeline16p.jpg";

          return {
            id: id,
            mediaUrl: mediaUrl,
            in: i.in,
            out: i.out,
            transcript: i.annotations[0]?.value || "",
            title: i.title,
            largeTimelineUrl: timelineUrl,
            annotations: i.annotations.map(function (a) {
              return {
                in: i.in,
                out: i.out,
                text: a.value,
                tracks: ["en"],
              };
            }),
            videoAspectRatio: i.videoRatio || 16 / 9,
          };
        });

        callback(clips);
      });
    },

    playClips: function (items) {
      if (app.data.currentIndex >= items.length) {
        console.log("All clips played");
        app.data.currentIndex = 0;
        return;
      }

      console.log("Playing clip " + (app.data.currentIndex + 1));
      var clip = items[app.data.currentIndex];

      // Clear previous video
      if (app.$ui.$playVideoContainer) {
        app.$ui.$playVideoContainer.find("video").remove();
        app.$ui.$playVideoContainer.find(".OxVideoPlayer").remove();
      }

      // Update clip list highlighting
      if (app.$ui.$clipList) {
        app.renderClipList(items);
      }

      var containerWidth = app.$ui.$playVideoContainer
        ? app.$ui.$playVideoContainer.width()
        : Ox.$window.width() - 280;
      var containerHeight = app.$ui.$playVideoContainer
        ? app.$ui.$playVideoContainer.height()
        : Ox.$window.height() - 80;

      var videoWidth = containerWidth;
      var videoHeight = videoWidth / clip.videoAspectRatio;

      if (videoHeight > containerHeight) {
        videoHeight = containerHeight;
        videoWidth = videoHeight * clip.videoAspectRatio;
      }

      var video = Ox.VideoPlayer({
        height: videoHeight,
        width: videoWidth,
        video: clip.mediaUrl,
        in: clip.in,
        out: clip.out,
        enableSubtitles: false,
        enableAnnotations: false,
        subtitles: clip.annotations,
        subtitlesTrack: "en",
        getLargeTimelineURL: clip.largeTimelineUrl,
      }).bindEvent({
        ended: function () {
          console.log("Video ended");
          Ox.$(video).remove();
          app.data.currentIndex++;
          app.playClips(items);
        },
      });

      if (app.$ui.$playVideoContainer) {
        video.appendTo(app.$ui.$playVideoContainer);
      } else if (app.$ui.$videoPanel) {
        video.appendTo(app.$ui.$videoPanel);
      }

      // Update metadata
      if (app.$ui.$clipMetadata) {
        app.$ui.$clipMetadata.html(
          "<div>" +
            clip.title +
            "</div>" +
            '<div style="font-size: 12px; margin-top: 4px;">' +
            new Date().toISOString().split("T")[0].replace(/-/g, "/") +
            "</div>",
        );
      }

      video.playInToOut();
    },

    renderClipList: function (items) {
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
              app.playClips(items);
            },
          });

        app.$ui.$clipList.append($clipItem);
      });
    },
  });

  app.init();
});
