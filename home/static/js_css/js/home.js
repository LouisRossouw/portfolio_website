// Splash screen fade out when the timeout.
const splash = document.querySelector('.splash');
document.addEventListener('DOMContentLoaded', (e)=>{
    const time = 2000

    setTimeout(()=>{
        splash.classList.add('display-none');
    }, time);
})



// Blur on scroll.
let my_img = document.querySelector('.img-blur');
let title = document.querySelector('section h1');

function blur_image_onScroll() {
    let scroll_amount = document.documentElement.scrollTop;

    my_img.style.filter = 'blur(' + scroll_amount/15 + 'px)';
    
    title.style.opacity = scroll_amount / 900;
}


// Delay start video until the splash screen has cleared.
let video = document.querySelector('.video_background');
const startVideo = async () => {

    await video.play();
    video.setAttribute('autoplay', true);
    console.log("video is playing")
}


setTimeout(startVideo, 2000)
