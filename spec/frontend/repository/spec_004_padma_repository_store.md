# Padma Repository Store

**ID:** `spec_004`  
**Source:** `frontend/src/stores/padma.js`  
**Purpose:** Sends search and item-detail requests to the Pad.ma API and maps transcript matches into playable clip records.

## Configuration

- API endpoint: `https://pad.ma/api`.
- Media base URL: `https://media.v2.pad.ma`.

## Actions

### `searchClipsByTranscript(query, duration)`

Posts a `find` request for transcript matches, requesting `id` and `title`, sorting by title, and using the hard-coded range `[0, 100]`. It then requests each matching item by ID, maps matching transcript layers into clip records, and returns a flattened array.

The `duration` argument is currently not used by the `find` request. Segment filtering instead reads `queryTranscripts` and `duration` directly from the query store. Each clip record contains `id`, `title`, `transcript`, `keywords`, `url`, `ss`, `duration`, and `totalDuration`.

### `createSupercut()`

Passes `clips.items` to `combineCuts()` from `frontend/src/video-api.js` and returns its result. The current empty-list guard checks the store object for a `length` property rather than checking `clips.items.length`, so it does not reliably prevent an empty call.
