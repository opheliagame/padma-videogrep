# Clips Store

**ID:** `spec_003`  
**Source:** `frontend/src/stores/clips.js`  
**Purpose:** Owns the clip result list and coordinates transcript search between the query store and Padma repository store.

## State

- `items` (array): currently loaded clip segments; starts empty.

## Actions

### `findClips()`

1. Clears the current `items` list.
2. Reads `queryTranscripts` and `range` from the query store.
3. Calls `PadmaRepositoryStore.searchClipsByTranscript(queryTranscripts, range)`.
4. Stores the returned clips in `items`.

The search form awaits this action and uses the resulting item count to show empty-results feedback. Search errors are not caught by this store.

### `setClips(clips)`

Replaces `items` with the supplied array.