# Supercuts(x)Pad.ma

Supercuts(x)Pad.ma searches the Pad.ma archive for transcript matches and turns matching video segments into a supercut. The repository currently contains a command-line version and a Vue-based web frontend.

## Requirements

- Node.js 14 or newer. Install it from [nodejs.org](https://nodejs.org/en/download/).
- FFmpeg available on your `PATH` for the command-line version and the local server.

## Command-Line Version

Install the root dependencies and run a transcript search:

```sh
npm install
node index.js "SEARCH_TERM"
```

The search term is required. The command accepts these optional arguments:

- `-n NUMBER`: maximum number of Pad.ma search results to process; defaults to `10`.
- `-c SECONDS`: maximum duration of each matching transcript segment.
- `-dir NAME`: output folder name under `outputs/`.
- `-o NAME`: output filename without the `.webm` extension.

Examples:

```sh
node index.js "SEARCH_TERM" -n 200 -c 10
node index.js "SEARCH_TERM" -n 20 -dir my-search
node index.js "SEARCH_TERM" -o my-supercut
```

The command-line version writes individual segments and the merged supercut under `outputs/`.

## Web Frontend

Install the frontend dependencies and start the Vite development server:

```sh
cd frontend
npm install
npm run dev
```

Create a production build with `npm run build`. The frontend uses Vue 3, Pinia, and FFmpeg.wasm to search and play transcript clips and assemble selected clips in the browser.

## Local API Server

The Express server provides video-segment and supercut endpoints. Start it from the repository root with:

```sh
node server.js
```

It listens on port `3001` by default. Set the `PORT` environment variable to use another port.

## Specifications

Project behavior and component specifications are indexed in [spec/README.md](spec/README.md). The command-line output examples are available [on Google Drive](https://drive.google.com/drive/folders/1OejG6FIYhx0UNnvyhC3aLJ_p037wbEGr).
