// --- Song Data (Using free samples) ---
const songs = [
    {
        title: "Summer Breeze",
        artist: "Sunny Days",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=60"
    },
    {
        title: "Digital Love",
        artist: "Tech Wave",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", 
        cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=60"
    },
    {
        title: "Mountain Echo",
        artist: "Nature Sounds",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=60"
    }
];

// --- DOM Elements ---
const playerCard = document.querySelector('.player-card');
const coverImg = document.getElementById('cover');
const titleElem = document.getElementById('title');
const artistElem = document.getElementById('artist');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const currTimeElem = document.getElementById('curr-time');
const durTimeElem = document.getElementById('dur-time');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playBtn = document.getElementById('play');
const volumeSlider = document.getElementById('volume');
const playlistElem = document.getElementById('playlist');

// --- Global State ---
let songIndex = 0;
let isPlaying = false;

// --- Initialization ---
function loadSong(song) {
    titleElem.innerText = song.title;
    artistElem.innerText = song.artist;
    audio.src = song.src;
    coverImg.src = song.cover;
}

function initPlaylist() {
    playlistElem.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        // Add active class if it's the current song
        if (index === songIndex) li.classList.add('active');
        
        li.innerHTML = `
            <img src="${song.cover}" class="playlist-thumb" alt="thumb">
            <div>
                <div style="font-size: 0.9rem">${song.title}</div>
                <div style="font-size: 0.7rem; opacity: 0.8">${song.artist}</div>
            </div>
        `;
        
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
            updatePlaylistActive();
        });
        
        playlistElem.appendChild(li);
    });
}

function updatePlaylistActive() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if(index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// --- Play/Pause Logic ---
function playSong() {
    isPlaying = true;
    playerCard.classList.add('playing');
    playBtn.querySelector('i').classList.remove('fa-play');
    playBtn.querySelector('i').classList.add('fa-pause');
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playerCard.classList.remove('playing');
    playBtn.querySelector('i').classList.add('fa-play');
    playBtn.querySelector('i').classList.remove('fa-pause');
    audio.pause();
}

// --- Navigation Logic ---
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    if(isPlaying) playSong();
    updatePlaylistActive();
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    if(isPlaying) playSong();
    updatePlaylistActive();
}

// --- Progress Bar & Time Logic ---
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    if (isNaN(duration)) return;

    // Update Progress Bar value
    const progressPercent = (currentTime / duration) * 100;
    progress.value = progressPercent;

    // Update Time Display
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    durTimeElem.innerText = `${durationMinutes}:${durationSeconds}`;

    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currTimeElem.innerText = `${currentMinutes}:${currentSeconds}`;
}

function setProgress(e) {
    const width = this.value;
    const duration = audio.duration;
    audio.currentTime = (width / 100) * duration;
}

// --- Event Listeners ---
playBtn.addEventListener('click', () => {
    const isPlaying = playerCard.classList.contains('playing');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
progress.addEventListener('input', setProgress);

// Autoplay next song when ended
audio.addEventListener('ended', nextSong);

// Volume Control
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Initial Load
loadSong(songs[songIndex]);
initPlaylist();