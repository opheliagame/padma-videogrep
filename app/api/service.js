/**
 * API Service
 * Handles all API calls to pad.ma
 */

window.APIService = {
  findByTranscript: function (app, value, operator, callback) {
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

  findClipsByTranscript: function (app, value, operator, callback) {
    APIService.findByTranscript(app, value, operator, function (result) {
      if (!result || !result.data || !result.data.items) {
        console.error("No clips found or invalid response from API.");
        callback([]);
        return;
      }

      var items = result.data.items;

      if (items.length === 0) {
        console.warn("No clips found for the given query.");
        callback([]);
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
};
