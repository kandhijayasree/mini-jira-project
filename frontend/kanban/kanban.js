const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if(!token || !userId){
    alert("Please Login First");
    window.location.href = "../login.html";
}



const API =
`http://localhost:3000/tasks?userId=${userId}`;

let allTasks = [];

/* Load Kanban */

async function loadKanban(){

    try{

        const response =
        await fetch(API,{
            headers:{
                Authorization: token
            }
        });

        allTasks =
        await response.json();

        displayKanban(allTasks);

    }
    catch(error){
        console.log(error);
    }
}

/* Display Kanban */

function displayKanban(tasks){

    document.getElementById("openTasks").innerHTML = "";
    document.getElementById("progressTasks").innerHTML = "";
    document.getElementById("completedTasks").innerHTML = "";

    const openTasks =
    tasks.filter(task => task.status === "Open");

    const progressTasks =
    tasks.filter(task => task.status === "In Progress");

    const completedTasks =
    tasks.filter(task => task.status === "Completed");

    document.getElementById("openCount").innerText =
    openTasks.length;

    document.getElementById("progressCount").innerText =
    progressTasks.length;

    document.getElementById("completedCount").innerText =
    completedTasks.length;

    openTasks.forEach(task => {
        document.getElementById("openTasks").innerHTML +=
        createTaskCard(task,"open-card");
    });

    progressTasks.forEach(task => {
        document.getElementById("progressTasks").innerHTML +=
        createTaskCard(task,"progress-card");
    });

    completedTasks.forEach(task => {
        document.getElementById("completedTasks").innerHTML +=
        createTaskCard(task,"completed-card");
    });
}

/* Create Card */

function createTaskCard(task, cardClass){

    let priorityClass = "low";

    if(task.priority === "Medium"){
        priorityClass = "medium";
    }

    if(task.priority === "High"){
        priorityClass = "high";
    }

    return `
    <div class="task-card ${cardClass}">
        <h3>${task.taskName}</h3>

        <p>${task.description || "No description"}</p>

        <p>
            <b>Assigned:</b>
            ${task.assignedTo || "-"}
        </p>

        <p>
            <b>Due:</b>
            ${task.dueDate || "-"}
        </p>

        <span class="priority ${priorityClass}">
            ${task.priority}
        </span>
    </div>
    `;
}

/* Search Kanban */

function searchKanban(){

    const input =
    document.getElementById("searchKanban")
    .value.toLowerCase();

    const filtered =
    allTasks.filter(task =>
        task.taskName.toLowerCase().includes(input) ||
        task.description.toLowerCase().includes(input) ||
        task.assignedTo.toLowerCase().includes(input)
    );

    displayKanban(filtered);
}

loadKanban();