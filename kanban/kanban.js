const token =
localStorage.getItem("token");

if(!token){

    alert("Please Login First");

    window.location.href =
    "../login.html";

}

const userId =
localStorage.getItem("userId");

const API =
`http://localhost:3000/tasks?userId=${userId}`;

async function loadKanban(){

    try{

        console.log("KANBAN USER:", userId);
        console.log("KANBAN API:", API);

        const response =
        await fetch(
            API,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        const tasks =
        await response.json();

        console.log("KANBAN TASKS:", tasks);

        document.getElementById(
            "openTasks"
        ).innerHTML = "";

        document.getElementById(
            "progressTasks"
        ).innerHTML = "";

        document.getElementById(
            "completedTasks"
        ).innerHTML = "";

        tasks.forEach(task => {

            let priorityClass = "";

            if(task.priority === "Low"){

                priorityClass = "low";

            }
            else if(task.priority === "Medium"){

                priorityClass = "medium";

            }
            else{

                priorityClass = "high";

            }

            const card = `

                <div class="task-card">

                    <div class="task-title">
                        ${task.taskName}
                    </div>

                    <div class="task-desc">
                        ${task.description}
                    </div>

                    <p>
                        Assigned: ${task.assignedTo}
                    </p>

                    <p>
                        Due: ${task.dueDate}
                    </p>

                    <span class="priority ${priorityClass}">
                        ${task.priority}
                    </span>

                </div>

            `;

            if(task.status === "Open"){

                document.getElementById(
                    "openTasks"
                ).innerHTML += card;

            }
            else if(task.status === "In Progress"){

                document.getElementById(
                    "progressTasks"
                ).innerHTML += card;

            }
            else if(task.status === "Completed"){

                document.getElementById(
                    "completedTasks"
                ).innerHTML += card;

            }

        });

    }
    catch(error){

        console.log(error);

    }

}

loadKanban();