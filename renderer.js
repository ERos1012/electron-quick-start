// renderer.js

let audio;
let playPauseBtn, prevBtn, nextBtn, progressBar;
let songName, artistName, songImg;
let currentTimeEl, totalTimeEl;

let songs = [];
let songIndex = 0;
let isPlaying = false;

window.addEventListener("DOMContentLoaded", async () => {
  // Get elements
  playPauseBtn = document.getElementById("play-pause");
  prevBtn = document.getElementById("prev");
  nextBtn = document.getElementById("next");
  progressBar = document.getElementById("progress-bar");
  songName = document.querySelector(".song-name");
  artistName = document.querySelector(".artist-name");
  songImg = document.querySelector(".song-img");
  currentTimeEl = document.getElementById("current-time");
  totalTimeEl = document.getElementById("total-time");


  // Create and insert audio element
  audio = new Audio();
  document.body.appendChild(audio);

  // Fetch songs
fetch('https://eros1012.github.io/music-assets/songs.json')
  .then(response => response.json())
  .then(data => {
    songs = data;
    loadSong(songs[songIndex]);
    setupEventListeners();
  })
  .catch(err => console.error("Failed to load songs:", err));
});

function loadSong(song) {
  songName.textContent = song.name;
  artistName.textContent = song.artist;
  audio.src = song.src;
  songImg.src = song.image;

  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });
}


function playSong() {
  audio.play();
  isPlaying = true;
  playPauseBtn.querySelector("img").src = "icons/pause.svg";
  playPauseBtn.querySelector("img").alt = "Pause";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.querySelector("img").src = "icons/play.svg";
  playPauseBtn.querySelector("img").alt = "Play";
}

function togglePlayPause() {
  isPlaying ? pauseSong() : playSong();
}

function playNext() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function playPrev() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgressBar() {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}


function seekAudio(e) {
  const value = e.target.value;
  audio.currentTime = (value / 100) * audio.duration;
}

function setupEventListeners() {
  playPauseBtn.addEventListener("click", togglePlayPause);
  prevBtn.addEventListener("click", playPrev);
  nextBtn.addEventListener("click", playNext);
  progressBar.addEventListener("input", seekAudio);
  audio.addEventListener("timeupdate", updateProgressBar);
  audio.addEventListener("ended", playNext);
}
