

// change nav bar to black only on the game page.
if(window.location.pathname === "/"){
    document.querySelector('.navbar_header').style.backgroundColor = "black"
} else {
    document.querySelector('.navbar_header').style.backgroundColor = "none"
}


// SHOWREEL button
const lightbox = document.createElement('div')
lightbox.id = 'lightbox';
document.body.appendChild(lightbox)

const lightbox_blur = document.createElement('div')
lightbox_blur.id = 'lightbox_blur_bg';
document.body.appendChild(lightbox_blur)

// when "Showreel" nav button is pushed, create a div to display an embedded youtube video at center of screen
// with a blurred backround.
const showreel = document.querySelector(".showreel");


// when clicked - set the css for video active for youtube + blurred div.
showreel.addEventListener('click', e => {
        
    lightbox.classList.add('active');
    lightbox_blur.classList.add('active');

    const video =  document.createElement('iframe');
    video.src = "https://www.youtube.com/embed/yATUI8-0piM";
    video.id = "showreel_video";

    // if div is already active, remove the first one before we add a new one.
    while (lightbox.firstChild){
        lightbox.removeChild(lightbox.firstChild);
    }

    lightbox.appendChild(video);
})


// when we are previewing the video, listen for a click outside of the window area and execute / remove video / blurred div
// basically exit the lightbox view.
lightbox.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return

    document.getElementById('showreel_video').src = "//";

    lightbox.classList.remove('active')
    lightbox_blur.classList.remove('active')
})




// Hides the nav bar for the contact page.
function hide_navbar() {
    let navbar = document.querySelector('.navbar_header');
    navbar.style.display = 'none';
    console.log("NavBar hidden");
}

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav_links");

hamburger.addEventListener("click", () =>{
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})



function hide_glow(){

}



// Animate Title.
function animateTitle(StaticTitle, Title, delay=300) {

    let counter = 0;
    let direction = true;

    aniTitle = setInterval(function () {

        if (counter == Title.length)
            direction = false;
        if (counter == false)
            direction = true;

        // If direction == True, increment counter by 1, else decrease counter by -1
        counter = (direction == true) ? ++counter : --counter;

        // If counter == 0, then " ", else slice Title[]
        newtitle = (counter == 0) ? " " : Title.slice(0, counter);

        document.title = StaticTitle + newtitle;
    }, delay)
        
}


var splash_activated = false;

if(window.location.pathname === "/about/"){

    // Splash screen fade out when the timeout.
    function Splash_fade() {
        const splash = document.querySelector('.splash');
        document.addEventListener('DOMContentLoaded', (e)=>{
            const time = 1000

            setTimeout(()=>{
                splash.classList.add('display-none');
            }, time);
        })   
    }

    // Delay start video until the splash screen has cleared.
    const startVideo = async () => {
        
            let video = document.querySelector('.video_background');
            await video.play();
            video.setAttribute('autoplay', true);

    }

    setTimeout(startVideo, 1000);
    Splash_fade();

}




if (document.title == "LouisRossouw") {
    animateTitle(StaticTitle="LouisRossouw: ", Title="Welcome!");
}
if (document.title == "LouisRossouw - Portfolio") {
    animateTitle(StaticTitle="LouisRossouw: ", Title="Portfolio");
}
if (document.title == "LouisRossouw - Contact") {
    animateTitle(StaticTitle="LouisRossouw: ", Title="Contact");
}


