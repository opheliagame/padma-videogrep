/**
 * Scene Parser Utility
 * Parses scene text to extract keywords and operators
 *
 * Uses Nearley.js parser for complex query support:
 * - Supports AND/OR operators with proper precedence
 * - Supports parenthesized expressions
 * - Example: "(water and bucket) or rain"
 *
 * Maintains backward compatibility with existing API:
 * - parse() returns { keywords, operator, originalText, ast }
 * - keywords: array of all keywords (for simple queries)
 * - operator: '&' for AND-based, '|' for OR-based (for simple queries)
 * - ast: full Abstract Syntax Tree from Nearley parser
 */

window.SceneParser = {
  /**
   * Parse scene query text
   * @param {string} sceneText - Raw query text
   * @returns {object} Parse result with keywords, operator, ast, and originalText
   */
  parse: function (sceneText) {
    // Normalize input
    sceneText = sceneText.trim();
    if (!sceneText) {
      return {
        keywords: [],
        operator: "&",
        originalText: "",
        ast: null,
      };
    }

    var parseResult = {
      keywords: [],
      operator: "&",
      originalText: sceneText,
      ast: null,
    };

    try {
      // Try to parse with browser Nearley parser
      if (
        typeof window.nearleyParser !== "undefined" &&
        window.nearleyParser.parse &&
        typeof window.nearleyParser.parse === "function"
      ) {
        var ast = window.nearleyParser.parse(sceneText);

        if (ast) {
          parseResult.ast = ast;

          // Extract keywords and determine operator from AST
          var extracted = this._extractFromAST(ast);
          parseResult.keywords = extracted.keywords;
          parseResult.operator = extracted.operator;
        } else {
          // If parse returns null, fallback to regex
          this._parseWithRegex(sceneText, parseResult);
        }
      } else {
        // Fallback to regex parser if Nearley not available
        console.warn("Nearley parser not available, using regex fallback");
        this._parseWithRegex(sceneText, parseResult);
      }
    } catch (e) {
      // If Nearley parsing fails, fallback to regex
      console.warn("Nearley parser failed, using regex fallback:", e.message);
      this._parseWithRegex(sceneText, parseResult);
    }

    return parseResult;
  },

  /**
   * Extract keywords and operator from AST
   * @param {object} ast - Abstract Syntax Tree from parser
   * @returns {object} { keywords: [], operator: '&'|'|' }
   */
  _extractFromAST: function (ast) {
    var keywords = [];
    var topLevelOperator = "&";

    if (!ast) {
      return { keywords: [], operator: "&" };
    }

    var visit = function (node) {
      if (!node) return;

      if (node.type === "KEYWORD") {
        keywords.push(node.value);
      } else if (node.type === "OR") {
        topLevelOperator = "|";
        if (node.operands) {
          node.operands.forEach(visit);
        }
      } else if (node.type === "AND") {
        if (node.operands) {
          node.operands.forEach(visit);
        }
      }
    };

    visit(ast);

    return {
      keywords: keywords,
      operator: topLevelOperator,
    };
  },

  /**
   * Fallback regex-based parser (for when Nearley is unavailable)
   * @param {string} sceneText - Raw query text
   * @param {object} parseResult - Result object to populate
   */
  _parseWithRegex: function (sceneText, parseResult) {
    sceneText = sceneText.replace(/\s+/g, " ");

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

    parseResult.keywords = keywords;
    parseResult.operator = operator;
  },
};
