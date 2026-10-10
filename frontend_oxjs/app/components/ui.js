/**
 * Playback actions shared by the Write and Watch pages.
 */

export function fetchClips(app) {
  console.log("Fetching clips...");
  console.log("Current containers:", {
    container: app.$ui.$playVideoContainer,
    metadata: app.$ui.$clipMetadata,
    list: app.$ui.$clipList,
  });

  var scenes = app.data.screenplay.scenes;
  var allClips = [];
  var processedScenes = 0;

  console.log("Total scenes to fetch:", scenes.length);

  scenes.forEach(function (scene, sceneIndex) {
    console.log("Scene " + (sceneIndex + 1) + " query:", scene.queryText);

    // Use AST-based query if available
    if (scene.ast) {
      APIService.findClipsByAST(app, scene.ast, function (clips) {
        allClips = allClips.concat(clips);
        processedScenes++;
        console.log(
          "Scene " +
            (sceneIndex + 1) +
            " (AST) processed. Total scenes: " +
            processedScenes +
            "/" +
            scenes.length,
        );

        if (processedScenes === scenes.length) {
          console.log("All clips fetched:", allClips);
          if (allClips.length > 0) {
            playClips(app, allClips);
          } else {
            console.warn("No clips found from any scene");
          }
        }
      });
    } else {
      // Fallback for scenes without AST
      console.warn("Scene " + (sceneIndex + 1) + " has no AST");
      processedScenes++;

      if (processedScenes === scenes.length) {
        console.log("All clips fetched:", allClips);
        if (allClips.length > 0) {
          playClips(app, allClips);
        } else {
          console.warn("No clips found from any scene");
        }
      }
    }
  });
}

export function playClips(app, items) {
  if (!items || items.length === 0) {
    console.error("No items to play");
    return;
  }

  if (app.data.currentIndex >= items.length) {
    console.log("All clips played");
    app.data.currentIndex = 0;
    return;
  }

  console.log("Playing clip " + (app.data.currentIndex + 1));
  var clip = items[app.data.currentIndex];

  // Ensure containers exist
  if (!app.$ui.$playVideoContainer) {
    console.error("Play video container not found");
    return;
  }

  // Clear previous video
  app.$ui.$playVideoContainer.find("video").remove();
  app.$ui.$playVideoContainer.find(".OxVideoPlayer").remove();

  // Update clip list highlighting
  var containerWidth = app.$ui.$playVideoContainer.width();
  var containerHeight = app.$ui.$playVideoContainer.height();

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
      playClips(app, items);
    },
  });

  if (app.$ui.$playVideoContainer) {
    video.appendTo(app.$ui.$playVideoContainer);
  } else if (app.$ui.$videoPanel) {
    video.appendTo(app.$ui.$videoPanel);
  }

  // Update metadata
  if (app.$ui.$clipMetadata) {
    var metadata = Ox.Element().addClass("playClipMetadata");

    var textDiv = Ox.Element()
      .addClass("metadata-text")
      .html(clip.title || "")
      .appendTo(metadata);

    var infoDiv = Ox.Element()
      .addClass("metadata-info")
      .html(
        (clip.source ? clip.source : "Interview") +
          "<br/>" +
          (clip.date
            ? clip.date
            : new Date().toISOString().split("T")[0].replace(/-/g, "/")),
      )
      .appendTo(metadata);

    app.$ui.$clipMetadata.empty().append(metadata);
  }

  video.playInToOut();
}
