function makePlayUI(app) {
  var $formPanel = makeGrammarPanel(app);

  // LISTS

  var $videoListPanel = Ox.Element();
  app.ui.$videoListPanel = $videoListPanel;
  var $videoPanel = Ox.Element()
    .css({ overflow: "hidden", background: "red" })
    .bindEvent({
      // resize: function (data) {
      //   console.log(`resizing with ${data}`);
      //   $videoPanel.options.height = data.size;
      // },
    });
  app.ui.$videoPanel = $videoPanel;
  Ox.$window.on("resize", function (data) {
    console.log(`resizing window ${Ox.$window.width()}`);
    // var videoPanelWidth = Ox.$window.width() - 256;
    $("video").css({
      // height: (Ox.$window.width() - 256) / clip.videoAspectRatio,
      width: Ox.$window.width() - 256,
    });
  });
  var $videoTranscript = Ox.Element();
  app.ui.$videoTranscript = $videoTranscript;
  var $videoWithAnnotationsPanel = Ox.SplitPanel({
    elements: [
      {
        element: $videoListPanel,
        size: 256,
      },
      {
        element: $videoPanel,
      },
      {
        resizable: true,
        element: $videoTranscript,
        size: 24,
      },
    ],
    orientation: "vertical",
  }).css({
    // background: "red",
  });
  var $panel = Ox.SplitPanel({
    elements: [
      { element: $formPanel, size: 256 },
      { element: $videoWithAnnotationsPanel },
    ],
    orientation: "horizontal",
  });

  return $panel;
}

function makeGrammarPanel(app) {
  let scenes = app.data.screenplay.scenes;

  var $form = Ox.Form({
    id: "grammar-form",
    items: [
      ...scenes.map((scene, index) => {
        return Ox.ArrayInput({
          id: `scene-${index}`,
          description: "screenplay",
          input: {
            get: function () {
              var $input = Ox.FormElementGroup({
                elements: [
                  Ox.Select({
                    items: [
                      { id: "operator-and", title: "and" },
                      { id: "operator-or", title: "or" },
                    ],
                    overlap: "right",
                    width: 80,
                  }).bindEvent({
                    change: function () {
                      $input.options("elements")[1].focusInput();
                    },
                  }),
                  Ox.Input({
                    autovalidate: /[\w]/,
                    width: 128,
                  }),
                ],
              });
              return $input;
            },
            getEmpty: function () {
              return ["operator-and", ""];
            },
            isEmpty: function (value) {
              return value[1] === "";
            },
          },
          label: "build your scene",
          max: 6,
          width: 256,
          value: scene.grammars.map((g) => g.name),
        }).bindEvent({
          submit: function (data) {
            console.log(`submit form with ${data}`);
          },
        });
      }),
    ],
  });

  Ox.Button({
    id: "submit-button",
    selectable: true,
    title: "submit",
  })
    .bindEvent({
      change: function (value) {
        console.log($form.values());
        var tempSearchQuery = $form
          .values()
          ["scene-0"].map((grammar) => grammar[1]);

        console.log(`temp search query is [ ${tempSearchQuery} ]`);

        console.log("calling api");

        app.findClipsByTranscript(tempSearchQuery, "&", (items) => {
          app.playClips(items);
        });
      },
    })
    .appendTo($form);

  return $form;
}

function makeFormPanelOld() {
  var $formPanel = Ox.FormPanel({
    form: [
      {
        title: "search by transcript",
        items: [
          Ox.Input({
            id: "transcript-query",
            type: "text",
            label: "Search by transcript",
            labelWidth: 126,
            width: 256,
            clear: true,
            placeholder: "",
          }).bindEvent({
            change: function (data) {
              console.log("in change callback");
              console.log(data.value);
              findClipsByTranscript(data.value, (items) => {
                playClips(items);
              });
            },
          }),
          Ox.Button({
            id: "submit-button",
            title: "submit",
          }).bindEvent({
            // click: (value) => {
            //   var input_value = $input_transcript_query.options.value;
            //   console.log("finding on submit");
            //   console.log(input_value);
            //   window.findByTranscript(input_value);
            // },
          }),
        ],
        validate: function () {
          return true;
        },
      },
      // ).css({
      //     position: "absolute",
      //     width: "100%",
      //   }),
    ],
  });

  return $formPanel;
}

// // TODO find a better way to define in scope
// window.makePlayUI = function (app) {
//   return makePlayUI(app);
// };

export { makePlayUI };
