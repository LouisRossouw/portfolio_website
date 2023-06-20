var submitter_enabled = false;

function open_submitter(){
    submitter_enabled = true;
    document.getElementById("DLS_submitter").style.display = "block";
    document.getElementById("DLS_submitter_bg_blur").style.display = "flex";
}

function close_submitter(){
    submitter_enabled = false;
    document.getElementById("DLS_submitter").style.display = "none";
    document.getElementById("DLS_submitter_bg_blur").style.display = "none"; 
}


// Close the submitter if BTG blur section was clicked.
const DLS_submitter_bg_blur = document.getElementById("DLS_submitter_bg_blur");
DLS_submitter_bg_blur.addEventListener('click', function(event) {
    close_submitter()
})


window.addEventListener('load', function() {
    // on load, start a video
    var button = document.getElementById('test3');
  
    // Simulate a click event on the button
    button.click();
  });