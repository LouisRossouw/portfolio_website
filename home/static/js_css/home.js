
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


var splash_activated = false;

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
    console.log("video is playing")
}



// Run Functions.
setTimeout(startVideo, 1000);
// setTimeout(start_text, 2000);
Splash_fade();









if (document.title == "LouisRossouw") {
    animateTitle(StaticTitle="LouisRossouw: ", Title="Welcome!");
}
if (document.title == "LouisRossouw - Portfolio") {
    animateTitle(StaticTitle="LouisRossouw: ", Title="Portfolio");
}
if (document.title == "LouisRossouw - Contact") {
    animateTitle(StaticTitle="LouisRossouw: ", Title="Contact");
    // hide_navbar();
}



function start_text(t){

    var tt = "<p> I'm a senior character animator with over 10 years of professional experience working in the film and advertising industry.</p>"
    var t2 = "<p> I am creatively flexible, self motivated and a reliable individual that loves to play and experiment with my work. I've had the privilege of being a lead animator for the Apceros sequence in the Monster Hunter film, Deep Blue Sea 3 and other films, animated within Houdini and Maya.</p>"
    var t3 = "<p> I'm happiest when knee-deep adding life to complex realistic <HIGHLIGHT-ME>quadruped animals, to cute goofy characters that make people laugh and feel connected, although most of my work is character animation, I am passionate about other parts of the pipeline too, from modeling to rendering and lighting, to developing pipeline tools for other <HIGHLIGHT-ME>artists to use.</p>"
    var t4 = "<p> <HREF-ME>ezconvert.io</p>"
    
    var t = tt + t2 + t3 + t4;
    
    write_write(t, document.getElementById('paragragh_01'), 16, 20, "int-txt_p01")
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function devtest(namez){

    var tg = 0;
    var r = 250;
    var g = 250;
    var b = 250;

        for (var t = 0; t < 10; t++) {

            await delay(100);
            tg += 0.1;
            r -= 15;
            g -= 3.5; 
            b -= 1; 
            document.getElementById(namez).style.textShadow = "0px 0px 25px rgba(150, 255, 100," + tg + ")";
            document.getElementById(namez).style.color = "rgb(" + r + ", " + g + "," + b + ")";
            //document.getElementById(namez).style.color = "rgb(150, 255, 100, 200)";
        }
        for (var t = 1; t >= 0; t -= 0.1) {
            await delay(50);
            document.getElementById(namez).style.textShadow = "0px 0px 25px rgba(150, 255, 100," + t + ")";
        }
}





async function write_write(text, input_element, trail_count, speed, unique_ID){

    input_element.innerHTML = "";
    var seperate_words = text.split(" ");
    
    var highlight_list = [];
    
    var count = trail_count;
    var paragraph_length = seperate_words.length;
    var text_length = seperate_words.length + count;
    
    // add numbers spans with 0 opacity and blur(Npx),
    for (var i = 0; i < text_length; i++) {
        var single_word = seperate_words[i];
    
        if (i <= paragraph_length) {
            if (single_word !== undefined){
    
                if (single_word.includes("<HIGHLIGHT-ME>")) {
                    
                    single_word.replace("<HIGHLIGHT-ME>", "")
                    highlight_list.push(unique_ID + '_' + i);
                    var insert_span = '" style="filter: blur(4px); opacity: 0">' + single_word + " ";
    
                } else if (single_word.includes("<HREF-ME>")) {
    
                    single_word.replace("<HREF-ME>", "")
                    var insert_span = '" style="color: red; filter: blur(4px); opacity: 0"><a style="color: aqua;" href="https://www.ezconvert.io/" target="_blank">' + single_word + "</a> ";
    
                } else {
                    var insert_span = '" style="filter: blur(4px); opacity: 0">' + single_word + " ";
                }
    
                input_element.innerHTML += '<span id="' + unique_ID + '_' + i + insert_span + '</span>';
            }
        }
    }
    
    // animate opacity to 1 and blur to 0
    for (var i = 0; i < text_length; i++) {
    
    var opacity = 0;
    var blr = 4;
    var reduceby = blr / count;
    var color = 0;
    
    if (i >= count){
    
        await delay(speed);
        document.getElementById(unique_ID + '_0').style.filter = "blur(" + 0 + "px)";
        document.getElementById(unique_ID + '_0').style.opacity = 1;
    
        
    
        if (highlight_list.includes(unique_ID + '_' + (i - e))) {
            var tmps = unique_ID + '_' + (i - e);
            devtest(tmps);
        }
    
        for (var e = 0; e < count; e++) {
    
            var amount = blr - reduceby;
            blr = amount;
            opacity += 0.1;
    
            if ((e + 1) >= count){
                try {
                document.getElementById(unique_ID + '_' + (i - e)).style.filter = "blur(" + 0 + "px)";
                document.getElementById(unique_ID + '_' + (i - e)).style.opacity = 1;
            } catch (error) {
                
            }
            } else {
    
                try {
    
                document.getElementById(unique_ID + '_' + (i - e)).style.filter = "blur(" + amount + "px)";
                document.getElementById(unique_ID + '_' + (i - e)).style.opacity = opacity;
                } catch (error) {
                    
                }
            }
        }
    }
}
}
    