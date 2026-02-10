/**
 * API Service Tests
 * Tests AST-to-Query conversion for proper operator precedence
 */

// Mock window for Node.js testing
if (typeof window === "undefined") {
  global.window = global;
}

// Import parser (Node.js version for testing)
const parser = require("../utils/nodeParser.js");
global.nearleyParser = parser;
require("../utils/parser.js");

// Import API service
require("./service.js");

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
];

console.log("=== API Service AST-to-Query Tests ===\n");

let passed = 0;
let failed = 0;

testCases.forEach(function (testCase, idx) {
  console.log("Test " + (idx + 1) + ": " + testCase.name);
  console.log("Query: " + testCase.query);

  // Parse the query
  const parsed = window.SceneParser.parse(testCase.query);

  if (!parsed.ast) {
    console.log("✗ FAIL - No AST generated\n");
    failed++;
    return;
  }

  // Convert to API condition
  const condition = window.APIService.astToQueryCondition(parsed.ast);

  // Compare with expected
  const conditionStr = JSON.stringify(condition, null, 2);
  const expectedStr = JSON.stringify(testCase.expectedCondition, null, 2);

  if (conditionStr === expectedStr) {
    console.log("✓ PASS");
    console.log("Condition:", JSON.stringify(condition, null, 2));
    passed++;
  } else {
    console.log("✗ FAIL");
    console.log("Expected:", expectedStr);
    console.log("Got:", conditionStr);
    failed++;
  }

  console.log();
});

console.log("=== Summary ===");
console.log("Passed: " + passed + "/" + testCases.length);
console.log("Failed: " + failed + "/" + testCases.length);

if (failed === 0) {
  console.log("\n✓ All tests passed!");
  process.exit(0);
} else {
  console.log("\n✗ Some tests failed");
  process.exit(1);
}
