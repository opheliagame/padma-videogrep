# Application Architecture

**Project:** `frontend/` (Vue frontend)  
**Purpose:** Shows how transcript search results move through the frontend and into clip playback.

## Transcript Search and Playback

```mermaid
sequenceDiagram
    actor User
    participant Form as SearchForm
    participant Query as QueryStore
    participant Clips as ClipsStore
    participant Padma as PadmaRepositoryStore
    participant API as Pad.ma API
    participant Home as HomeView
    participant Player as DynamicVideo
    participant Sequence as SequencerStore
    participant Media as Pad.ma Media

    User->>Form: Enter transcript query
    Form->>Query: setQueryTranscripts(value)
    User->>Form: Submit search
    Form->>Clips: findClips()
    Clips->>Clips: Clear existing items
    Clips->>Query: Read queryTranscripts and range
    Clips->>Padma: searchClipsByTranscript(query, range)
    Padma->>API: POST find transcript matches
    API-->>Padma: Matching item IDs and titles

    loop For each matching item
        Padma->>API: POST get item details
        API-->>Padma: Item metadata and transcript layers
        Padma->>Padma: Filter transcript layers by query and duration
    end

    Padma-->>Clips: Return flattened clip records
    Clips->>Clips: Store results in items
    Clips-->>Form: Resolve findClips()
    Clips-->>Home: Reactive items update

    alt No clips returned
        Form->>Clips: Check items.length
        Form-->>User: Show empty-results message
    else Clips returned
        Home->>Player: Render MainSection and mount player
        Player->>Sequence: Initialize sequence from clip store
        Sequence->>Clips: Read current and next clips
        Player->>Media: Load current clip URL
        Media-->>Player: Return video media
        loop When a clip reaches its end
            Player->>Sequence: playNext()
            Sequence->>Clips: Select current and next clips
            Sequence-->>Player: Update sequence state
        end
    end
```

## Current Boundaries

- The frontend calls the Pad.ma API directly. The local Express server is a separate API path.
- The search store passes `range`, but the Padma repository store currently sends a fixed API range of `[0, 100]`.
- `SideSection` can display the clip playlist, but its use in `HomeView` is currently commented out.
