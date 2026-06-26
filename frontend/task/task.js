const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if(!token || !userId){
    alert("Please Login First");
    window.location.href = "../login.html";
}
const selectedProject =
localStorage.getItem("selectedProject");

let API =
`http://localhost:3000/tasks?userId=${userId}`;

if(selectedProject){

    API =
`http://localhost:3000/tasks?userId=${userId}&projectId=${selectedProject}`;

}

/* ==========================
   MODAL
========================== */

function openTaskModal(){

    clearForm();

    document.getElementById("modalTitle").innerText =
    "Create New Task";

    document.querySelector(".save-btn").innerText =
    "Save Task";

    document.getElementById("taskModal").style.display =
    "block";
}

function closeTaskModal(){

    document.getElementById("taskModal").style.display =
    "none";
}

/* ==========================
   LOAD PROJECTS
========================== */

async function loadProjects(){

    try{

        const response = await fetch(
            `http://localhost:3000/projects?userId=${userId}`,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        const projects = await response.json();

        let options =
        `<option value="">Select Project</option>`;

        projects.forEach(project => {

            options += `
                <option value="${project._id}">
                    ${project.projectName}
                </option>
            `;

        });

        document.getElementById("projectId").innerHTML =
        options;

    }
    catch(error){
        console.log(error);
    }
}

/* ==========================
   LOAD TASKS
========================== */

async function loadTasks(){

    try{

        const response = await fetch(API,{
            headers:{
                Authorization: token
            }
        });

        const tasks = await response.json();

        loadTaskStats(tasks);

        const filter =
        document.getElementById("taskFilter")
        ? document.getElementById("taskFilter").value
        : "All";

        let filteredTasks = tasks;

        if(filter !== "All"){
            filteredTasks =
            tasks.filter(task => task.status === filter);
        }

        const table =
        document.getElementById("taskTable");

        table.innerHTML = "";

        filteredTasks.forEach((task,index) => {

            const attachmentButton = `
                <button
                class="view-btn"
                onclick='viewAttachments(${JSON.stringify(task.attachments || [])})'>
                    View Files
                </button>
            `;

            table.innerHTML += `
            <tr>

                <td>${index + 1}</td>

                <td>
                    <b>${task.taskName || "-"}</b>
                </td>

                <td>
                    ${task.description || "-"}
                </td>

                <td>
                    ${task.assignedTo || "-"}
                </td>

                <td>
                    ${task.dueDate || "-"}
                </td>

                <td>
                    <span class="priority-badge">
                        ${task.priority || "Low"}
                    </span>
                </td>

                <td>
                    <span class="status-badge">
                        ${task.status || "Open"}
                    </span>
                </td>

                <td>
                    ${attachmentButton}
                </td>

                <td>
                    <button
                    class="edit-btn"
                    onclick="editTask('${task._id}')">
                        Edit
                    </button>

                    <button
                    class="delete-btn"
                    onclick="deleteTask('${task._id}')">
                        Delete
                    </button>

                    <button
                    class="comment-btn"
                    onclick="openCommentModal('${task._id}')">
                        💬 Comment
                    </button>

                    <button
                    class="attach-btn"
                    onclick="openAttachModal('${task._id}')">
                        📎 Attach
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

/* ==========================
   TASK STATS
========================== */

function loadTaskStats(tasks){

    const total = tasks.length;

    const open =
    tasks.filter(task => task.status === "Open").length;

    const progress =
    tasks.filter(task => task.status === "In Progress").length;

    const completed =
    tasks.filter(task => task.status === "Completed").length;

    document.getElementById("totalTasksCount").innerText = total;
    document.getElementById("openTasksCount").innerText = open;
    document.getElementById("progressTasksCount").innerText = progress;
    document.getElementById("completedTasksCount").innerText = completed;
}

/* ==========================
   SAVE TASK
========================== */

async function saveTask(){

    const id =
    document.getElementById("taskId").value;

    const projectId =
    document.getElementById("projectId").value;

    const taskName =
    document.getElementById("taskName").value.trim();

    if(projectId === ""){
        alert("Please Select Project");
        return;
    }

    if(taskName === ""){
        alert("Task Name Required");
        return;
    }

    const taskData = {
        projectId,
        userId,
        taskName,
        description: document.getElementById("description").value,
        assignedTo: document.getElementById("assignedTo").value,
        dueDate: document.getElementById("dueDate").value,
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value
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

        closeTaskModal();
        clearForm();
        loadTasks();

    }
    catch(error){
        console.log(error);
    }
}

/* ==========================
   EDIT TASK
========================== */

async function editTask(id){

    try{

        const response = await fetch(API,{
            headers:{
                Authorization: token
            }
        });

        const tasks = await response.json();

        const task =
        tasks.find(item => item._id === id);

        if(!task){
            alert("Task Not Found");
            return;
        }

        document.getElementById("taskId").value =
        task._id;

        document.getElementById("projectId").value =
        task.projectId || "";

        document.getElementById("taskName").value =
        task.taskName || "";

        document.getElementById("description").value =
        task.description || "";

        document.getElementById("assignedTo").value =
        task.assignedTo || "";

        document.getElementById("dueDate").value =
        task.dueDate || "";

        document.getElementById("priority").value =
        task.priority || "Low";

        document.getElementById("status").value =
        task.status || "Open";

        document.getElementById("modalTitle").innerText =
        "Update Task";

        document.querySelector(".save-btn").innerText =
        "Update Task";

        document.getElementById("taskModal").style.display =
        "block";

    }
    catch(error){
        console.log(error);
    }
}

/* ==========================
   DELETE TASK
========================== */

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

/* ==========================
   SEARCH TASK
========================== */

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

/* ==========================
   CLEAR FORM
========================== */

function clearForm(){

    document.getElementById("taskId").value = "";
    document.getElementById("projectId").value = "";
    document.getElementById("taskName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("assignedTo").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("priority").value = "Low";
    document.getElementById("status").value = "Open";

    if(document.getElementById("taskFile")){
        document.getElementById("taskFile").value = "";
    }

    if(document.getElementById("commentText")){
        document.getElementById("commentText").value = "";
    }
}

/* ==========================
   COMMENTS
========================== */

async function openCommentModal(taskId){

    document.getElementById("commentTaskId").value =
    taskId;

    document.getElementById("commentModal").style.display =
    "block";

    loadComments(taskId);
}

function closeCommentModal(){

    document.getElementById("commentModal").style.display =
    "none";

    document.getElementById("commentText").value = "";
}

async function loadComments(taskId){

    try{

        const response = await fetch(
            `http://localhost:3000/comments/${taskId}`,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        const comments = await response.json();

        let html = "";

        comments.forEach(item => {

            html += `
            <div class="comment-item">
                <p>${item.comment}</p>
                <small>${new Date(item.createdAt).toLocaleString()}</small>
            </div>
            `;

        });

        document.getElementById("commentsList").innerHTML =
        html || "<p>No comments yet</p>";

    }
    catch(error){
        console.log(error);
    }
}

async function addComment(){

    const taskId =
    document.getElementById("commentTaskId").value;

    const comment =
    document.getElementById("commentText").value.trim();

    if(comment === ""){
        alert("Please write comment");
        return;
    }

    try{

        await fetch(
            "http://localhost:3000/comments",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization: token
                },
                body:JSON.stringify({
                    taskId,
                    userId,
                    comment
                })
            }
        );

        document.getElementById("commentText").value = "";

        loadComments(taskId);

        alert("Comment Added");

    }
    catch(error){
        console.log(error);
    }
}

/* ==========================
   ATTACHMENTS
========================== */

function openAttachModal(taskId){

    document.getElementById("attachTaskId").value =
    taskId;

    document.getElementById("attachModal").style.display =
    "block";
}

function closeAttachModal(){

    document.getElementById("attachModal").style.display =
    "none";

    document.getElementById("taskFile").value = "";
}

async function uploadAttachment(){

    const taskId =
    document.getElementById("attachTaskId").value;

    const file =
    document.getElementById("taskFile").files[0];

    if(!file){
        alert("Please select a file");
        return;
    }

    const formData =
    new FormData();

    formData.append("file", file);

    try{

        const response = await fetch(
            `http://localhost:3000/tasks/${taskId}/attachments`,
            {
                method:"POST",
                headers:{
                    Authorization: token
                },
                body:formData
            }
        );

        const data = await response.json();

        if(!response.ok){
            alert(data.message || "File upload failed");
            return;
        }

        alert("File Uploaded Successfully");

        closeAttachModal();

        loadTasks();

    }
    catch(error){
        console.log(error);
        alert("File upload failed");
    }
}

/* ==========================
   VIEW ATTACHMENTS
========================== */

function viewAttachments(files){

    const container =
    document.getElementById("attachmentList");

    container.innerHTML = "";

    if(!files || files.length === 0){

        container.innerHTML =
        "<p>No files uploaded.</p>";

    }
    else{

        files.forEach(file => {

            container.innerHTML += `
                <div class="attachment-item">

                    <span>
                        📎 ${file.fileName}
                    </span>

                    <a
                    href="http://localhost:3000/uploads/${file.filePath}"
                    target="_blank">
                        Open
                    </a>

                </div>
            `;

        });

    }

    document.getElementById("attachmentViewer").style.display =
    "block";
}

function closeAttachmentViewer(){

    document.getElementById("attachmentViewer").style.display =
    "none";
}

/* ==========================
   CLOSE MODALS OUTSIDE CLICK
========================== */

window.onclick = function(event){

    const taskModal =
    document.getElementById("taskModal");

    const commentModal =
    document.getElementById("commentModal");

    const attachModal =
    document.getElementById("attachModal");

    const attachmentViewer =
    document.getElementById("attachmentViewer");

    if(event.target === taskModal){
        closeTaskModal();
    }

    if(event.target === commentModal){
        closeCommentModal();
    }

    if(event.target === attachModal){
        closeAttachModal();
    }

    if(event.target === attachmentViewer){
        closeAttachmentViewer();
    }
};

/* ==========================
   LOAD PAGE
========================== */

loadProjects();
loadTasks();