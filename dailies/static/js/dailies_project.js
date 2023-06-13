function select_project(element, selected_project){
    // Changes the project nav to show which project is selected.

    hideRowsByProjectId(selected_project) 

    project_element = document.getElementsByClassName("DLS_PR_proj");
    arrow_element = document.getElementsByClassName("DLS_PR_proj_arrow");
        for (var i = 0; i < project_element.length; i++) {
            project_element[i].style.backgroundColor = "rgb(10, 10, 10)";
            project_element[i].style.borderBottom = "none";
            arrow_element[i].style.display = "none";

    }
    element.style.borderBottom = "1px solid grey";
    element.style.backgroundColor = "rgb(20, 20, 20)";
    element.querySelector("span").style.display = "block";
}



function hideRowsByProjectId(selected_project) {
    // Hides rows to show only captures for the specific selected project.

    var table = document.querySelector('.DLS_PR_table table');
    var rows = table.getElementsByTagName('tr');

    if (selected_project === "overview"){
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.id !== "DLS_PR_table_title"){
                row.style.display = '';
            }
        }

    } else {

        // Unhide all first.
        for (var i = 0; i < rows.length; i++) {
            rows[i].style.display = '';
        }

        // Then hide the ones thats not part of selected project.
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.id !== selected_project) {
                if (row.id !== "DLS_PR_table_title"){
                    row.style.display = 'none';
                }
            }
        }
    }
}





function return_project_list(selected_project){

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);

            // var selectedFile = JSON.parse(data.captures)[0].fields;
            // var studio = JSON.parse(data.studio)[0].fields;
            // var commento = JSON.parse(data.comments);
                console.log("Completed selection")
            }
        }

    xhttp.open("GET", "/ajax_return_project/?selected_project=" + selected_project, true);
    xhttp.send();
}

