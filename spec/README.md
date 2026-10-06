# Padma VideoGrep Specifications

This directory contains specifications for both frontend projects in this repository. Assign sequential IDs in the form `spec_001` only to individually cataloged behavior specifications such as screens, repositories/stores, and services/actions. Do not assign IDs to architecture, design, or general reference documents. Keep assigned IDs stable when those specifications move.

## Vue Frontend

Specifications for `frontend/`, the Vue and Pinia application.

- Wireframe and design: [Figma](https://www.figma.com/design/HiWJTSkFbkV44hcnJxYebU/Product-Design?node-id=2074-559&t=RCErlVDmXsVBahgd-4).
- [Application Architecture](frontend/architecture.md) - search and clip playback sequence.

### Screens

- [spec_001: Home Screen](frontend/screens/spec_001_home_screen.md) - search form, initial state, and clip playback.

### Repository and Stores

- [spec_002: Query Store](frontend/repository/spec_002_query_store.md) - current search parameters.
- [spec_003: Clips Store](frontend/repository/spec_003_clips_store.md) - search result state and loading flow.
- [spec_004: Padma Repository Store](frontend/repository/spec_004_padma_repository_store.md) - Pad.ma API requests and clip mapping.

### Services

- [spec_005: Video API](frontend/services/spec_005_video_api.md) - browser-side video segment processing and supercut assembly.

## OxJS Frontend

Specifications for `frontend_oxjs/`, the OxJS application with AST-based query parsing.

- [Complete System Architecture](frontend_oxjs/architecture.md) - parser, API, components, and application flow.
- [Color System](frontend_oxjs/design/color_system.md) - CSS color variables and themes.

## Shared

- [Specification Template](templates/SPEC_TEMPLATE.md) - starting point for future cataloged behavior specifications; assign the next unused ID (`spec_006` onward).
