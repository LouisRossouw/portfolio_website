

var row_selected = '';

function select_comments(event, capture){
    // Displays the comment section and hides the capture.
    event.stopPropagation(); // Stops from activating the row click.
    document.getElementById("DLS_VW_viewer").style.display = "none";
    document.getElementById("DLS_VW_comments").style.display = "block";
}




function select_row(element, row, path, index, project_name, media_type) {
    // Update viewer and details on row select.

    row_selected = index;

    var mediaPrefix = "/media/";
    var file_path = mediaPrefix + path;

    if (media_type === "Video") {

        document.getElementById("DLS_VW_cap_img").style.display = "none";
        document.getElementById("DLS_VW_cap").style.display = "block";
        var videoElement = document.getElementById('DLS_VW_cap');
        videoElement.src = file_path;
        videoElement.load();
        videoElement.play();

    } else if (media_type === "Image"){

        document.getElementById("DLS_VW_cap_img").style.display = "block";
        document.getElementById("DLS_VW_cap").style.display = "none";
        var imageElement = document.getElementById('DLS_VW_cap_img');
        imageElement.src = file_path;

    } else {

        document.getElementById("DLS_VW_cap_img").style.display = "none";
        document.getElementById("DLS_VW_cap").style.display = "block";
        var videoElement = document.getElementById('DLS_VW_cap');
        videoElement.src = file_path;
        videoElement.load();
        videoElement.play();
    }

    document.getElementById("DLS_VW_comments").innerHTML = "";
    append_file_list_to_user(index, project_name)
}




function append_file_list_to_user(id, project_name){
    // Ajax call to backend to retrieve details from selected capture.

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var data = JSON.parse(this.responseText);

            var selectedFile = JSON.parse(data.captures)[0].fields;
            var studio = JSON.parse(data.studio)[0].fields;
            var commento = JSON.parse(data.comments);

            update_capture_viewer(id, project_name, selectedFile, studio, commento)
        }
    }
    xhttp.open("GET", "/ajax_capture_data/?id=" + id, true);
    xhttp.send();
}




