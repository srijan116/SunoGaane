let currentSong = new Audio();
let allSongs;
let curFolder;

async function getSongs(id){
    let songContainer = document.getElementById("allSongs");
    songContainer.innerHTML = "";
    let folder = id.dataset.folder;
    curFolder = folder;

    let songList = await fetch("/get-songs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(folder),
    });

    let songs = await songList.json();
    allSongs = songs;

    for(let i=0; i<songs.length; i++){
        songContainer.innerHTML += `<div id="cursor-${i+1}"> <div class="music-card" id="music-${i+1}" onclick="playSong(document.getElementById(id).innerText)" onmouseenter="highlight(id)" onmouseleave="removeHighlight(id)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18"><path fill="white" d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>
        <div class="song-info">${songs[i].split(".mp3")[0]}</div>
        </div></div>`
    }

    let firstSong = document.getElementById("music-1").innerText;
    loadSong(firstSong);

    document.getElementById("play-pause-btn").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24"><path fill="white" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9V168c0-8.7 4.7-16.7 12.3-20.9z"/></svg>`;

    document.querySelector(".progressCircle").style.left = 0;
    
}

async function loadCards(){
    // currentSong.pause();
    let cardContainer = document.querySelector(".cardContainer");
    let cardList = await fetch("https://sunogaane.onrender.com/get-cards");
    let cards = await cardList.json();
    document.getElementById("allSongs").innerHTML = "";
    
    for(let i=0; i<cards.length; i++){
        cardContainer.innerHTML += `<div id="card-${i+1}" class="card curve" data-folder="${cards[i]}" onclick="getSongs(this)">
        <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="15" height="15"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
        </div>
        <img src="/static/images/card-bg-${i+1}.jpg"" alt="artist" width="200" height="200">
        <h4>${cards[i]}</h4>
        <p>Listen to songs by ${cards[i]}.</p>
    </div>`

    }

}

async function playSong(filename) {
    // console.log(id)
    // let filename = document.getElementById(id).innerText;
    let elem = document.querySelector(".active");
    if(elem != null){
        elem.classList.remove("active");
    }
    let point = document.querySelector(".pointerNone")
    if(point != null){
        elem.classList.remove("pointerNone");
    }
    let noCursor = document.querySelector("#cursor");
    if(noCursor != null){
        noCursor.classList.remove("cursorNone");
    }
    
    try {
        const response = await fetch(`/play/${curFolder}/${filename}`);
        const blob = await response.blob();
        currentSong.src = URL.createObjectURL(blob);
        currentSong.play();
        
        document.getElementById("songName").innerHTML = filename;

        document.getElementById("play-pause-btn").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24"><path fill="white" d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>`

        
        let curSongName = document.getElementById("songName").innerText;
        let songs = [];
        for (const song of allSongs) {
            songs.push(song.split(".mp3")[0])
        }
        document.getElementById("cursor-" + (songs.indexOf(curSongName) + 1)).classList.add("cursorNone");
        document.getElementById("music-" + (songs.indexOf(curSongName) + 1)).classList.add("pointerNone");
        document.getElementById("music-" + (songs.indexOf(curSongName) + 1)).classList.add("active");

        
        
        // console.log(currentSong, currentSong.name)

        // if(currentSong.paused){
        //     console.log("songgg pausedd noww")
        //     document.getElementById("play-" + (songs.indexOf(curSongName) + 1)).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12" height="12"><path fill="white" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`
            
        // }
        // else{
        //     console.log("playinggg")
        //     document.getElementById("play-" + (songs.indexOf(curSongName) + 1)).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#ffffff" fill="none">
        //     <path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" stroke="currentColor" stroke-width="1.5" />
        //     <path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" stroke="currentColor" stroke-width="1.5" />
        //     </svg>`
        // }
    } 
    catch (error) {
        console.error('Error playing song:', error);
    }
}

function secToMin(second){
    let min = Math.floor(second/60);
    let second_left = Math.floor(second % 60);
    let formatted_min = String(min).padStart(2,"0");
    let formatted_sec = String(second_left).padStart(2,"0");
    let time = formatted_min + ":" + formatted_sec;
    return time;
}

