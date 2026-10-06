/**
 * Webpack entry point for Nearley parser
 * Bundles nearley and the compiled grammar for browser use
 */

const nearley = require("nearley");
const grammar = require("./nearleyParser");

// Create a parser class that wraps nearley
class NearleyBrowserParser {
  constructor() {
    this.rules = null;
    this.parser = null;
  }

  parse(input) {
    try {
      // Create a fresh parser for each parse to avoid state issues
      const grammarObj = nearley.Grammar.fromCompiled(grammar);
      const parser = new nearley.Parser(grammarObj);

      parser.feed(input);

      if (parser.results.length === 0) {
        console.error("No parse results");
        return null;
      }

      return parser.results[0];
    } catch (e) {
      console.error("Parse error:", e.message);
      return null;
    }
  }
}

// Export to window for browser use
window.nearleyParser = new NearleyBrowserParser();
