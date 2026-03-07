import { listSongs } from "./data.js";

const artistName = document.querySelector(".artist-name");
const songName = document.querySelector(".song-name");
const playlistSongs = document.querySelector(".playlist-songs");
const playButton = document.querySelector(".play");
const pauseButton = document.querySelector(".pause");
const nextButton = document.querySelector(".next");
const previousButton = document.querySelector(".prev");
const player = document.querySelector(".player");

const coverImg = document.querySelector(".cover img");
const progressContainer = document.querySelector(".progress-container");
const progress = document.querySelector(".progress");

const audio = new Audio();

let songs = [...listSongs];
let currentIndex = 0;

function loadSong(index) {
  const song = songs[index];

  artistName.textContent = song.artist;
  songName.textContent = song.name;

  audio.src = song.src;
  coverImg.src = song.img;
}

function playSong() {
  player.classList.add("play");
  audio.play();
    highlightCurrentSong();
}

function pauseSong() {
  player.classList.remove("play");
  audio.pause();
}

function nextSong() {
  currentIndex++;

  if (currentIndex >= songs.length) {
    currentIndex = 0;
  }

  loadSong(currentIndex);
  playSong();
}

function previousSong() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = songs.length - 1;
  }

  loadSong(currentIndex);
  playSong();
}

function renderSongs() {
  playlistSongs.innerHTML = songs
    .map(
      (song, i) => `
      <li class="playlist-song" data-index="${i}">
        ${song.artist} - ${song.name}
      </li>
    `,
    )
    .join("");
}

playlistSongs.addEventListener("click", (e) => {
  const songElement = e.target.closest(".playlist-song");

  if (!songElement) return;

  currentIndex = Number(songElement.dataset.index);

  loadSong(currentIndex);
  playSong();
});

function highlightCurrentSong() {
  document.querySelectorAll(".playlist-song").forEach((song) => {
    song.removeAttribute("aria-current");
  });

  const activeSong = document.querySelector(`[data-index="${currentIndex}"]`);

  if (activeSong) {
    activeSong.setAttribute("aria-current", "true");
  }
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const percent = (currentTime / duration) * 100;
  progress.style.width = percent + "%";
}

function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

playButton.addEventListener("click", playSong);
pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", nextSong);
previousButton.addEventListener("click", previousSong);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextSong);

progressContainer.addEventListener("click", setProgress);

renderSongs();
loadSong(currentIndex);
