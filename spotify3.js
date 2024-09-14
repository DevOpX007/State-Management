
    let Globalaudio = new Audio;
    
    async function getsongs(artist) {
        let songs = await fetch(`http://192.168.18.18:5500/Spotify/Assets/songs${artist}`);
        let response = await songs.text();
        
        let jresponse_div = document.createElement("div");
        jresponse_div.innerHTML = response;

        let jlinks = jresponse_div.getElementsByTagName("a");
        let song_list = [];

        for (let i = 0; i < jlinks.length; i++) {
            const element = jlinks[i];
            if (element.href.endsWith("mp3")) {
                song_list.push(element.href);
            }
        }
    
        return song_list;
    }

    let controlinside = document.querySelector(".control-bar-play-button");//img tag

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        // If hours are needed (for longer audio files)
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);

        // Ternary operator to format time
        const formattedTime = hours > 0 
            ? `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        return formattedTime;
    }



                            //! ============================
                            // !        Playmusic function
                            // !============================

let currentsong = null;
    const playmusic = (track, currentAudio) => {
       Globalaudio.src = ''; // Reset the Globalaudio src
       Globalaudio = currentAudio;
        // controlinside.setAttribute("src", "Assets/Images/control-bar-play-button.svg"); 
        currentAudio.src = track; //currentAudion is globalaudio here
        currentAudio.play();
        controlinside.setAttribute("src", "Assets/Images/playing.svg");
        let replaced = track.split("/").pop();
        let percentsRemoved = replaced.replaceAll("%20", " ") ;
        let fileextensionremoved = percentsRemoved.replace("mp3", " ");
        let [song_name, artist_name] = fileextensionremoved.split("-");



        //NOTE - 
    /* ! Execution Flow: 
    Initial Check:

    When the audio starts playing, the timeupdate event fires.
    At this point, the duration might be NaN because the audio metadata hasn't fully loaded yet.
    The if (!isNaN(duration)) check fails (because duration is NaN), so the UI isn't updated with invalid values.

    Subsequent Checks:
    As the audio continues to play and more of the file is loaded, the loadeddata event ensures that the duration is eventually set.
    Once the metadata is fully loaded, duration will no longer be NaN.
    On the next timeupdate event, the if check passes, and the UI is updated with the correct time.
    */
    
    currentAudio.addEventListener('loadeddata', ()=>{
        
        currentAudio.addEventListener('timeupdate', ()=>{

        let currentTime = currentAudio.currentTime;
        let duration = currentAudio.duration;
        let song_duration = document.querySelector(".song-duration");

        if (!isNaN(duration)) {
            song_duration.innerHTML = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        }
        document.querySelector(".moving-ball").style.left = (currentTime / duration) * 100 + "%";  
        })

    
    })
        
    //seekbbar clicking to move ball

        let seekbar =  document.querySelector(".seekbar");
        seekbar.addEventListener("click", (e)=>{
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

                // Set the current time of the audio to the new time
            currentAudio.currentTime = (currentAudio.duration * percent) / 100;
        
            // Move the ball to the correct position
            document.querySelector(".moving-ball").style.left = percent + "%";
        
    })
            
        let songinfo = document.querySelector(".songinfo");
        songinfo.innerHTML = `${song_name} - ${artist_name}`;
    };



                        // !============================
                        // !       Main function
                        // !============================


     (async ()=>{   
    Array.from(document.querySelector(".circular-card-section").children).forEach((child)=>{
                child.addEventListener('click', async (e)=>{ 
                let songs = [] ;
                console.log(e.currentTarget, `here it is ${e.currentTarget.dataset.filepath}`);
                // Globalaudio.src = ''
                songs =  await getsongs(e.currentTarget.dataset.filepath);
                console.log(songs)

                //for a new artist you have to reset the src of the global audio since the controlbarplaybutton is checking if Globalaudio.src is empty before it plays the music when clicking the control bar play button.
                // Globalaudio.src = '';
                
        
                let songscontainer = document.body.querySelector(".your-songs-container");
              console.log(songscontainer);

        let songUL = document.querySelector(".your-songs-container").firstElementChild; //first element child ul hai toh uske bache li honge
        songUL.innerHTML = "";
    
        for (const song of songs) { 
            let replaced = song.split("/").pop();
            let percentsRemoved = replaced.replaceAll(/%20|%26/g, ' ');
            let fileextensionremoved = percentsRemoved.replace("mp3", " ");
            let [song_name, artist_name] = fileextensionremoved.split("-");
            console.log(song_name, artist_name);

            songUL.innerHTML += `
                <li class="dynamically-generated-cards">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#ffffff" fill="none">
                        <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5" />
                        <path d="M10 15.5C10 16.3284 9.32843 17 8.5 17C7.67157 17 7 16.3284 7 15.5C7 14.6716 7.67157 14 8.5 14C9.32843 14 10 14.6716 10 15.5ZM10 15.5V11C10 10.1062 10 9.65932 10.2262 9.38299C10.4524 9.10667 10.9638 9.00361 11.9865 8.7975C13.8531 8.42135 15.3586 7.59867 16 7V13.5M16 13.75C16 14.4404 15.4404 15 14.75 15C14.0596 15 13.5 14.4404 13.5 13.75C13.5 13.0596 14.0596 12.5 14.75 12.5C15.4404 12.5 16 13.0596 16 13.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="aria123">
                        <p>${song_name} - </p>
                        <p>${artist_name}</p>
                    </div>
                
                    <svg  class="chotaplay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#ffffff" fill="none">
                        <path id="testing" d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                </li>
            `;
        }


        let currentIndex = 0; // Track the current song index

        let controlbarplaybutton = document.querySelector(".play-music-button"); //outerdiv 
        let children = songUL.children; // li 

        controlbarplaybutton.addEventListener('click', () => {
            console.log(Globalaudio.paused);
            if (Globalaudio.paused) {
                if (Globalaudio.src === '') {                        
                    playmusic(songs[currentIndex], Globalaudio); //globalaudio ka src currentindex hojaye ga playmusic function mai jaake 
                } else {
                    Globalaudio.play();
                }
                controlinside.setAttribute("src", "Assets/Images/playing.svg");
            } else {
                Globalaudio.pause();
                controlinside.setAttribute("src", "Assets/Images/control-bar-play-button.svg");
            }
        });


        let previousCard = null; //reference to the previously card clicked
console.log(children.length);
        for (let i = 0; i < children.length; i++) {
            children[i].addEventListener('click', () => {
                //the not condition hecks if the clicked song's index (i) is different from the currently playing song's index
                // if (i !== currentIndex || Globalaudio.paused) 
                currentIndex = i; // Update the current index
            
                
                playmusic(songs[currentIndex], Globalaudio);

                songscontainer.style.backgroundColor = "#1f1f1f";
                //    testing.setAttribute("d", path);
                children[i].style.color = "#1ed760";
                if (previousCard) {
                    previousCard.style.color = ""; // Reset to default (or specify the default color)
                }
        
                // Update the current card's color 
                children[i].style.color = "#1ed760";
        
                // Store the current card as the previously clicked card
                previousCard = children[i];
        
                
            });
        }


        let playPreviousSong = document.querySelector(".play-previous-song");
        let playNextSong = document.querySelector(".play-next-song");
        
        playPreviousSong.addEventListener("click", () => {
            if (Globalaudio.src === '') {
                // If no song has been played yet, play the last song
                currentIndex = songs.length - 1; // Set to last song index
                playmusic(songs[currentIndex], Globalaudio);
                controlinside.setAttribute("src", "Assets/Images/playing.svg");
            } else {
                // If a song has been played already and the if is to check if song is at index 0
                if (currentIndex === 0) {
                    currentIndex = songs.length - 1; // Wrap around to the last song
                } else {
                    currentIndex = (currentIndex - 1) % songs.length; // Move to the previous song
                }
        
                playmusic(songs[currentIndex], Globalaudio);
                controlinside.setAttribute("src", "Assets/Images/playing.svg");
            }
        });
        

        playNextSong.addEventListener("click", () => {

                    if (Globalaudio.paused) {
                    if (Globalaudio.src === '') {                        
                        playmusic(songs[currentIndex], Globalaudio); //globalaudio ka src currentindex hojaye ga playmusic function mai jaake 
                    } else {
                        Globalaudio.play();
                    }
                    controlinside.setAttribute("src", "Assets/Images/playing.svg");
                } 

                currentIndex = (currentIndex + 1) % songs.length; // Move to the next song, wrap around if at the end because when the value of currentIndex + 1 equals the total number of songs (songs.length), the result will be 0. This is because any number modulo itself is 0
                playmusic(songs[currentIndex], Globalaudio);
        
        
        })


        Globalaudio.addEventListener("ended", () => {
            currentIndex++;
            if (currentIndex < songs.length) {
                playmusic(songs[currentIndex], Globalaudio);
            } else {
                currentIndex = 0; //here we go back to the start again
                controlinside.setAttribute("src", "Assets/Images/control-bar-play-button.svg");
            }
        });

    


        Globalaudio.addEventListener("loadeddata", () => {
            console.log(`Source last: ${Globalaudio.src}  Duration: ${Globalaudio.duration} Current Time: ${Globalaudio.currentTime}`);
        });


        //REVIEW - ----------
        //REVIEW - Left-grid properties hain neeche

    //event listener for hamburger

    let hamburger = document.querySelector(".hamburger");
    hamburger.addEventListener('click', ()=>{

        //why didnt we styled inside the variable ? because then you are assigning the variable the string value of the transform or width or left so you no longer have direct access to the DOM element for further modifications
        
        let leftgrid = document.querySelector(".left-grid");
        console.log("Current hamburger src:", hamburger.src);
        
    if (hamburger.src.includes('hamburgerclose.svg')) {
        leftgrid.style.left = "-100%"
        hamburger.setAttribute('src', 'Assets/Images/hamburger.svg')
        hamburger.style.transform = ""; //clear existing transformation
    }
    
        else { 
            requestAnimationFrame(() => {
            leftgrid.style.left = "0";  
            leftgrid.style.width = "82%"; 

            // Apply the hamburger transformation
            hamburger.setAttribute("src","Assets/Images/hamburgerclose.svg"); 
    // you have to put all values together for all the transformations to take effect , you cant define two different transform statements and supply value separately 
            hamburger.style.transform = "translateX(850%) rotate(180deg)";
        });}
        
    })


    //? EVent listener for volume 

    let volume = document.querySelector(".volume-container input");
    let volumesvg = document.querySelector(".volumesvg");

    //NOTE 
    //? hideTimeout: A variable to keep track of the timeout ID.
    //?hideSlider(): Function to set the slider opacity to 0.
    //?clearTimeout(hideTimeout): Clears the existing timeout to prevent the slider from hiding prematurely.
    //?clearTimeout(hideTimeout): Clears the existing timeout to prevent the slider from hiding prematurely.
    //?setTimeout(hideSlider, 5000): Sets a new timeout to hide the slider after 5 seconds of inactivity.

    let hideTimeout; //variable to keep track of timeout ID

    // Function to hide the slider
    function hideSlider() {
        console.log('Hiding slider'); // Debugging line
        volume.style.opacity = "0";
    }

    // Show slider on SVG click
    volumesvg.addEventListener("click", () => {
        console.log('SVG clicked'); // Debugging line
        volume.style.opacity = "1";

        // Clear any existing hide timeout
        clearTimeout(hideTimeout);

        // Set a new timeout to hide the slider after 5000 milliseconds (5 seconds)
        hideTimeout = setTimeout(hideSlider, 3000);
    });

    // Show slider on slider input change
    volume.addEventListener('input', (e) => {
        console.log('Slider input changed'); // Debugging line
        Globalaudio.volume = e.target.value / 100;

        // Clear any existing hide timeout
        clearTimeout(hideTimeout);

        // Show slider immediately when the user interacts with it
        volume.style.opacity = "1";

        // Set a new timeout to hide the slider after 5000 milliseconds (5 seconds) of inactivity
        hideTimeout = setTimeout(hideSlider, 3000);
    });

    // Optional: Hide slider when mouse leaves the volume container
    document.querySelector(".volume-container").addEventListener('mouseleave', () => {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(hideSlider, 3000);
    });
            })
            
        }) }) ();



    

