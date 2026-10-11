import { afterEach, describe, expect, it, vi } from "vitest";
import { SceneParser } from "./SceneParser.js";

describe("SceneParser", () => {
  const parser = new SceneParser();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses a simple keyword and preserves the result contract", () => {
    expect(parser.parse("  water  ")).toEqual({
      keywords: ["water"],
      operator: "&",
      originalText: "water",
      ast: { type: "KEYWORD", value: "water" },
    });
  });

  it("preserves multiword phrases and operator precedence in the AST", () => {
    const result = parser.parse("water and climate change or rain");

    expect(result.keywords).toEqual(["water", "climate change", "rain"]);
    expect(result.operator).toBe("|");
    expect(result.ast).toEqual({
      type: "OR",
      operands: [
        {
          type: "AND",
          operands: [
            { type: "KEYWORD", value: "water" },
            { type: "KEYWORD", value: "climate change" },
          ],
        },
        { type: "KEYWORD", value: "rain" },
      ],
    });
  });

  it("returns an empty result for blank input", () => {
    expect(parser.parse("  ")).toEqual({
      keywords: [],
      operator: "&",
      originalText: "",
      ast: null,
    });
  });

  it("falls back to keyword parsing when the grammar rejects input", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(parser.parse("water and")).toEqual({
      keywords: ["water"],
      operator: "&",
      originalText: "water and",
      ast: null,
    });
  });
});
