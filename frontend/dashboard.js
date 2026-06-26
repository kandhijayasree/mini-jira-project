const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");

if(!token || !userId){
    alert("Please Login First");
    window.location.href = "login.html";
}

document.getElementById("welcome").innerText =
"Welcome, " + (userName || "User") + " 👋";

async function loadDashboard(){

    try{

        const response = await fetch(
            `http://localhost:3000/dashboard/${userId}`,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        const data = await response.json();

        console.log("DASHBOARD DATA:", data);

        document.getElementById("totalProjects").innerText =
        data.totalProjects || 0;

        document.getElementById("totalTasks").innerText =
        data.totalTasks || 0;

        document.getElementById("openTasks").innerText =
        data.openTasks || 0;

        document.getElementById("progressTasks").innerText =
        data.progressTasks || 0;

        document.getElementById("completedTasks").innerText =
        data.completedTasks || 0;

        document.getElementById("overdueTasks").innerText =
        data.overdueTasks || 0;

        document.getElementById("donutTotal").innerText =
        data.totalTasks || 0;

        document.getElementById("legendOpen").innerText =
        data.openTasks || 0;

        document.getElementById("legendProgress").innerText =
        data.progressTasks || 0;

        document.getElementById("legendCompleted").innerText =
        data.completedTasks || 0;

        document.getElementById("legendOverdue").innerText =
        data.overdueTasks || 0;

        loadChart(data);

    }
    catch(error){
        console.log(error);
    }
}

function loadChart(data){

    const ctx =
    document.getElementById("taskChart");

    new Chart(ctx,{
        type:"bar",
        data:{
            labels:[
                "Open",
                "In Progress",
                "Completed",
                "Overdue"
            ],
            datasets:[{
                label:"Tasks",
                data:[
                    data.openTasks || 0,
                    data.progressTasks || 0,
                    data.completedTasks || 0,
                    data.overdueTasks || 0
                ]
            }]
        }
    });
}

loadDashboard();
async function loadRecentProjects() {

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {

        const response = await fetch(
            `http://localhost:3000/projects?userId=${userId}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const projects = await response.json();

        const container =
        document.getElementById("recentProjects");

        container.innerHTML = "";

        projects.slice(0, 2).forEach(project => {

            container.innerHTML += `
                <div class="recent-item">

                    <div>
                        <h4>${project.projectName}</h4>
                        <p>${project.description}</p>
                    </div>

                    <span class="status">
                        ${project.status}
                    </span>

                </div>
            `;
        });

    } catch (error) {
        console.log(error);
    }
}
async function loadUpcomingTasks() {

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {

        const response = await fetch(
            `http://localhost:3000/tasks?userId=${userId}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const tasks = await response.json();

        tasks.sort(
            (a, b) =>
            new Date(a.dueDate) -
            new Date(b.dueDate)
        );

        const container =
        document.getElementById("upcomingTasks");

        container.innerHTML = "";

        tasks.slice(0, 2).forEach(task => {

            container.innerHTML += `
                <div class="recent-item">

                    <div>
                        <h4>${task.taskName}</h4>
                        <p>${task.description}</p>
                    </div>

                    <span class="status">
                        ${task.dueDate}
                    </span>

                </div>
            `;
        });

    } catch (error) {
        console.log(error);
    }
}
function toggleNotifications(){

    const panel =
    document.getElementById("notificationPanel");

    panel.style.display =
    panel.style.display === "block" ? "none" : "block";
}

async function loadNotifications(){

    try{

        const response = await fetch(
            `http://localhost:3000/notifications/${userId}`,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        const notifications = await response.json();

        const unread =
        notifications.filter(item => item.isRead === false);

        document.getElementById("notificationCount").innerText =
        unread.length;

        let html = "";

        notifications.slice(0,5).forEach(item => {

            html += `
            <div class="notification-item">
                <p>${item.message}</p>
                <small>${new Date(item.createdAt).toLocaleString()}</small>
            </div>
            `;

        });

        document.getElementById("notificationList").innerHTML =
        html || "<p>No notifications</p>";

    }
    catch(error){
        console.log(error);
    }
}

loadNotifications();
loadDashboard();
loadRecentProjects();
loadUpcomingTasks();