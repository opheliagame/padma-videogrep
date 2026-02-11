// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("moo");
const myLexer = lexer.compile({
  WS: { match: /\s+/, lineBreaks: true },
  AND: ["AND", "and"],
  OR: ["OR", "or"],
  LPAREN: /\(/,
  RPAREN: /\)/,
  WORD: /[a-zA-Z0-9][a-zA-Z0-9_]*/
});
var grammar = {
    Lexer: myLexer,
    ParserRules: [
    {"name": "Query", "symbols": ["_", "Expression", "_"], "postprocess": (d) => d[1]},
    {"name": "Expression$ebnf$1", "symbols": []},
    {"name": "Expression$ebnf$1$subexpression$1", "symbols": ["_", (myLexer.has("OR") ? {type: "OR"} : OR), "_", "Term"]},
    {"name": "Expression$ebnf$1", "symbols": ["Expression$ebnf$1", "Expression$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Expression", "symbols": ["Term", "Expression$ebnf$1"], "postprocess": (d) => d[1].length === 0 ? d[0] : { type: "OR", operands: [d[0], ...d[1].map(i => i[3])] }},
    {"name": "Term$ebnf$1", "symbols": []},
    {"name": "Term$ebnf$1$subexpression$1", "symbols": ["_", (myLexer.has("AND") ? {type: "AND"} : AND), "_", "Factor"]},
    {"name": "Term$ebnf$1", "symbols": ["Term$ebnf$1", "Term$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": ["Factor", "Term$ebnf$1"], "postprocess": (d) => d[1].length === 0 ? d[0] : { type: "AND", operands: [d[0], ...d[1].map(i => i[3])] }},
    {"name": "Factor", "symbols": ["Phrase"], "postprocess": (d) => d[0]},
    {"name": "Factor", "symbols": [(myLexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "Expression", (myLexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": (d) => d[1]},
    {"name": "Phrase$ebnf$1", "symbols": []},
    {"name": "Phrase$ebnf$1$subexpression$1", "symbols": ["_", (myLexer.has("WORD") ? {type: "WORD"} : WORD)]},
    {"name": "Phrase$ebnf$1", "symbols": ["Phrase$ebnf$1", "Phrase$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Phrase", "symbols": [(myLexer.has("WORD") ? {type: "WORD"} : WORD), "Phrase$ebnf$1"], "postprocess":  (d) => {
          let words = [d[0].value];
          for (let i = 0; i < d[1].length; i++) {
            words.push(d[1][i][1].value);
          }
          return { type: "KEYWORD", value: words.join(" ") };
        } },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (myLexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "Query"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
