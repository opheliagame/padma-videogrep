@{%
const lexer = require("moo");
const myLexer = lexer.compile({
  WS: { match: /\s+/, lineBreaks: true },
  AND: ["AND", "and"],
  OR: ["OR", "or"],
  LPAREN: /\(/,
  RPAREN: /\)/,
  WORD: /[a-zA-Z0-9][a-zA-Z0-9_]*/
});
%}

@lexer myLexer

Query -> _ Expression _ {% (d) => d[1] %}

Expression -> Term (_ %OR _ Term):* {% (d) => d[1].length === 0 ? d[0] : { type: "OR", operands: [d[0], ...d[1].map(i => i[3])] } %}

Term -> Factor (_ %AND _ Factor):* {% (d) => d[1].length === 0 ? d[0] : { type: "AND", operands: [d[0], ...d[1].map(i => i[3])] } %}

Factor -> Phrase {% (d) => d[0] %}
        | %LPAREN Expression %RPAREN {% (d) => d[1] %}

Phrase -> %WORD (_ %WORD):* {% (d) => {
  let words = [d[0].value];
  for (let i = 0; i < d[1].length; i++) {
    words.push(d[1][i][1].value);
  }
  return { type: "KEYWORD", value: words.join(" ") };
} %}

_ -> %WS:* {% () => null %}
