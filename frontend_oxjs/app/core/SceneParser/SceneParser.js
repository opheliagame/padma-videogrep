import nearley from "nearley";
import grammar from "./nearleyParser.js";

function extractFromAST(ast) {
  const keywords = [];
  let topLevelOperator = "&";

  const visit = function (node) {
    if (!node) return;

    if (node.type === "KEYWORD") {
      keywords.push(node.value);
    } else if (node.type === "OR") {
      topLevelOperator = "|";
      node.operands?.forEach(visit);
    } else if (node.type === "AND") {
      node.operands?.forEach(visit);
    }
  };

  visit(ast);
  return { keywords, operator: topLevelOperator };
}

function parseWithRegex(sceneText, parseResult) {
  const normalizedText = sceneText.replace(/\s+/g, " ");
  const hasOr = normalizedText.toLowerCase().includes(" or ");
  parseResult.keywords = normalizedText
    .split(/\s+/)
    .filter((token) => !["and", "or", "(", ")"].includes(token.toLowerCase()));
  parseResult.operator = hasOr ? "|" : "&";
}

/**
 * Parses a scene query into keywords and an AST for the API layer.
 */
export class SceneParser {
  parse(sceneText) {
    const normalizedText = sceneText.trim();
    if (!normalizedText) {
      return {
        keywords: [],
        operator: "&",
        originalText: "",
        ast: null,
      };
    }

    const parseResult = {
      keywords: [],
      operator: "&",
      originalText: normalizedText,
      ast: null,
    };

    try {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(normalizedText);
      parseResult.ast = parser.results[0] || null;
    } catch (error) {
      console.warn(
        "Nearley parser failed, using regex fallback:",
        error.message,
      );
    }

    if (parseResult.ast) {
      const extracted = extractFromAST(parseResult.ast);
      parseResult.keywords = extracted.keywords;
      parseResult.operator = extracted.operator;
    } else {
      parseWithRegex(normalizedText, parseResult);
    }

    return parseResult;
  }
}

export const sceneParser = new SceneParser();
