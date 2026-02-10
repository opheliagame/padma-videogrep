/**
 * Scene Parser Utility
 * Parses scene text to extract keywords and operators
 */

window.SceneParser = {
  parse: function (sceneText) {
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
};
