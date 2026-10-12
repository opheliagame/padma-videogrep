/**
 * Playback actions shared by the Write and Watch pages.
 */
import { updateClipTimeline } from "./ClipTimeline/ClipTimeline.js";
import { createClipMetadata } from "./ClipMetadata/ClipMetadata.js";

export function fetchClips(app, playbackOptions = {}) {
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
        allClips = allClips.concat(
          clips.map((clip) => ({
            ...clip,
            sceneIndex,
            sceneQuery:
              scene.queryText ||
              (scene.grammars || []).map((grammar) => grammar.name).join(" "),
          })),
        );
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
            playClips(app, allClips, 0, playbackOptions);
          } else {
            app.$ui.$clips = [];
            updateClipTimeline(app.$ui.$clipTimeline, []);
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
          playClips(app, allClips, 0, playbackOptions);
        } else {
          app.$ui.$clips = [];
          updateClipTimeline(app.$ui.$clipTimeline, []);
          console.warn("No clips found from any scene");
        }
      }
    }
  });
}

export function playClips(
  app,
  items,
  clipIndex = app.data.currentIndex,
  playbackOptions = {},
) {
  if (!items || items.length === 0) {
    updateClipTimeline(app.$ui.$clipTimeline, []);
    console.error("No items to play");
    return;
  }

  if (clipIndex >= items.length) {
    console.log("All clips played");
    app.data.currentIndex = 0;
    updateClipTimeline(app.$ui.$clipTimeline, items, 0);
    return;
  }

  app.data.currentIndex = clipIndex;
  app.$ui.$clips = items;
  updateClipTimeline(app.$ui.$clipTimeline, items, clipIndex);
  console.log("Playing clip " + (clipIndex + 1));
  var clip = items[clipIndex];

  // Ensure containers exist
  if (!app.$ui.$playVideoContainer) {
    console.error("Play video container not found");
    return;
  }
  playbackOptions.onClipChange?.(clip);

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
      playClips(app, items, clipIndex + 1, playbackOptions);
    },
  });

  if (app.$ui.$playVideoContainer) {
    video.appendTo(app.$ui.$playVideoContainer);
  } else if (app.$ui.$videoPanel) {
    video.appendTo(app.$ui.$videoPanel);
  }

  // Update metadata
  if (app.$ui.$clipMetadata) {
    app.$ui.$clipMetadata.empty().append(createClipMetadata({ clip }));
  }

  video.playInToOut();
}
