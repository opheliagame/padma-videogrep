# Home Screen

**ID:** `spec_001`  
**Source:** `frontend/src/views/HomeView.vue`  
**Purpose:** Provides the transcript search entry point and switches between the introductory content and clip playback.

## Composition

- `AppHeader` contains the `SearchForm`.
- `AboutSection` is displayed when the clips store has no items.
- `MainSection` is displayed when the clips store contains items. It renders `DynamicVideo` for clip playback.
- `SideSection` renders a playlist of clip videos with titles, keywords, and Pad.ma links.

## States and Behavior

- **No results loaded:** show the search header and introductory content.
- **Search in progress:** the search form displays a loading message while `findClips()` is pending.
- **Results loaded:** show the main section and the current sequence video.
- **Empty search response:** show the search form's empty-results message; the home view remains in its no-results state.

Typing updates `QueryStore.queryTranscripts`. Submitting the search form calls `ClipsStore.findClips()`. Playback and sequence state are handled by `DynamicVideo` and the sequencer store.
