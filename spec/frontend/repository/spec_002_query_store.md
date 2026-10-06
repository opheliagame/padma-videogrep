# Query Store

**ID:** `spec_002`  
**Source:** `frontend/src/stores/query.js`  
**Purpose:** Holds the current transcript and clip-search parameters shared by the frontend.

## State

- `queryTranscripts` (string): transcript search text; defaults to `"love"`.
- `queryKeywords` (string): keyword search text; defaults to an empty string and is not currently used by the search flow.
- `range` (number): search result limit value; defaults to `10`.
- `duration` (number): maximum transcript segment duration; defaults to `10`.

## Actions

- `setQueryTranscripts(value)` updates the transcript query.
- `setRange(value)` updates the result limit.
- `setDuration(value)` updates the maximum segment duration.
- `reset()` restores all four defaults.

The store does not initiate searches. The search form calls the clips store, which reads this store's values. Currently, the Padma repository store hard-codes the API result range to `[0, 100]`; `range` is not applied to that request.