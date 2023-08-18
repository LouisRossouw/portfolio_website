
export function calculate_user_ranking(user_points){

    // add user points to the rankings list, sort the list by descending
    // index 0, 1 , 2 are the top 3 users.
    leaderboard_ranks.push(user_points)
    leaderboard_ranks.sort(function(a, b){return b-a}) // descending
    var index = leaderboard_ranks.indexOf(user_points) + 1 // get Ranking based on index position.

    var ranking = `${index} / ${leaderboard_ranks.length}`

    // remove point so it doesnt accumelate when the user restarts.
    leaderboard_ranks.splice(index - 1, 1)

    return ranking
}


export function get_time_difference(time_start, time_end){
    
    var difference = (time_end - time_start)  / (1000 * 60) 
    var roundedValue = parseFloat(difference.toFixed(2));

    return roundedValue
}



export function start_text(t, element_id){

    var text_01 = "<p> <HIGHLIGHT-ME>The <HIGHLIGHT-ME>Game <HIGHLIGHT-ME>is <HIGHLIGHT-ME>simple!</p>"
    var text_02 = "<p> <HIGHLIGHT-ME>Collect <HIGHLIGHT-ME>the <HIGHLIGHT-ME>balls <HIGHLIGHT-ME>without <HIGHLIGHT-ME>being <HIGHLIGHT-ME>touched <HIGHLIGHT-ME>by <HIGHLIGHT-ME>a <HIGHLIGHT-ME>zombie, </p>"

    var text_03 = "<p> <HIGHLIGHT-ME>try <HIGHLIGHT-ME>to <HIGHLIGHT-ME>beat <HIGHLIGHT-ME>the <HIGHLIGHT-ME>high <HIGHLIGHT-ME>score.</p>"
    var text_04 = "<p> <HIGHLIGHT-ME>good <HIGHLIGHT-ME>luck <HIGHLIGHT-ME>have <HIGHLIGHT-ME>fun!</p>"

    var t = text_01 + text_02 + text_03 + text_04
    
    write_write(t, document.getElementById(element_id), 10, 40, "int-txt_p01")
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function highLight_word(word){

    var tg = 10;
    var r = 250;
    var g = 250;
    var b = 250;

        for (var t = 0; t < 10; t++) {

            await delay(100);
            tg += 0.1;
            r -= 30;
            g -= 2; 
            b -= 5; 
            document.getElementById(word).style.textShadow = "0px 0px 25px rgba(150, 255, 100," + tg + ")";
            document.getElementById(word).style.color = "rgb(" + r + ", " + g + "," + b + ")";
            //document.getElementById(namez).style.color = "rgb(150, 255, 100, 200)";
        }
        for (var t = 1; t >= 0; t -= 0.1) {
            await delay(50);
            document.getElementById(word).style.textShadow = "0px 0px 25px rgba(150, 255, 100," + t + ")";
        }
}




// This is a dirty script i wrote to fade / blur text on. i need to improve it later.
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
                highLight_word(tmps);
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
    