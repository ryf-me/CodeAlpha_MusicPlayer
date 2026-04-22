# Music Player

This is a premium-style music player web app built with pure HTML, CSS, and vanilla JavaScript. It is designed to feel polished and product-like, with a glassmorphism interface, animated controls, a responsive layout, and a playlist-driven playback experience similar to a compact modern streaming player.

## Features

- Premium glassmorphism UI with layered gradients, blur, glow, and soft shadows
- Responsive layout for desktop, tablet, and mobile screens
- Play, pause, next, and previous track controls
- Dynamic song details with album artwork, title, artist, and duration
- Real-time progress bar updates with click-and-drag seeking
- Volume slider with mute and unmute support
- Scrollable playlist panel with active-track highlighting
- Automatic playback of the next song with wraparound to the first track
- Smooth visual transitions when switching songs

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

No frameworks, no UI libraries, and no external dependencies are required.

## Project Structure

```text
Music Player/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── song1.mp3
    ├── song2.mp3
    ├── song3.mp3
    ├── cover1.jpg
    ├── cover2.jpg
    └── cover3.jpg
```

## Required Assets

This project expects the following files inside an `assets/` folder:

```text
assets/song1.mp3
assets/song2.mp3
assets/song3.mp3
assets/cover1.jpg
assets/cover2.jpg
assets/cover3.jpg
```

If these files are missing, the UI will still load, but audio playback and album covers will not work correctly.

## How To Run

### Option 1: Open directly

You can open `index.html` in a browser directly for a simple preview.

### Option 2: Run on localhost

Serve the project with any static server. For example:

```bash
python -m http.server 8000
```

or with Node:

```bash
npx serve .
```

Then open:

```text
http://127.0.0.1:8000/
```

## How It Works

The player is driven by a `songs` array in `script.js`:

```js
const songs = [
  { title, artist, src, cover }
];
```

The JavaScript handles:

- Loading the selected song into the audio element
- Updating the cover art, title, artist, and duration
- Keeping the UI synced with playback state
- Updating the progress bar during playback
- Seeking when the user clicks or drags the progress bar
- Managing volume and mute state
- Rendering and highlighting the active playlist item

## Main Functions

The core player logic is organized around these functions:

- `loadSong(index)`
- `playSong()`
- `pauseSong()`
- `nextSong()`
- `prevSong()`
- `updateProgress()`
- `setProgress(event)`
- `changeVolume(value)`
- `handleSongEnd()`

## Customization

To adapt the player for your own music collection:

1. Replace the files in the `assets/` folder with your own songs and cover images.
2. Update the `songs` array in `script.js` with the correct titles, artists, audio paths, and image paths.
3. Adjust colors, shadows, or spacing in `style.css` if you want a different visual direction.

## Notes

- The project is completely static and can be hosted on GitHub Pages, Netlify, or any simple static server.
- Song duration is read from the audio metadata and is not hardcoded.
- Browser autoplay rules may prevent playback until the user interacts with the page.

## Author

Built as a premium frontend music player project using pure web technologies.
