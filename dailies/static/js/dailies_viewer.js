// Delay start video until the splash screen has cleared.
const dailies_startVideo = async () => {
    let video = document.querySelector('.selected_media');
    await video.play();
    video.setAttribute('autoplay', true);
}

dailies_startVideo();




function add_vote(element){

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);

        }
    }
    xhttp.open("GET", "/ajax_add_vote/?id=" + row_selected, true);
    xhttp.send();
}









function fdb_validateForm(){

    var allowed_letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var input_text = document.getElementById("id_written_comment").value;

    // var humanity = document.getElementById("FDB_humanity_val");
    // var humanity_txt = document.getElementById("FDB_humanity_txt");

    var comment_valid = false;
    var the_reason = "";
    var is_valid = false;
    var is_human = false;

    if (input_text.length > 100){
        comment_valid = false;
        the_reason = "Character limit exceeded, Please keep it under 100 letters.";

    } else if (input_text.length < 5){
        comment_valid = false;
        the_reason = "Not enough words.";

    } else {
        comment_valid = true;
    }

    if (comment_valid == false){
        is_valid = false
        alert(the_reason)
    } else{
        is_valid = true;
    }


    return is_valid;
}