function highlight(id){
    document.getElementById(id).style.fontSize = "17px" 
}
function removeHighlight(id){
    document.getElementById(id).style.fontSize = "16px"; 
}

async function loadSong(filename){
    document.getElementById("duration").innerHTML = "00:00/00:00";
    const response = await fetch(`/play/${curFolder}/${filename}`);
    const blob = await response.blob();
    currentSong.src = URL.createObjectURL(blob);
    document.getElementById("songName").innerHTML = filename;
    document.getElementById("music-1").classList.add("active");
}

function main(){
    const load = async () =>{
        await loadCards();
        getSongs(document.getElementById('card-' + 1))
    }
    load();

    let playbtn = document.getElementById("play-pause-btn");

    playbtn.addEventListener('click', () =>{
        // let curSongName = document.getElementById("songName").innerText;
        // let songs = [];
        // for (const song of allSongs) {
        //     songs.push(song.split(".mp3")[0])
        // }

        if(currentSong.paused){
            currentSong.play();   
            playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24"><path fill="white" d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>`

            // document.getElementById("play-" + (songs.indexOf(curSongName) + 1)).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#ffffff" fill="none">
            // <path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" stroke="currentColor" stroke-width="1.5" />
            // <path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" stroke="currentColor" stroke-width="1.5" />
            // </svg>`

        }
        else{
            currentSong.pause();
            playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24"><path fill="white" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9V168c0-8.7 4.7-16.7 12.3-20.9z"/></svg>`

            // document.getElementById("play-" + (songs.indexOf(curSongName) + 1)).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12" height="12"><path fill="white" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`
        }
    })


    currentSong.addEventListener('timeupdate', async () => {
        let total_time = secToMin(currentSong.duration);
        let current_time = secToMin(currentSong.currentTime);
        if(currentSong.paused){
            if(isNaN(total_time) && total_time > 0){
                document.getElementById("duration").innerHTML = "00:00/00:00";
            }
        }
        else{
            document.getElementById("duration").innerHTML = `${current_time} / ${total_time}`;
        }
        
        document.querySelector(".progressCircle").style.left = ((currentSong.currentTime / currentSong.duration) * 100) + "%";
    })


    document.querySelector(".seekbar").addEventListener('click',(e)=>{ 
        let percentProgress = ((e.offsetX / e.target.getBoundingClientRect().width) * 100);
        document.querySelector(".progressCircle").style.left = percentProgress + "%";
        let seek_time = (percentProgress * currentSong.duration)/100;
        currentSong.currentTime = seek_time       
    })

    document.querySelector(".hamburger").addEventListener('click', () => {
        document.querySelector(".left").style.left = 0;
    })

    document.querySelector(".close").addEventListener('click', () => {
        document.querySelector(".left").style.left = "-100%";
    })

    document.querySelector("#nextSong").addEventListener('click', () => {
        let curSongName = document.getElementById("songName").innerText;
        let songs = [];
        for (const song of allSongs) {
            songs.push(song.split(".mp3")[0])
        }
        let indexCurSong = songs.indexOf(curSongName);
        if(indexCurSong == songs.length - 1){
            playSong(songs[0]);
        }
        else{
            playSong(songs[indexCurSong + 1]);
        }
        
    })

    document.querySelector("#previousSong").addEventListener('click', () => {
        let curSongName = document.getElementById("songName").innerText;
        let songs = [];
        for (const song of allSongs) {
            songs.push(song.split(".mp3")[0])
        }
        let indexCurSong = songs.indexOf(curSongName);
        if(indexCurSong == 0){
            playSong(songs[songs.length - 1]);
        }
        else{
            playSong(songs[indexCurSong - 1]);
        }
        
    })

    document.getElementById("volbtn").addEventListener('click', () =>{
        let bar = document.getElementById("volumeBar");
        if(bar.style.display == "block"){
            bar.style.display = "none";
        }
        else{
            bar.style.display = "block";
            setTimeout(() => {
                document.getElementById("volumeBar").style.display = "none";
            },3000);
        }
    })

    document.getElementById("volumeBar").firstElementChild.addEventListener('input',(e)=>{
        currentSong.volume = (e.target.value)/100;
        // setTimeout(() => {
        //     document.getElementById("volumeBar").style.display = "none";
        // },500);
        
        
    })
}

main()
