# Padma Videogrep - Modular Architecture

## Project Structure

```
padma-videogrep-oxjs/
├── index.html              # Entry point
├── index.css               # Global styles
├── index.js                # Main application logic
├── api/
│   └── service.js          # API calls to pad.ma
├── components/
│   ├── header.js           # Header component
│   ├── sceneBuilder.js     # Scene input component
│   ├── playPanel.js        # Video player and clip list
│   └── ui.js               # Main UI orchestrator
├── utils/
│   └── parser.js           # Scene text parser
└── min/
    └── Ox.js               # OxJS framework
```

## Module Descriptions

### Utils (`utils/`)
- **parser.js**: Parses scene text to extract keywords and operators (AND/OR)
  - `SceneParser.parse(sceneText)` - Returns keywords and operator structure

### API (`api/`)
- **service.js**: Handles all API communication with pad.ma
  - `APIService.findByTranscript()` - Low-level API call wrapper
  - `APIService.findClipsByTranscript()` - High-level clip fetching with data transformation

### Components (`components/`)
- **header.js**: Application header with title and mode toggle button
  - `HeaderComponent.create(app)` - Creates and returns header element

- **sceneBuilder.js**: Scene input interface for write mode
  - `SceneBuilderComponent.create(app)` - Builds list of scene inputs

- **playPanel.js**: Video player container and clip list for play mode
  - `PlayPanelComponent.create(app)` - Creates video + clip list layout
  - `PlayPanelComponent.renderClipList(app, items)` - Renders list of clips

- **ui.js**: Main UI orchestrator combining all components
  - `UIComponents.mainPanel(app)` - Routes between write/play panels
  - `UIComponents.fetchClips(app)` - Fetches clips from all scenes
  - `UIComponents.playClips(app, items)` - Plays video clips sequentially

### Core Files
- **index.html**: Loads all scripts in dependency order
- **index.js**: Main app initialization and state management
- **index.css**: Global styles for all components

## Data Flow

1. **Write Mode**: User edits scenes → Scene text is parsed → Keywords extracted
2. **Play Mode**: Click "play mode" → Toggle to play mode → Click "Fetch Clips"
3. **API**: Each scene's keywords sent to pad.ma API → Clips returned with metadata
4. **Playback**: Clips loaded into video player → Auto-play with metadata display

## Adding New Components

1. Create new file in `components/` folder
2. Define component with namespace (e.g., `MyComponent`)
3. Create methods following pattern: `MyComponent.create(app)`, etc.
4. Add script tag to `index.html` before `index.js`
5. Use in `ui.js` or other components

## Key Global Objects

- `window.SceneParser` - Text parsing utilities
- `window.APIService` - API calls
- `window.HeaderComponent` - Header component
- `window.SceneBuilderComponent` - Scene builder component
- `window.PlayPanelComponent` - Play panel component
- `window.UIComponents` - UI orchestrator
- `window.oxjs` or `app` - Main application instance
