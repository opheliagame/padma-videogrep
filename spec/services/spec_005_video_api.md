# Video API

**ID:** `spec_005`  
**Source:** `frontend/src/video-api.js`  
**Purpose:** Uses FFmpeg.wasm in the browser to retrieve video byte ranges and assemble clip segments into a playable video URL.

## `combineCuts(cuts)`

Accepts an array of clip records with media URL, start time, segment duration, and total source duration. The implementation calculates byte ranges, fetches media segments, loads FFmpeg.wasm as needed, and prepares a concatenated MP4 output. It also computes groups of cuts by source URL, although those groups are not currently used by the processing flow.

On successful processing, the function returns an object URL for the generated MP4. Processing errors are logged; the current catch path does not rethrow them, so a failed operation may resolve without a URL.

The processing implementation uses browser `fetch`, `URL.createObjectURL`, `@ffmpeg/ffmpeg`, and `@ffmpeg/util`. This is separate from the Express server's `/supercut` endpoint.