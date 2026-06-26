const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if(!token || !userId){
    alert("Please Login First");
    window.location.href = "../login.html";
}


let currentDate = new Date();
let allTasks = [];

const API =
`http://localhost:3000/tasks?userId=${userId}`;

/* Load Tasks */

async function loadCalendarTasks(){

    try{

        const response =
        await fetch(API,{
            headers:{
                Authorization: token
            }
        });

        allTasks =
        await response.json();

        updateStats(allTasks);
        renderCalendar(allTasks);

    }
    catch(error){
        console.log(error);
    }
}


/* Render Calendar */

function renderCalendar(tasks){

    const calendarGrid =
    document.getElementById("calendarGrid");

    const monthYear =
    document.getElementById("monthYear");

    calendarGrid.innerHTML = "";

    const year =
    currentDate.getFullYear();

    const month =
    currentDate.getMonth();

    const monthNames = [
        "January","February","March","April",
        "May","June","July","August",
        "September","October","November","December"
    ];

    monthYear.innerText =
    `${monthNames[month]} ${year}`;

    const firstDay =
    new Date(year, month, 1).getDay();

    const totalDays =
    new Date(year, month + 1, 0).getDate();

    for(let i = 0; i < firstDay; i++){

        calendarGrid.innerHTML +=
        `<div class="day empty"></div>`;

    }

    for(let day = 1; day <= totalDays; day++){

        const dateString =
        `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        const dayTasks =
        tasks.filter(task =>
            task.dueDate === dateString
        );

        let taskHTML = "";

        dayTasks.forEach(task => {

            taskHTML += `
            <div class="task-item">
                ${task.taskName}
                <span>${task.status}</span>
            </div>
            `;

        });

        calendarGrid.innerHTML += `
        <div class="day">
            <div class="day-number">${day}</div>
            ${taskHTML}
        </div>
        `;

    }
}

/* Previous Month */

function previousMonth(){

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    renderCalendar(allTasks);
}

/* Next Month */

function nextMonth(){

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    renderCalendar(allTasks);
}

/* Search */

function searchCalendarTasks(){

    const input =
    document.getElementById("searchCalendar")
    .value.toLowerCase();

    const filtered =
    allTasks.filter(task =>
        task.taskName.toLowerCase().includes(input) ||
        task.description.toLowerCase().includes(input) ||
        task.status.toLowerCase().includes(input)
    );

    renderCalendar(filtered);
}

loadCalendarTasks();