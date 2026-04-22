const songs = [
  {
    title: "Midnight Skyline",
    artist: "Astra Avenue",
    src: "assets/song1.mp3",
    cover: "assets/cover1.jpg",
  },
  {
    title: "Neon Tides",
    artist: "Sol Harbor",
    src: "assets/song2.mp3",
    cover: "assets/cover2.jpg",
  },
  {
    title: "Velvet Echoes",
    artist: "Noir Cascade",
    src: "assets/song3.mp3",
    cover: "assets/cover3.jpg",
  },
];

const playerCard = document.querySelector(".player-card");
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const durationBadge = document.getElementById("durationBadge");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const progressTrack = document.getElementById("progressTrack");
const playlist = document.getElementById("playlist");
const playlistCount = document.getElementById("playlistCount");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");

let currentSongIndex = 0;
let isDraggingProgress = false;
let progressAnimationFrame = null;
let switchAnimationTimeout = null;
let lastVolumeBeforeMute = 0.75;

playlistCount.textContent = `${songs.length} tracks`;

function formatTime(time) {
  if (!Number.isFinite(time) || time < 0) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function setProgressVisual(progressPercent) {
  const boundedPercent = `${Math.max(0, Math.min(progressPercent, 100))}%`;
  playerCard.style.setProperty("--progress-percent", boundedPercent);
}

function setVolumeVisual(volumePercent) {
  const boundedPercent = `${Math.max(0, Math.min(volumePercent, 100))}%`;
  playerCard.style.setProperty("--volume-percent", boundedPercent);
}

function updatePlaylistState() {
  const items = playlist.querySelectorAll(".playlist-track");
  const isPlaying = !audio.paused;

  items.forEach((item, index) => {
    const isActive = index === currentSongIndex;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-current", isActive ? "true" : "false");

    const tag = item.querySelector(".track-tag");
    tag.textContent = isActive
      ? (isPlaying ? "Now playing" : "Selected")
      : `Track ${String(index + 1).padStart(2, "0")}`;

    if (isActive) {
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
}

function renderPlaylist() {
  const markup = songs
    .map((song, index) => {
      const trackNumber = String(index + 1).padStart(2, "0");
      return `
        <button class="playlist-track" type="button" data-index="${index}" aria-label="Play ${song.title} by ${song.artist}">
          <img src="${song.cover}" alt="Cover art for ${song.title}">
          <div>
            <strong>${song.title}</strong>
            <span>${song.artist}</span>
          </div>
          <span class="track-tag">Track ${trackNumber}</span>
        </button>
      `;
    })
    .join("");

  playlist.innerHTML = markup;
  updatePlaylistState();
}

function syncPlayState() {
  const isPlaying = !audio.paused;
  playerCard.classList.toggle("is-playing", isPlaying);
  playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function syncMuteState() {
  const isMuted = audio.muted || audio.volume === 0;
  playerCard.classList.toggle("is-muted", isMuted);
  muteBtn.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
}

function triggerSongTransition() {
  playerCard.classList.add("is-switching");
  window.clearTimeout(switchAnimationTimeout);
  switchAnimationTimeout = window.setTimeout(() => {
    playerCard.classList.remove("is-switching");
  }, 240);
}

function loadSong(index) {
  currentSongIndex = index;
  const song = songs[currentSongIndex];

  triggerSongTransition();

  audio.src = song.src;
  audio.load();

  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  cover.alt = `Album artwork for ${song.title}`;

  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent = "0:00";
  durationBadge.textContent = "--:--";
  setProgressVisual(0);

  updatePlaylistState();
}

async function playSong() {
  try {
    await audio.play();
    syncPlayState();
  } catch (error) {
    syncPlayState();
    console.error("Playback failed to start.", error);
  }
}

function pauseSong() {
  audio.pause();
  syncPlayState();
}

function nextSong() {
  const nextIndex = (currentSongIndex + 1) % songs.length;
  loadSong(nextIndex);
  playSong();
}

function prevSong() {
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex);
  playSong();
}

function updateProgress() {
  if (isDraggingProgress) {
    return;
  }

  const duration = audio.duration || 0;
  const currentTime = audio.currentTime || 0;
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  currentTimeEl.textContent = formatTime(currentTime);
  totalTimeEl.textContent = formatTime(duration);
  durationBadge.textContent = formatTime(duration);
  setProgressVisual(progressPercent);
}

function setProgress(event) {
  const rect = progressTrack.getBoundingClientRect();
  const offsetX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
  const progressRatio = rect.width ? offsetX / rect.width : 0;
  const nextTime = progressRatio * (audio.duration || 0);

  if (Number.isFinite(nextTime)) {
    audio.currentTime = nextTime;
    currentTimeEl.textContent = formatTime(nextTime);
    setProgressVisual(progressRatio * 100);
  }
}

function updateProgressFromPointer(event) {
  if (!isDraggingProgress) {
    return;
  }

  if (progressAnimationFrame) {
    window.cancelAnimationFrame(progressAnimationFrame);
  }

  progressAnimationFrame = window.requestAnimationFrame(() => {
    setProgress(event);
  });
}

function changeVolume(value) {
  const volume = Math.max(0, Math.min(Number(value) / 100, 1));
  audio.volume = volume;
  audio.muted = volume === 0;

  if (volume > 0) {
    lastVolumeBeforeMute = volume;
  }

  setVolumeVisual(volume * 100);
  syncMuteState();
}

function toggleMute() {
  if (audio.muted || audio.volume === 0) {
    const restoredVolume = lastVolumeBeforeMute > 0 ? lastVolumeBeforeMute : 0.75;
    audio.muted = false;
    audio.volume = restoredVolume;
    volumeSlider.value = Math.round(restoredVolume * 100);
    setVolumeVisual(restoredVolume * 100);
  } else {
    lastVolumeBeforeMute = audio.volume > 0 ? audio.volume : lastVolumeBeforeMute;
    audio.muted = true;
    setVolumeVisual(audio.volume * 100);
  }

  syncMuteState();
}

function handleSongEnd() {
  nextSong();
}

function handlePlaylistClick(event) {
  const target = event.target.closest(".playlist-track");

  if (!target) {
    return;
  }

  const { index } = target.dataset;
  loadSong(Number(index));
  playSong();
}

function handleProgressPointerDown(event) {
  isDraggingProgress = true;
  progressTrack.setPointerCapture(event.pointerId);
  setProgress(event);
}

function handleProgressPointerUp(event) {
  if (!isDraggingProgress) {
    return;
  }

  isDraggingProgress = false;
  progressTrack.releasePointerCapture(event.pointerId);
  setProgress(event);
}

function handleMetadataLoaded() {
  const duration = audio.duration || 0;
  totalTimeEl.textContent = formatTime(duration);
  durationBadge.textContent = formatTime(duration);
}

function initializePlayer() {
  renderPlaylist();
  loadSong(currentSongIndex);
  audio.volume = Number(volumeSlider.value) / 100;
  setVolumeVisual(audio.volume * 100);
  syncMuteState();
  syncPlayState();
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", (event) => {
  changeVolume(event.target.value);
});

playlist.addEventListener("click", handlePlaylistClick);

progressTrack.addEventListener("pointerdown", handleProgressPointerDown);
progressTrack.addEventListener("pointermove", updateProgressFromPointer);
progressTrack.addEventListener("pointerup", handleProgressPointerUp);
progressTrack.addEventListener("pointercancel", () => {
  isDraggingProgress = false;
});
progressTrack.addEventListener("lostpointercapture", () => {
  isDraggingProgress = false;
});

audio.addEventListener("loadedmetadata", handleMetadataLoaded);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", handleSongEnd);
audio.addEventListener("play", syncPlayState);
audio.addEventListener("pause", syncPlayState);
audio.addEventListener("volumechange", syncMuteState);

initializePlayer();
