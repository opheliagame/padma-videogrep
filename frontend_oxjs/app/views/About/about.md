# pad.ma videogrep

This project is an attempt at constructing stories, inspired by the idea that a singular object or idea can invoke wildly different feelings and thoughts for different people.

Would it be interesting to define something by the stories that people tell about it, by the context it lives in, by the company it keeps.

## what is pad.ma

Pad.ma - short for Public Access Digital Media Archive - is an online archive of densely text-annotated video material, primarily footage and not finished films. The entire collection is searchable and viewable online and is free to download for non-commercial use.

https://pad.ma/about

## what is videogrep

Videogrep is a command line tool that searches through dialog in video or audio files and makes supercuts based on what it finds. It will recognize .srt or .vtt subtitle tracks, or transcriptions that can be generated with vosk, pocketsphinx, and other tools.

http://antiboredom.github.io/videogrep/

## How to use

### Getting started

1. Type a query into the scene box.
2. Press **Enter** to add the next scene.
3. Click the title in the header to rename your screenplay.
4. Press **Play** to watch clips, scene by scene.
5. Press **Write** to go back and edit.

### Writing queries

| Query                       | Finds clips that mention…         |
| --------------------------- | --------------------------------- |
| `water`                     | water                             |
| `climate change`            | the phrase "climate change"       |
| `water and rain`            | both water and rain               |
| `water or rain`             | either water or rain              |
| `(water and river) or rain` | water and river together, or rain |

- Words next to each other form one phrase — no quotes needed.
- `and` / `AND` and `or` / `OR` both work. `and` is applied before `or`; use brackets to group.
- Use letters, numbers and `_` only. Quotes and punctuation are not supported.

### Generativity controls

- **length** — clip duration: short (under 5s), medium (5–15s) or long (over 15s).
- **sort** — order of clips: relevance, date or random.
- **clip count** — how many clips per scene, from 1 to 50 (default 10).

### Where clips come from

Clips come from the [pad.ma](https://pad.ma) archive. A query matches text in a video's transcripts, keywords, places, events and descriptions.

### Work in progress

- Random sort does not work right now.
