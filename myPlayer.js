const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("prev")
const player = document.querySelector(".player")
const coverImg = document.getElementById("cover-img");
const playerSongTitle = document.getElementById("player-song-title");
const playerSongArtist = document.getElementById("player-song-artist");
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const musicBtn = document.querySelector('.music-btn');

const allSongs = [
  {
    id: 0,
    title: "Interstelar",
    artist: "Alexia",
    duration: "3:22",
    src: "Alexia-Interstelar",
    img: "Alexia-Interstelar",
  },
  {
    id: 1,
    title: "Arata-mi",
    artist: "Alina Eremia",
    duration: "2:52",
    src: "AlinaEremia-Arata-mi",
    img: "AlinaEremia-Arata-mi",
  },
  {
    id: 2,
    title: "Sa fii fericit",
    artist: "Alina Eremia",
    duration: "2:42",
    src: "AlinaEremia-SaFiiFericit",
    img: "AlinaEremia-SaFiiFericit",
  },
  {
    id: 3,
    title: "Scrie-mi orice",
    artist: "Andia",
    duration: "3:27",
    src: "Andia-Scrie-miOrice",
    img: "Andia-Scrie-miOrice",
  },
  {
    id: 4,
    title: "Ultima data",
    artist: "Emaa",
    duration: "3:35",
    src: "Emaa-UltimaData",
    img: "Emaa-UltimaData",
  },
  {
    id: 5,
    title: "Closer To Christmas",
    artist: "Jason Derulo",
    duration: "3:10",
    src: "JasonDerulo-CloseToChristmas",
    img: "JasonDerulo-CloseToChristmas",
  },
  {
    id: 6,
    title: "Pana imbatranim",
    artist: "Olivia Addams",
    duration: "3:21",
    src: "OliviaAddams-PanaImbatranim",
    img: "OliviaAddams-PanaImbatranim",
  },
  {
    id: 7,
    title: "Un minut",
    artist: "Misha Miller",
    duration: "3:07",
    src: "MishaMiller-UnMinut",
    img: "MishaMiller-UnMinut",
  },
  {
    id: 8,
    title: "Nu te mai astept",
    artist: "Alina Eremia",
    duration: "3:04",
    src: "AlinaEremia-NuTeMaiAstept",
    img: "AlinaEremia-NuTeMaiAstept",
  },
  {
    id: 9,
    title: "Bailando Bachata",
    artist: "Chayanne",
    duration: "2:49",
    src: "Chayanne-Bailando-Bachata",
    img: "Chayanne-Bailando-Bachata",
  },
]

const audio = new Audio();

let myData = {
  songs: [...allSongs],
  mySong: null,
  myTime: 0,
};

let index = 0

function loadSong(song) {
  playerSongTitle.innerText = song.title ? song.title : ""
  playerSongArtist.innerText = song.artist ? song.artist : ""
  audio.src = `songs/${song.src}.mp3`
  coverImg.src = `images/${song.img}.jpg`
}

loadSong(myData?.songs[index])

const playSong = (id) => {
  const song = myData?.songs.find((song) => song.id === id)

  if (myData?.mySong === null || myData?.mySong.id !== song.id) {
    audio.currentTime = 0
  } else {
    audio.currentTime = myData.myTime
  }
  myData.mySong = song
  player.classList.add("play")
  highlightCurrentSong();
  loadSong(myData?.songs[song.id])
  audio.src = `songs/${song.src}.mp3`;
  coverImg.src = `images/${song.img}.jpg`;
  audio.play();
}

const pauseSong = () => {
  myData.myTime = audio.currentTime
  player.classList.remove("play")
  audio.pause()
}

const playNextSong = () => {
  if (myData?.mySong === null) {
    playSong(myData?.songs[0].id)
  } else {
    index++
    if (index > myData?.songs?.length - 1) {
      index = 0
    }
    loadSong(myData?.songs[index])
    playSong(myData?.songs[index].id)
  }
}

const playPreviousSong = () => {
  if (myData?.mySong === null) {
    return
  } else {
    index--
    if (index < 0) {
      index = myData?.songs?.length - 1
    }
    loadSong(myData?.songs[index])
    playSong(myData?.songs[index].id)
  }
}

function updateProgress(e) {
  const {duration, currentTime} = e.srcElement
  const progressPercent = (currentTime / duration) * 100
  progress.style.width = `${progressPercent}%`
}

function setProgress(e) {
  const width = this.clientWidth
  console.log(width)
  const clickX = e.offsetX
  console.log(clickX)
  const duration = audio.duration
  audio.currentTime = (clickX / width) * duration
}


const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song")
  const songToHighlight = document.getElementById(`song-${myData?.songs[index].id}`)
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  })
  if (songToHighlight) {
   songToHighlight.setAttribute("aria-current", "true");
   console.log(songToHighlight);
  }
}

const deleteSong = (id) => {
  if (myData?.mySongSong?.id === id) {
    myData.mySong = null
    myData.myTime = 0
    playerSongTitle.innerText = ""
    playerSongArtist.innerText = ""
    pauseSong()
  }
  myData.songs = myData?.songs.filter((song) => song.id !== id)
  pauseSong()
  renderSongs(myData.songs)
  highlightCurrentSong();

  if (myData?.songs?.length === 0 || myData.mySong === null) {
    pauseSong()
    const resetButton = document.createElement("button")
    const resetText = document.createTextNode("Reset Playlist")
    resetButton.classList.add("reset-btn")
    resetButton.id = "reset"
    resetButton.ariaLabel = "Reset playlist"
    resetButton.appendChild(resetText)
    playlistSongs.appendChild(resetButton)
    resetButton.addEventListener("click", () => {
      myData.songs = [...allSongs]
      renderSongs(myData?.songs)
      resetButton.remove()
    })
  }
}

// Render music
const renderSongs = (array) => {
  const songsHtml = array
    .map((song) => {
      return `
        <li id="song-${song.id}" class="playlist-song" onclick="playSong(${song.id})">
          <span>
            ${song.title} - ${song.artist} * ${song.duration}
          </span>
          <i onclick="deleteSong(${song.id})" class="playlist-song-delete fas fa-trash" aria-label="Delete${song.title}"></i>
        </li>
        
      `
    })
    .join("")
  playlistSongs.innerHTML = songsHtml
}

// Events
playButton.addEventListener("click", () => {
  if (myData?.mySong === null) {
    playSong(myData?.songs[0].id)
  } else {
    playSong(myData?.mySong?.id)
  }

  const isPlaying = player.classList.contains("play")
  if (isPlaying) {
    playSong(myData?.mySong?.id)
  } else {
    pauseSong()
  }
})

pauseButton.addEventListener("click", () => {
  const isPlaying = player.classList.contains("play")
  if (isPlaying) {
    pauseSong()
  } else {
    playSong(myData.mySong?.id)
  }
})

nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);
audio.addEventListener("ended", playNextSong);

renderSongs(myData?.songs);
