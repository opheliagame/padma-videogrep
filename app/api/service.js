/**
 * API Service
 * Handles all API calls to pad.ma
 * Supports both simple keyword queries and complex AST-based queries
 */

window.APIService = {
  /**
   * Convert AST node to Pad.ma query condition
   * Recursively handles nested AND/OR operators
   * Flattens consecutive same-type operators
   */
  astToQueryCondition: function (node) {
    if (!node) return null;

    if (node.type === "KEYWORD") {
      // Simple keyword - becomes a transcript search
      return {
        key: "transcripts",
        value: node.value,
        operator: "=",
      };
    } else if (node.type === "AND" || node.type === "OR") {
      // Complex expression - recursively convert operands
      var operator = node.type === "AND" ? "&" : "|";
      var conditions = [];

      // Flatten consecutive same-type operators
      node.operands.forEach(function (operand) {
        var converted = APIService.astToQueryCondition(operand);

        if (
          converted &&
          converted.operator === operator &&
          converted.conditions
        ) {
          // Flatten: if converted is same operator type with conditions, spread them
          conditions = conditions.concat(converted.conditions);
        } else if (converted) {
          conditions.push(converted);
        }
      });

      if (conditions.length === 0) return null;
      if (conditions.length === 1) return conditions[0];

      // Multiple conditions - wrap in group
      return {
        conditions: conditions,
        operator: operator,
      };
    }

    return null;
  },

  /**
   * Build full API request from AST
   * Handles complex nested queries with proper precedence
   */
  buildRequestFromAST: function (ast) {
    var queryCondition = APIService.astToQueryCondition(ast);

    if (!queryCondition) {
      console.warn("AST conversion resulted in empty condition");
      return null;
    }

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
          queryCondition,
        ],
        operator: "&",
      },
    };

    return request;
  },

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
            operator: operator,
          },
        ],
        operator: "&",
      },
    };

    app.api.findClips(request, callback);
  },

  /**
   * Find clips using AST-based query for proper operator precedence
   */
  findClipsByAST: function (app, ast, callback) {
    console.log("Finding clips with AST query:", ast);

    var request = APIService.buildRequestFromAST(ast);

    if (!request) {
      console.error("Failed to build request from AST");
      callback([]);
      return;
    }

    console.log("Built API request:", request);

    app.api.findClips(request, function (result) {
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

      console.log("Found " + items.length + " clips");

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
