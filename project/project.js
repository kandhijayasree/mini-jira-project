const token = localStorage.getItem("token");

if(!token){
    alert("Please Login First");
    window.location.href = "../login.html";
}

const userId = localStorage.getItem("userId");

const API =
`http://localhost:3000/projects-with-task-count?userId=${userId}`;
/* Load Projects */
/* Load Projects */

async function loadProjects(){

    try{

        const response =
        await fetch(API,{
            headers:{
                Authorization: token
            }
        });

        const projects =
        await response.json();

        console.log("PROJECTS:", projects);

        const filter =
        document.getElementById("projectFilter").value;

        let filteredProjects = projects;

        if(filter !== "All"){
            filteredProjects =
            projects.filter(project =>
                project.status === filter
            );
        }

        const table =
        document.getElementById("projectTable");

        table.innerHTML = "";

        filteredProjects.forEach(project => {

            let archiveButton = "";

            if(project.status === "Archived"){

                archiveButton = `
                    <button class="unarchive-btn"
                    onclick="unarchiveProject('${project._id}')">
                        Unarchive
                    </button>
                `;

            }
            else{

                archiveButton = `
                    <button class="archive-btn"
                    onclick="archiveProject('${project._id}')">
                        Archive
                    </button>
                `;

            }

            table.innerHTML += `
            <tr>
                <td>${project.projectName}</td>
                <td>${project.description}</td>
                <td>${project.startDate}</td>
                <td>${project.endDate}</td>
                <td>${project.status}</td>
                <td>${project.taskCount}</td>

                <td>
                    <button class="view-btn"
                    onclick="viewTasks('${project._id}')">
                        View Tasks
                    </button>

                    <button class="edit-btn"
                    onclick="editProject('${project._id}')">
                        Edit
                    </button>

                    ${archiveButton}

                    <button class="delete-btn"
                    onclick="deleteProject('${project._id}')">
                        Delete
                    </button>
                </td>
            </tr>
            `;

        });

    }
    catch(error){
        console.log(error);
    }
}

/* Save Project */

async function saveProject(){
     console.log("Save Project clicked");

    const id =
    document.getElementById("projectId").value;

    const projectName =
    document.getElementById("projectName").value;

    const description =
    document.getElementById("description").value;

    const startDate =
    document.getElementById("startDate").value;

    const endDate =
    document.getElementById("endDate").value;

    const status =
    document.getElementById("status").value;

    if(projectName === ""){
        alert("Project Name Required");
        return;
    }

    const projectData = {
        userId,
        projectName,
        description,
        startDate,
        endDate,
        status
    };

    try{

        if(id){

            await fetch(
                `http://localhost:3000/projects/${id}`,
                {
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: token
                    },
                    body:JSON.stringify(projectData)
                }
            );

            alert("Project Updated");

        }
        else{

            await fetch(
                "http://localhost:3000/projects",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: token
                    },
                    body:JSON.stringify(projectData)
                }
            );

            alert("Project Added");
        }

        clearForm();
        loadProjects();

    }
    catch(error){
        console.log(error);
    }
}

/* Edit Project */

async function editProject(id){

    try{

        const response =
        await fetch(API,{
            headers:{
                Authorization: token
            }
        });

        const projects =
        await response.json();

        const project =
        projects.find(item => item._id === id);

        document.getElementById("projectId").value =
        project._id;

        document.getElementById("projectName").value =
        project.projectName;

        document.getElementById("description").value =
        project.description;

        document.getElementById("startDate").value =
        project.startDate;

        document.getElementById("endDate").value =
        project.endDate;

        document.getElementById("status").value =
        project.status;

    }
    catch(error){
        console.log(error);
    }
}

/* Delete Project */

async function deleteProject(id){

    const answer =
    confirm("Delete Project?");

    if(!answer){
        return;
    }

    try{

        await fetch(
            `http://localhost:3000/projects/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization: token
                }
            }
        );

        loadProjects();

    }
    catch(error){
        console.log(error);
    }
}
async function archiveProject(id){

    const answer =
    confirm("Archive Project?");

    if(!answer){
        return;
    }

    try{

        await fetch(
            `http://localhost:3000/projects/${id}`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    Authorization: token
                },
                body:JSON.stringify({
                    status:"Archived"
                })
            }
        );

        alert("Project Archived");

        loadProjects();

    }
    catch(error){

        console.log(error);

    }
}
async function unarchiveProject(id){

    const answer =
    confirm("Unarchive Project?");

    if(!answer){
        return;
    }

    try{

        await fetch(
            `http://localhost:3000/projects/${id}`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    Authorization: token
                },
                body:JSON.stringify({
                    status:"Active"
                })
            }
        );

        alert("Project Unarchived");

        loadProjects();

    }
    catch(error){

        console.log(error);

    }
}

/* Search Project */

function searchProject(){

    const input =
    document.getElementById("searchProject")
    .value.toLowerCase();

    const rows =
    document.querySelectorAll("#projectTable tr");

    rows.forEach(row => {

        const text =
        row.innerText.toLowerCase();

        row.style.display =
        text.includes(input) ? "" : "none";

    });
}

/* Clear Form */

function clearForm(){

    document.getElementById("projectId").value = "";
    document.getElementById("projectName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    document.getElementById("status").value = "Active";
}

loadProjects();