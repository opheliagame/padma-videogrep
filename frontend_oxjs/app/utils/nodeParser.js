/**
 * Node.js Parser for Testing
 * Uses the compiled Nearley grammar with moo lexer
 */

const nearley = require("nearley");
const grammar = require("./nearleyParser");

class NodeNearleyParser {
  parse(input) {
    try {
      const grammarObj = nearley.Grammar.fromCompiled(grammar);
      const parser = new nearley.Parser(grammarObj);

      parser.feed(input);

      if (parser.results.length === 0) {
        console.error("No parse results for:", input);
        return null;
      }

      return parser.results[0];
    } catch (e) {
      console.error("Parse error:", e.message, "for input:", input);
      return null;
    }
  }
}

module.exports = {
  parse: function (text) {
    const parser = new NodeNearleyParser();
    return parser.parse(text);
  },
};
