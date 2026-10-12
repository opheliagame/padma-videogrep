import "./Header.css";

/**
 * Creates the application header from display state and callbacks.
 * @param {Object} props
 * @returns {HTMLElement}
 */
const headerCleanup = new WeakMap();

export function createHeader({
  mode = "write",
  screenplayName = "",
  aboutHref,
  modeLabel,
  onTitleChange,
  onModeToggle,
} = {}) {
  var isPlayMode = mode === "play";
  var header = document.createElement("header");
  var listeners = [];

  header.className = "padmaHeader" + (isPlayMode ? " playmode" : "");
  header.setAttribute("role", "banner");

  var listen = function (element, eventName, handler) {
    element.addEventListener(eventName, handler);
    listeners.push(function () {
      element.removeEventListener(eventName, handler);
    });
  };

  var leftSection = document.createElement("div");
  leftSection.className = "headerLeft";

  var brand = document.createElement("span");
  brand.className = "headerBrand";
  brand.textContent = "pad.ma videogrep";
  if (aboutHref) {
    var aboutLink = document.createElement("a");
    aboutLink.className = "headerLink";
    aboutLink.href = aboutHref;
    aboutLink.textContent = "about";
    brand.append("・", aboutLink);
  }
  leftSection.append(brand);

  var centerSection = document.createElement("div");
  centerSection.className = "headerCenter headerTitleEditable";

  var titleDisplay = document.createElement("button");
  titleDisplay.type = "button";
  titleDisplay.className = "headerTitleDisplay";
  titleDisplay.textContent = screenplayName;
  titleDisplay.setAttribute("aria-expanded", "false");
  titleDisplay.setAttribute("aria-controls", "headerTitleInput");

  var titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.id = "headerTitleInput";
  titleInput.className = "headerTitleInput";
  titleInput.value = screenplayName;
  titleInput.setAttribute("aria-label", "Screenplay title");
  titleInput.setAttribute("aria-hidden", "true");
  titleInput.hidden = true;

  var setEditing = function (editing) {
    titleDisplay.hidden = editing;
    titleDisplay.setAttribute("aria-expanded", String(editing));
    titleInput.hidden = !editing;
    titleInput.setAttribute("aria-hidden", String(!editing));
    if (editing) {
      titleInput.focus();
      titleInput.select();
    }
  };

  var saveTitle = function () {
    var newName = titleInput.value.trim();
    if (newName) {
      var previousName = titleDisplay.textContent;
      titleDisplay.textContent = newName;
      if (newName !== previousName && typeof onTitleChange === "function") {
        onTitleChange(newName);
      }
    } else {
      titleInput.value = titleDisplay.textContent;
    }
    setEditing(false);
  };

  listen(titleDisplay, "click", function () {
    setEditing(true);
  });
  listen(titleInput, "blur", saveTitle);
  listen(titleInput, "keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveTitle();
    } else if (event.key === "Escape") {
      titleInput.value = titleDisplay.textContent;
      setEditing(false);
    }
  });

  centerSection.append(titleDisplay, titleInput);

  var rightSection = document.createElement("div");
  rightSection.className = "headerRight";

  var modeButton = document.createElement("button");
  modeButton.type = "button";
  modeButton.className = "headerModeButton playButton";
  modeButton.textContent = modeLabel || (isPlayMode ? "Write" : "Play");
  modeButton.setAttribute("aria-pressed", String(isPlayMode));
  listen(modeButton, "click", function () {
    if (typeof onModeToggle === "function") {
      onModeToggle();
    }
  });
  rightSection.append(modeButton);

  header.append(leftSection, centerSection, rightSection);
  headerCleanup.set(header, function () {
    listeners.forEach(function (removeListener) {
      removeListener();
    });
  });

  return header;
}

export function destroyHeader(header) {
  var cleanup = headerCleanup.get(header);
  if (cleanup) {
    cleanup();
    headerCleanup.delete(header);
  }
}
