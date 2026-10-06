# Padma VideoGrep Specifications

This directory contains specifications for the current application. IDs are assigned sequentially in the form `spec_001`; keep an existing ID stable when a file moves, and assign the next unused ID to each new specification.

## Wireframe and Design

[Figma](https://www.figma.com/design/HiWJTSkFbkV44hcnJxYebU/Product-Design?node-id=2074-559&t=RCErlVDmXsVBahgd-4)

## Screens

- [spec_001: Home Screen](screens/spec_001_home_screen.md) - search form, initial state, and clip playback.

## Architecture

- [spec_006: Application Flow](architecture.md) - sequence diagram for transcript search and clip playback.

## Repository and Stores

- [spec_002: Query Store](repository/spec_002_query_store.md) - current search parameters.
- [spec_003: Clips Store](repository/spec_003_clips_store.md) - search result state and loading flow.
- [spec_004: Padma Repository Store](repository/spec_004_padma_repository_store.md) - Pad.ma API requests and clip mapping.

## Services

- [spec_005: Video API](services/spec_005_video_api.md) - browser-side video segment processing and supercut assembly.

## Templates

- [Specification Template](templates/SPEC_TEMPLATE.md) - starting point for future specifications.
