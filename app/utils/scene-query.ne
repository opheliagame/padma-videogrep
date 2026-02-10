@{%
const lexer = require("moo");
const myLexer = lexer.compile({
  WS: { match: /\s+/, lineBreaks: true },
  AND: ["AND", "and"],
  OR: ["OR", "or"],
  LPAREN: /\(/,
  RPAREN: /\)/,
  KEYWORD: /[a-zA-Z_][a-zA-Z0-9_]*/
});
%}

@lexer myLexer

Query -> _ Expression _ {% (d) => d[1] %}

Expression -> Term (_ %OR _ Term):* {% (d) => d[1].length === 0 ? d[0] : { type: "OR", operands: [d[0], ...d[1].map(i => i[3])] } %}

Term -> Factor (_ %AND _ Factor):* {% (d) => d[1].length === 0 ? d[0] : { type: "AND", operands: [d[0], ...d[1].map(i => i[3])] } %}

Factor -> %KEYWORD {% (d) => ({ type: "KEYWORD", value: d[0].value }) %}
       | %LPAREN Expression %RPAREN {% (d) => d[1] %}

_ -> %WS:* {% () => null %}
