async function loadProjects() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const response = await fetch(
        `http://localhost:3000/projects?userId=${userId}`,
        {
            headers: {
                Authorization: token
            }
        }
    );

    const projects = await response.json();

    console.log("TASK PAGE PROJECTS:", projects);

    let options = `<option value="">Select Project</option>`;

    projects.forEach(project => {
        options += `
            <option value="${project._id}">
                ${project.projectName}
            </option>
        `;
    });

    document.getElementById("projectId").innerHTML = options;
}

loadProjects();

const token = localStorage.getItem("token");

if(!token){
    alert("Please Login First");
    window.location.href = "../login.html";
}

const userId = localStorage.getItem("userId");

const selectedProject =
localStorage.getItem("selectedProject");

let API =
`http://localhost:3000/tasks?userId=${userId}`;

if(selectedProject){
    API =
    `http://localhost:3000/tasks?userId=${userId}&projectId=${selectedProject}`;
}
/* Load Tasks */

async function loadTasks(){

    try{

        const response =
        await fetch(API,{
            headers:{
                Authorization: token
            }
        });

        const tasks =
        await response.json();

        const table =
        document.getElementById("taskTable");

        table.innerHTML = "";

        tasks.forEach(task => {

            table.innerHTML += `
            <tr>
                <td>${task.taskName}</td>
                <td>${task.description}</td>
                <td>${task.assignedTo}</td>
                <td>${task.dueDate}</td>
                <td>${task.priority}</td>
                <td>${task.status}</td>
                <td>
                    <button class="edit-btn" onclick="editTask('${task._id}')">
                        Edit
                    </button>

                    <button class="delete-btn" onclick="deleteTask('${task._id}')">
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

/* Save Task */

async function saveTask(){

    const id =
    document.getElementById("taskId").value;

    const taskName =
    document.getElementById("taskName").value;

    const description =
    document.getElementById("description").value;

    const assignedTo =
    document.getElementById("assignedTo").value;

    const dueDate =
    document.getElementById("dueDate").value;

    const priority =
    document.getElementById("priority").value;

    const status =
    document.getElementById("status").value;

    if(taskName === ""){
        alert("Task Name Required");
        return;
    }

    const taskData = {

    projectId:
    document.getElementById("projectId").value,

      userId,

    taskName:
    document.getElementById("taskName").value,

    description:
    document.getElementById("description").value,

    assignedTo:
    document.getElementById("assignedTo").value,

    dueDate:
    document.getElementById("dueDate").value,

    priority:
    document.getElementById("priority").value,

    status:
    document.getElementById("status").value
};

    try{

        if(id){

            await fetch(
                `http://localhost:3000/tasks/${id}`,
                {
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: token
                    },
                    body:JSON.stringify(taskData)
                }
            );

            alert("Task Updated");

        }
        else{

            await fetch(
                "http://localhost:3000/tasks",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: token
                    },
                    body:JSON.stringify(taskData)
                }
            );

            alert("Task Added");
        }

        clearForm();
        loadTasks();

    }
    catch(error){
        console.log(error);
    }
}

/* Edit Task */

async function editTask(id){

    try{

        const response =
        await fetch(API,{
            headers:{
                Authorization: token
            }
        });

        const tasks =
        await response.json();

        const task =
        tasks.find(item => item._id === id);

        document.getElementById("taskId").value =
        task._id;

        document.getElementById("taskName").value =
        task.taskName;

        document.getElementById("description").value =
        task.description;

        document.getElementById("assignedTo").value =
        task.assignedTo;

        document.getElementById("dueDate").value =
        task.dueDate;

        document.getElementById("priority").value =
        task.priority;

        document.getElementById("status").value =
        task.status;

    }
    catch(error){
        console.log(error);
    }
}

/* Delete Task */

async function deleteTask(id){

    const answer =
    confirm("Delete Task?");

    if(!answer){
        return;
    }

    try{

        await fetch(
            `http://localhost:3000/tasks/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization: token
                }
            }
        );

        loadTasks();

    }
    catch(error){
        console.log(error);
    }
}

/* Search Task */

function searchTask(){

    const input =
    document.getElementById("searchTask")
    .value.toLowerCase();

    const rows =
    document.querySelectorAll("#taskTable tr");

    rows.forEach(row => {

        const text =
        row.innerText.toLowerCase();

        row.style.display =
        text.includes(input) ? "" : "none";

    });
}

/* Clear Form */

function clearForm(){

    document.getElementById("taskId").value = "";
    document.getElementById("taskName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("assignedTo").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("priority").value = "Low";
    document.getElementById("status").value = "Open";
}

loadTasks();