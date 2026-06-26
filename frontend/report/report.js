const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if(!token || !userId){
    alert("Please Login First");
    window.location.href = "../login.html";
}

async function loadReports(){

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

        document.getElementById("totalProjects").innerText =
        data.totalProjects || 0;

        document.getElementById("totalTasks").innerText =
        data.totalTasks || 0;

        document.getElementById("openTasks").innerText =
        data.openTasks || 0;

        document.getElementById("completedTasks").innerText =
        data.completedTasks || 0;

        document.getElementById("summaryOpen").innerText =
        data.openTasks || 0;

        document.getElementById("summaryCompleted").innerText =
        data.completedTasks || 0;

        document.getElementById("summaryOverdue").innerText =
        data.overdueTasks || 0;

        let percent = 0;

        if(data.totalTasks > 0){
            percent = Math.round(
                (data.completedTasks / data.totalTasks) * 100
            );
        }

        document.getElementById("completionBar").style.width =
        percent + "%";

        document.getElementById("completionText").innerText =
        percent + "% Completed";

    }
    catch(error){
        console.log(error);
    }
}

loadReports();