function update_capture_viewer(id, project_name, selectedFile, studio, commento){
    // Updates the capture viewer with details, logos, comments, etc

    var softwareContainer = document.getElementById("DLS_VW_software_container");

    softwareContainer.innerHTML = "";
    var software_used = selectedFile.software_used

    // Add software used.
    if (Boolean(software_used) === true) {
        var software_used_array = JSON.parse(software_used.replace(/'/g, "\""));

        var add_img = "";
        for (var i = 0; i < software_used_array.length; i++) {            
            add_img += '<img class="software_item" src="/media/dailies/' + software_used_array[i] + '.png" width="20" height="20"></img>'
        }
        softwareContainer.innerHTML = add_img;
    }

    // Add company logo. ( need /media/dailies/company_name.png )
    var logoContainer = document.getElementById("DLS_VW_logo_container");
    logoContainer.innerHTML = '<img class="software_item" src="/media/dailies/'+ studio.studio_name +'.png" width="20" height="20"></img>';
    
    // Generate Title for viewer.
    var generate_title = "<span style='margin-right: 5px;'>" + studio.project_name;
    generate_title +=  "</span> - <span style='margin-left: 5px;'>"
    generate_title +=  selectedFile.capture_name + "_" + selectedFile.task_type + "_" + selectedFile.version + "</span>";
    document.getElementById("vw_d_title").innerHTML = generate_title;

    // update hidden input for write comment.
    document.getElementById("DLS_VW_inp_daily").value = id;

    // Add icons and capture details.
    document.getElementById("DLS_VW_viewer").style.display = "block";
    document.getElementById("DLS_VW_vote_count").innerHTML = selectedFile.upvotes;
    document.getElementById("vw_d_description").innerHTML = selectedFile.description;
    document.getElementById("vw_d_project").innerHTML = '<i class="fa-solid fa-caret-right" style="color:white; margin-right:10px;"></i>' + studio.project_name;
    document.getElementById("vw_d_studio").innerHTML = '<i class="fa-solid fa-house-user fa-2xs" style="color:white; margin-right:5px;"></i>' + studio.studio_name;
    document.getElementById("vw_d_task").innerHTML = '<i class="fa-solid fa-wrench fa-2xs" style="color:white; margin-right:10px;"></i> ' + selectedFile.task_type;
    document.getElementById("vw_d_satus").innerHTML = '<i class="fa-regular fa-flag fa-2xs" style="color:white; margin-right:10px;"></i>' + selectedFile.status;
            
    // Show comment section if there are more than 1 comment.
    if (commento.length < 1){
        document.getElementById("DLS_comments_titles").style.display = "none";
        document.getElementById("DLS_VW_comments").style.display = "none";
    } else {
        document.getElementById("DLS_comments_titles").style.display = "block";
        document.getElementById("DLS_VW_comments").style.display = "block";

        // Generate Comments.
        generate_comments(commento)
    }
}




function generate_comments(commento){
    // Add comments - by generating HTML.
    for (var i = 0; i < commento.length; i++) {
        var pk = commento[i].pk;
        var comment = commento[i].fields;
        var comment_ip = comment.user_ip

// row
        var DLS_VW_description = document.createElement('div');
        DLS_VW_description.setAttribute('class', 'DLS_VW_user_comment');
        DLS_VW_description.setAttribute('id', '');
        document.getElementById('DLS_VW_comments').appendChild(DLS_VW_description);

// column 01
        var DLS_VW_desc_column_01 = document.createElement('div');
        DLS_VW_desc_column_01.setAttribute('class', 'DLS_VW_user_comment_col_01');
        DLS_VW_description.appendChild(DLS_VW_desc_column_01);   
        DLS_VW_desc_column_01.innerHTML = '<i class="fa-regular fa-comment"></i>';

// column 02
        var DLS_VW_desc_column_02 = document.createElement('div');
        DLS_VW_desc_column_02.setAttribute('class', 'DLS_VW_user_comment_col_02');
        DLS_VW_description.appendChild(DLS_VW_desc_column_02);

// comment div
        var DLS_VW_comment = document.createElement('div');
        DLS_VW_comment.setAttribute('class', 'DLS_VW_usr_comment');
        DLS_VW_desc_column_02.appendChild(DLS_VW_comment);

// p tag
        var p_tag = document.createElement('p');

        p_tag.innerHTML = comment.comment;
        p_tag.setAttribute('class', 'comment');

        var parentContainer = document.getElementById('DLS_VW_usr_comment');
        DLS_VW_comment.appendChild(p_tag);

        // If user created comment, then highlight it and allow user to remove it.
        if (user_ip === comment_ip){
            p_tag.style.color = "rgb(205, 253, 255)";
            var comment_id = "toRemove_id_" + pk; // Generate ID based off user IP so comment can be removed by anon user.
            DLS_VW_description.setAttribute("id", comment_id)
            DLS_VW_desc_column_01.innerHTML = '<i onmouseover="delete_icon(this, true)" onmouseout="delete_icon(this, false)" onclick="delete_comment(this, ' + pk + ', ' + comment_id + ')" id="user_comment" class="fa-regular fa-user"></i>';
        }
    }
}




function delete_icon(icon, isHovering) {
    // Changes icon when mouse hovers over users comment.
    if (isHovering) {
        icon.classList.replace('fa-user', 'fa-x');
    } else {
        icon.classList.replace('fa-x', 'fa-user');
    }
}




function delete_comment(element, pk, comment_id){
    // Removes a users comment on selected.

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            // tmp hide it.
            comment_id.style.display = "none";
        }
    }
    xhttp.open("GET", "/ajax_remove_comment/?id=" + pk, true);
    xhttp.send();
}


