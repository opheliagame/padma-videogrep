// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { sceneParser } from "../core/SceneParser/SceneParser.js";
import "./service.js";

// Test AST nodes
const testCases = [
  {
    name: "Simple keyword",
    query: "water",
    expectedCondition: {
      key: "transcripts",
      value: "water",
      operator: "=",
    },
  },
  {
    name: "Two keywords with AND",
    query: "water and bucket",
    expectedCondition: {
      conditions: [
        { key: "transcripts", value: "water", operator: "=" },
        { key: "transcripts", value: "bucket", operator: "=" },
      ],
      operator: "&",
    },
  },
  {
    name: "Two keywords with OR",
    query: "water or rain",
    expectedCondition: {
      conditions: [
        { key: "transcripts", value: "water", operator: "=" },
        { key: "transcripts", value: "rain", operator: "=" },
      ],
      operator: "|",
    },
  },
  {
    name: "Complex: (AND) OR",
    query: "(water and bucket) or rain",
    expectedCondition: {
      conditions: [
        {
          conditions: [
            { key: "transcripts", value: "water", operator: "=" },
            { key: "transcripts", value: "bucket", operator: "=" },
          ],
          operator: "&",
        },
        { key: "transcripts", value: "rain", operator: "=" },
      ],
      operator: "|",
    },
  },
  {
    name: "Three ANDs",
    query: "water and bucket and coffee",
    expectedCondition: {
      conditions: [
        { key: "transcripts", value: "water", operator: "=" },
        { key: "transcripts", value: "bucket", operator: "=" },
        { key: "transcripts", value: "coffee", operator: "=" },
      ],
      operator: "&",
    },
  },
  {
    name: "Complex: (OR) AND",
    query: "(water or rain) and bucket",
    expectedCondition: {
      conditions: [
        {
          conditions: [
            { key: "transcripts", value: "water", operator: "=" },
            { key: "transcripts", value: "rain", operator: "=" },
          ],
          operator: "|",
        },
        { key: "transcripts", value: "bucket", operator: "=" },
      ],
      operator: "&",
    },
  },
  {
    name: "Multi-word phrase",
    query: "climate change",
    expectedCondition: {
      key: "transcripts",
      value: "climate change",
      operator: "=",
    },
  },
  {
    name: "Multi-word AND multi-word",
    query: "climate change and water crisis",
    expectedCondition: {
      conditions: [
        { key: "transcripts", value: "climate change", operator: "=" },
        { key: "transcripts", value: "water crisis", operator: "=" },
      ],
      operator: "&",
    },
  },
  {
    name: "Multi-word OR multi-word",
    query: "protest movements or climate change",
    expectedCondition: {
      conditions: [
        { key: "transcripts", value: "protest movements", operator: "=" },
        { key: "transcripts", value: "climate change", operator: "=" },
      ],
      operator: "|",
    },
  },
  {
    name: "Complex multi-word: AND with OR",
    query: "water and climate change or protest movements",
    expectedCondition: {
      conditions: [
        {
          conditions: [
            { key: "transcripts", value: "water", operator: "=" },
            { key: "transcripts", value: "climate change", operator: "=" },
          ],
          operator: "&",
        },
        { key: "transcripts", value: "protest movements", operator: "=" },
      ],
      operator: "|",
    },
  },
];

describe("AST-to-query conversion", () => {
  testCases.forEach(({ name, query, expectedCondition }) => {
    it(name, () => {
      const { ast } = sceneParser.parse(query);
      expect(ast).not.toBeNull();
      expect(window.APIService.astToQueryCondition(ast)).toEqual(
        expectedCondition,
      );
    });
  });
});
