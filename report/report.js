const token = localStorage.getItem("token");

if(!token){
    alert("Please Login First");
    window.location.href = "../login.html";
}

const userId = localStorage.getItem("userId");

const TASK_API =
`http://localhost:3000/tasks?userId=${userId}`;

const PROJECT_API =
`http://localhost:3000/projects?userId=${userId}`;

async function loadReports(){

    try{

        const taskResponse = await fetch(TASK_API,{
            headers:{
                Authorization: token
            }
        });

        const tasks =
        await taskResponse.json();

        const projectResponse = await fetch(PROJECT_API,{
            headers:{
                Authorization: token
            }
        });

        const projects =
        await projectResponse.json();

        const totalProjects =
        projects.length;

        const totalTasks =
        tasks.length;

        const openTasks =
        tasks.filter(t => t.status === "Open").length;

        const completedTasks =
        tasks.filter(t => t.status === "Completed").length;

        document.getElementById("totalProjects").innerText =
        totalProjects;

        document.getElementById("totalTasks").innerText =
        totalTasks;

        document.getElementById("openTasks").innerText =
        openTasks;

        document.getElementById("completedTasks").innerText =
        completedTasks;

        let percentage = 0;

        if(totalTasks > 0){
            percentage =
            Math.round(
                (completedTasks / totalTasks) * 100
            );
        }

        document.getElementById("progressFill").style.width =
        percentage + "%";

        document.getElementById("progressText").innerText =
        percentage + "% Completed";

    }
    catch(error){
        console.log(error);
    }
}

loadReports();