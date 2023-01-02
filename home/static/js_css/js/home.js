const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav_links");

hamburger.addEventListener("click", () =>{
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})



// Animate Title.
function animateTitle(StaticTitle, Title, delay=300) {

        let counter = 0;
        let direction = true;

        aniTitle = setInterval(function () 
        {

            if (counter == Title.length)
                direction = false;
            if (counter == false)
                direction = true;

            // If direction == True, increment counter by 1, else decrease counter by -1
            counter = (direction == true) ? ++counter : --counter;

            // If counter == 0, then " ", else slice Title[]
            newtitle = (counter == 0) ? " " : Title.slice(0, counter);

            document.title = StaticTitle + newtitle;}, delay)
        }




// Splash screen fade out when the timeout.
function Splash_fade() {
    const splash = document.querySelector('.splash');
    document.addEventListener('DOMContentLoaded', (e)=>{
        const time = 2000

        setTimeout(()=>{
            splash.classList.add('display-none');
        }, time);
    })
}


// Blur on scroll.
let my_img = document.querySelector('.img-blur');
let title = document.querySelector('section h1');

function blur_image_onScroll() {
    let scroll_amount = document.documentElement.scrollTop;
    my_img.style.filter = 'blur(' + scroll_amount/15 + 'px)';
    title.style.opacity = scroll_amount / 900;
}


// Delay start video until the splash screen has cleared.
const startVideo = async () => {
    let video = document.querySelector('.video_background');
    await video.play();
    video.setAttribute('autoplay', true);
    console.log("video is playing")
}




// Run Functions.
setTimeout(startVideo, 2000);
Splash_fade();


if (document.title == "LouisRossouw") {
    animateTitle(StaticTitle="LouisRossouw: ", Title="Welcome!");
}
if (document.title == "LouisRossouw - Portfolio") {
    animateTitle(StaticTitle="LouisRossouw: ", Title="Portfolio");
}
