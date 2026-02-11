/**
 * Generativity Controls Component
 * Allows users to control API parameters for clip generation
 */

window.GenerativityControlsComponent = {
  create: function (app) {
    var $container = Ox.Element().addClass("generativityControls");

    var $title = Ox.Element()
      .addClass("generativityTitle")
      .html("generativity controls")
      .appendTo($container);

    // Initialize app.state.generativity if not exists
    if (!app.state.generativity) {
      app.state.generativity = {
        length: "medium", // short, medium, long
        sortBy: "relevance", // relevance, date, random
        limit: 10, // number of clips
      };
    }

    // Length control
    var $lengthControl = Ox.Element()
      .addClass("controlGroup")
      .appendTo($container);

    var $lengthLabel = Ox.Element()
      .addClass("controlLabel")
      .html("length")
      .appendTo($lengthControl);

    var lengthOptions = ["short", "medium", "long"];
    var $lengthOptions = Ox.Element()
      .addClass("lengthOptions")
      .appendTo($lengthControl);

    lengthOptions.forEach(function (option) {
      var $option = Ox.Element()
        .addClass("lengthOption")
        .html(option)
        .appendTo($lengthOptions);

      if (option === app.state.generativity.length) {
        $option.addClass("active");
      }

      $option.bindEvent({
        anyclick: function () {
          // Remove active from all
          document.querySelectorAll(".lengthOption").forEach(function (el) {
            el.classList.remove("active");
          });
          // Add active to clicked
          $option.addClass("active");

          app.state.generativity.length = option;
          console.log("Length set to:", option);

          // Save to storage
          if (typeof StorageManager !== "undefined") {
            StorageManager.save(app);
          }
        },
      });
    });

    // Sort control
    var $sortControl = Ox.Element()
      .addClass("controlGroup")
      .appendTo($container);

    var $sortLabel = Ox.Element()
      .addClass("controlLabel")
      .html("sort")
      .appendTo($sortControl);

    var $sortSelect = Ox.Select({
      items: [
        { id: "relevance", title: "Relevance" },
        { id: "date", title: "Date" },
        { id: "random", title: "Random" },
      ],
      value: app.state.generativity.sortBy,
    })
      .addClass("sortSelect")
      .bindEvent({
        change: function () {
          app.state.generativity.sortBy = $sortSelect.value;
          console.log("Sort set to:", $sortSelect.value);

          // Save to storage
          if (typeof StorageManager !== "undefined") {
            StorageManager.save(app);
          }
        },
      })
      .appendTo($sortControl);

    // Limit/count control
    var $limitControl = Ox.Element()
      .addClass("controlGroup")
      .appendTo($container);

    var $limitLabel = Ox.Element()
      .addClass("controlLabel")
      .html("clip count")
      .appendTo($limitControl);

    var $limitInput = Ox.Input({
      type: "number",
      value: String(app.state.generativity.limit),
      min: 1,
      max: 50,
    })
      .addClass("limitInput")
      .bindEvent({
        change: function (data) {
          var val = parseInt(data.value) || 10;
          val = Math.max(1, Math.min(50, val));
          app.state.generativity.limit = val;
          console.log("Limit set to:", val);

          // Save to storage
          if (typeof StorageManager !== "undefined") {
            StorageManager.save(app);
          }
        },
      })
      .appendTo($limitControl);

    // Length duration mapping
    var $durationInfo = Ox.Element()
      .addClass("durationInfo")
      .appendTo($container);

    var updateDurationInfo = function () {
      var durations = {
        short: "< 5 sec",
        medium: "5-15 sec",
        long: "> 15 sec",
      };
      $durationInfo.html(durations[app.state.generativity.length]);
    };
    updateDurationInfo();

    // Store reference for updates
    app.$ui.generativityControls = {
      $container: $container,
      updateDurationInfo: updateDurationInfo,
    };

    return $container;
  },
};
