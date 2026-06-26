const token = localStorage.getItem("token");

if(!token){
    alert("Please Login First");
    window.location.href = "login.html";
}

const userId = localStorage.getItem("userId");
console.log("USER ID:", userId);
console.log("TOKEN:", token);
const userName = localStorage.getItem("userName");

document.getElementById("welcome").innerText =
"Welcome, " + (userName && userName !== "undefined" ? userName : "User");

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

if(!response.ok){
    alert(data.message);
    return;
}
        document.getElementById("totalProjects").innerText =
        data.totalProjects;

        document.getElementById("totalTasks").innerText = data.totalTasks;

        document.getElementById("openTasks").innerText =
        data.openTasks;
        document.getElementById("progressTasks").innerText =
data.progressTasks;

        document.getElementById("completedTasks").innerText =
        data.completedTasks;

        document.getElementById("overdueTasks").innerText =
        data.overdueTasks;

    }
    catch(error){
        console.log(error);
    }
}

async function loadChart(){

    try{

        const response = await fetch(
            `http://localhost:3000/tasks?userId=${userId}`,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        const tasks = await response.json();

        const open =
        tasks.filter(t => t.status === "Open").length;

        const progress =
        tasks.filter(t => t.status === "In Progress").length;

        const completed =
        tasks.filter(t => t.status === "Completed").length;

        const overdue =
        tasks.filter(t => t.status === "Overdue").length;

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
                        open,
                        progress,
                        completed,
                        overdue
                    ]
                }]
            }
        });

    }
    catch(error){
        console.log(error);
    }
}

loadDashboard();
loadChart();