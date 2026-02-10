# Padma Videogrep - Modular Architecture

## Project Structure

```
padma-videogrep-oxjs/
├── index.html              # Entry point (loads all modules)
├── index.js                # Main application logic
├── index.css               # Global styles
├── app/                    # Application code
│   ├── api/
│   │   └── service.js      # API calls to pad.ma
│   ├── components/
│   │   ├── header.js       # Header component
│   │   ├── sceneBuilder.js # Scene input component
│   │   ├── playPanel.js    # Video player and clip list
│   │   └── ui.js           # Main UI orchestrator
│   ├── domain/             # Domain logic (future)
│   └── utils/
│       └── parser.js       # Scene text parser
├── docs/
│   └── architecture/
│       └── ARCHITECTURE.md # This file
├── min/
│   └── Ox.js               # OxJS framework (minified)
├── dev/                    # Development framework files
├── source/                 # Source framework files
├── tools/                  # Build and utility tools
├── play/                   # Play mode demo files
├── readme/                 # Documentation pages
└── bkp/                    # Backup files
```

## Module Descriptions

### Utils (`app/utils/`)

- **parser.js**: Parses scene text to extract keywords and operators (AND/OR)
  - `SceneParser.parse(sceneText)` - Returns keywords and operator structure

### API (`app/api/`)

- **service.js**: Handles all API communication with pad.ma
  - `APIService.findByTranscript()` - Low-level API call wrapper
  - `APIService.findClipsByTranscript()` - High-level clip fetching with data transformation

### Components (`app/components/`)

- **header.js**: Application header with title and mode toggle button
  - `HeaderComponent.create(app)` - Creates and returns header element

- **sceneBuilder.js**: Scene input interface for write mode (editable textarea)
  - `SceneBuilderComponent.create(app)` - Creates native textarea inputs for each scene
  - Wraps textarea elements with Ox.Element for event binding
  - Parses user input to extract keywords and operators
  - Updates scene data model in real-time when textarea changes
  - Supports space-separated keywords with AND/OR operators

- **playPanel.js**: Video player container and clip list for play mode
  - `PlayPanelComponent.create(app)` - Creates video + clip list layout
  - `PlayPanelComponent.renderClipList(app, items)` - Renders list of clips

- **ui.js**: Main UI orchestrator combining all components
  - `UIComponents.mainPanel(app)` - Routes between write/play panels
  - `UIComponents.fetchClips(app)` - Fetches clips from all scenes
  - `UIComponents.playClips(app, items)` - Plays video clips sequentially

### Core Files

- **index.html**: Loads all scripts in dependency order (located in root)
- **index.js**: Main app initialization and state management (located in root)
- **index.css**: Global styles for all components (located in root)

## Script Loading Order

As defined in `index.html`, scripts are loaded in this order:

1. OxJS framework (`min/Ox.js`)
2. Utilities (`app/utils/parser.js`)
3. API service (`app/api/service.js`)
4. Components (`app/components/header.js`, etc.)
5. Main app (`index.js`)

This ensures all dependencies are available before use.

## Data Flow

1. **Write Mode**: User edits scenes → Scene text is parsed → Keywords extracted
2. **Play Mode**: Click "play mode" → Toggle to play mode → Click "Fetch Clips"
3. **API**: Each scene's keywords sent to pad.ma API → Clips returned with metadata
4. **Playback**: Clips loaded into video player → Auto-play with metadata display

## Adding New Components

1. Create new file in `app/components/` folder
2. Define component with namespace (e.g., `MyComponent`)
3. Create methods following pattern: `MyComponent.create(app)`, etc.
4. Add script tag to `index.html` before `index.js`
5. Use in `ui.js` or other components

## Write Mode - Scene Editing

In write mode, users can edit scenes using editable textarea inputs:

1. Each scene has its own textarea with space-separated keywords
2. Keywords can be combined with AND/OR operators
3. Changes update the scene data model in real-time
4. When clicking "play mode", the scenes are fetched from the API
5. The parser automatically detects OR operators to set the search operator

**Example inputs:**
- `water bucket` - Searches for clips containing both "water" AND "bucket"
- `water or bucket` - Searches for clips containing either "water" OR "bucket"
- Multiple keywords work with the default AND logic

## Key Global Objects

- `window.SceneParser` - Text parsing utilities
- `window.APIService` - API calls
- `window.HeaderComponent` - Header component
- `window.SceneBuilderComponent` - Scene builder component (creates editable textareas)
- `window.PlayPanelComponent` - Play panel component
- `window.UIComponents` - UI orchestrator
- `window.oxjs` or `app` - Main application instance
