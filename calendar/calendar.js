const token = localStorage.getItem("token");

if(!token){
    alert("Please Login First");
    window.location.href = "../login.html";
}

const userId = localStorage.getItem("userId");

const API =
`http://localhost:3000/tasks?userId=${userId}`;

let currentDate = new Date();

async function renderCalendar(){

    const calendar =
    document.getElementById("calendar");

    const monthYear =
    document.getElementById("monthYear");

    calendar.innerHTML = "";

    const year =
    currentDate.getFullYear();

    const month =
    currentDate.getMonth();

    monthYear.innerText =
    currentDate.toLocaleString("default", {
        month:"long",
        year:"numeric"
    });

    const firstDay =
    new Date(year, month, 1).getDay();

    const daysInMonth =
    new Date(year, month + 1, 0).getDate();

    for(let i = 0; i < firstDay; i++){
        calendar.innerHTML += `
            <div class="empty"></div>
        `;
    }

    for(let day = 1; day <= daysInMonth; day++){

        calendar.innerHTML += `
            <div class="day" id="day-${day}">
                <div class="date">${day}</div>
            </div>
        `;

    }

    try{

        const response =
        await fetch(API,{
            headers:{
                Authorization: token
            }
        });

        const tasks =
        await response.json();

        console.log("CALENDAR TASKS:", tasks);

        tasks.forEach(task => {

            if(!task.dueDate){
                return;
            }

            const dateParts =
            task.dueDate.split("-");

            const taskYear =
            Number(dateParts[0]);

            const taskMonth =
            Number(dateParts[1]) - 1;

            const taskDay =
            Number(dateParts[2]);

            if(
                taskYear === year &&
                taskMonth === month
            ){

                const dayBox =
                document.getElementById(
                    `day-${taskDay}`
                );

                if(dayBox){

                    dayBox.innerHTML += `
                        <div class="event ${task.status}">
                            <strong>${task.taskName}</strong>
                            <br>
                            <small>${task.status}</small>
                        </div>
                    `;

                }
            }

        });

    }
    catch(error){
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("prevBtn").onclick =
    function(){
        currentDate.setMonth(
            currentDate.getMonth() - 1
        );
        renderCalendar();
    };

    document.getElementById("nextBtn").onclick =
    function(){
        currentDate.setMonth(
            currentDate.getMonth() + 1
        );
        renderCalendar();
    };

    renderCalendar();

});