const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");


if(!token || !userId){
    alert("Please Login First");
    window.location.href = "../login.html";
}


const API =
`http://localhost:3000/projects-with-task-count?userId=${userId}`;

/* Popup */

function openProjectModal(){

    clearForm();

    document.getElementById("modalTitle").innerText =
    "Create New Project";

    document.querySelector(".create-btn").innerText =
    "Save Project";

    document.getElementById("projectModal").style.display =
    "block";
}

function closeProjectModal(){

    document.getElementById("projectModal").style.display =
    "none";
}

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

        updateProjectStats(projects);

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

        filteredProjects.forEach((project,index) => {

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
                <td>${index + 1}</td>

                <td>
                    <b>${project.projectName}</b>
                </td>

                <td>
                    ${project.description || "-"}
                </td>

                <td>
                    <span class="status-${project.status}">
                        ${project.status}
                    </span>
                </td>

                <td>
                    ${project.startDate || "-"}
                </td>

                <td>
                    ${project.endDate || "-"}
                </td>

                <td>
                    ${project.taskCount || 0}
                </td>

                <td>
                   <button
class="view-btn"
onclick="viewProjectTasks('${project._id}')">
View
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
function viewProjectTasks(projectId){

    localStorage.setItem(
        "selectedProject",
        projectId
    );

    window.location.href =
    "../task/task.html";

}

/* Stats */

function updateProjectStats(projects){

    document.getElementById("totalProjectsCount").innerText =
    projects.length;

    document.getElementById("activeProjectsCount").innerText =
    projects.filter(project =>
        project.status === "Active"
    ).length;

    document.getElementById("planningProjectsCount").innerText =
    projects.filter(project =>
        project.status === "Planning"
    ).length;

    document.getElementById("completedProjectsCount").innerText =
    projects.filter(project =>
        project.status === "Completed"
    ).length;
}

/* Save Project */

async function saveProject(){

    const id =
    document.getElementById("projectId").value;

    const projectName =
    document.getElementById("projectName").value.trim();

    const description =
    document.getElementById("description").value.trim();

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

        closeProjectModal();
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

        if(!project){
            alert("Project not found");
            return;
        }

        document.getElementById("projectId").value =
        project._id;

        document.getElementById("projectName").value =
        project.projectName || "";

        document.getElementById("description").value =
        project.description || "";

        document.getElementById("startDate").value =
        project.startDate || "";

        document.getElementById("endDate").value =
        project.endDate || "";

        document.getElementById("status").value =
        project.status || "Active";

        document.getElementById("modalTitle").innerText =
        "Update Project";

        document.querySelector(".create-btn").innerText =
        "Update Project";

        document.getElementById("projectModal").style.display =
        "block";

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

/* Archive Project */

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

/* Unarchive Project */

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

/* View Tasks */

function viewTasks(projectId){

    localStorage.setItem(
        "selectedProject",
        projectId
    );

    window.location.href =
    "../task/task.html";
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

/* Close modal by clicking outside */

window.onclick = function(event){

    const modal =
    document.getElementById("projectModal");

    if(event.target === modal){
        closeProjectModal();
    }
};

loadProjects();