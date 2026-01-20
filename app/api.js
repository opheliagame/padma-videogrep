// const CORS_PROXY = "https://corsproxy.io/?url=";
// const API_URL = `${CORS_PROXY}${"https://pad.ma/api"}`;

function findByTranscript(queryKeyword, callback) {
  var query = {
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
        { key: "transcripts", value: queryKeyword, operator: "=" },
      ],
      operator: "&",
    },

    itemsQuery: {
      conditions: [{ key: "transcripts", value: queryKeyword, operator: "=" }],
      operator: "&",
    },
  };
  api.findClips(query, callback);
}

function findById(id, callback) {
  var query = {
    id: id,
    keys: [
      "id",
      "title",
      "duration",
      "layers",
      "streams",
      "modified",
      "posterFrame",
    ],
  };

  api.get(query, callback);
}

function findClipsByTranscript(queryKeyword, callback) {
  findByTranscript(queryKeyword, (result) => {
    var items = result.data.items;

    var clips = items.map((i) => {
      var id = i.id.split("/")[0];
      var mediaUrl = `https://video28.pad.ma/${id}/240p1.mp4`;
      var timelineUrl = `https://media.pad.ma/${id}/timeline16p.jpg`;
      return {
        id: id,
        mediaUrl: mediaUrl,
        in: i.in,
        out: i.out,
        transcript: i.annotations[0].value,
        title: i.title,
        largeTimelineUrl: timelineUrl,
        annotations: i.annotations.map((a) => {
          return {
            in: i.in,
            out: i.out,
            text: a.value,
            // TODO how to find track language
            tracks: ["en"],
          };
        }),
        videoAspectRatio: i.videoRatio,
      };
    });

    var listItems = items.map((i) => {
      var id = i.id.split("/")[0];
      var mediaUrl = `https://video28.pad.ma/${id}/240p1.mp4`;
      var timelineUrl = `https://media.pad.ma/${id}/timeline16p.jpg`;
      return {
        id: i.id,
        mediaUrl: mediaUrl,
        in: i.in,
        out: i.out,
        // transcript: i.annotations[0].value,
        title: i.title,
        name: i.title,
        largeTimelineUrl: timelineUrl,

        videoAspectRatio: i.videoRatio,
      };
    });

    $videoList = Ox.TableList({
      // items: (data) => {
      //   return { items: [], size: 0 };
      // },
      columns: [
        {
          // align: "right",
          format: function (value) {
            return value;
          },
          id: "id",
          operator: "-",
          title: "id",
          width: 80,
          // visible: true,
        },

        {
          // align: "right",
          format: function (value) {
            return value;
          },
          id: "title",
          // operator: "-",
          title: "title",
          width: 80,
          visible: true,
        },
      ],
      columnsMovable: true,
      columnsRemovable: true,
      columnsVisible: true,
      scrollbarVisible: true,
      items: listItems,
      // itemWidth: 256,
      // itemHeight: 24,

      max: 1, // max selection is limited to 1
      unique: "id",
      // construct: (data) => {
      //   return Ox.ListItem({
      //     data: data,
      //     unique: "id",
      //     construct: (data) => {
      //       console.log(data);

      //       let item = listItems.filter((i) => i.id == data.id);
      //       console.log(item[0]);

      //       if (item.length != 0) {
      //         return Ox.Element()
      //           .text(item[0]["name"] ?? "title")
      //           .css({ width: 256 });
      //       } else {
      //         return Ox.Element().text("title");
      //       }
      //     },
      //   });
      // },
    })
      .bindEvent({
        open: function (data) {
          console.log(data);
        },
        select: function (data) {
          console.log(data);
        },
      })
      .appendTo($videoListPanel);

    // console.log(clips);
    // set video list data

    callback(clips);
  });
}
