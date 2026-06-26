const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

const API = "http://localhost:3000";

if(!token || !userId){

    alert("Please Login First");

    window.location.href =
    "../login.html";

}

/* ==========================
   LOAD PROFILE
========================== */

async function loadProfile(){

    try{

        const response =
        await fetch(
            `${API}/users/${userId}`,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        const user =
        await response.json();

        if(!response.ok){
            alert(user.message);
            return;
        }

        document.getElementById("userName").innerText =
        user.name || "User";

        document.getElementById("userEmail").innerText =
        user.email || "No Email";

        document.getElementById("name").value =
        user.name || "";

        document.getElementById("email").value =
        user.email || "";

        localStorage.setItem("userName", user.name || "User");
        localStorage.setItem("userEmail", user.email || "");

    }
    catch(error){

        console.log("PROFILE LOAD ERROR:", error);

    }

}

/* ==========================
   UPDATE PROFILE
========================== */

async function updateProfile(){

    const name =
    document.getElementById("name").value.trim();

    if(name === ""){
        alert("Name is required");
        return;
    }

    try{

        const response =
        await fetch(
            `${API}/users/${userId}`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    Authorization: token
                },
                body:JSON.stringify({
                    name
                })
            }
        );

        const data =
        await response.json();

        if(!response.ok){
            alert(data.message);
            return;
        }

        localStorage.setItem(
            "userName",
            data.user.name
        );

        alert("Profile Updated Successfully");

        loadProfile();

    }
    catch(error){

        console.log("PROFILE UPDATE ERROR:", error);

        alert("Profile update failed");

    }

}

/* ==========================
   CHANGE PASSWORD
========================== */

async function changePassword(){

    const oldPassword =
    document.getElementById("oldPassword").value;

    const newPassword =
    document.getElementById("newPassword").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    if(oldPassword === ""){
        alert("Current Password Required");
        return;
    }

    if(newPassword === ""){
        alert("New Password Required");
        return;
    }

    if(newPassword !== confirmPassword){

        alert("Passwords do not match");
        return;

    }

    try{

        const email =
        localStorage.getItem("userEmail");

        const response =
        await fetch(
            `${API}/forgot-password`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    Authorization: token
                },
                body:JSON.stringify({
                    email,
                    newPassword
                })
            }
        );

        const data =
        await response.json();

        alert(data.message);

        document.getElementById("oldPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";

    }
    catch(error){

        console.log("PASSWORD ERROR:", error);

        alert("Password change failed");

    }

}

/* ==========================
   LOAD STATS
========================== */

async function loadStats(){

    try{

        const response =
        await fetch(
            `${API}/dashboard/${userId}`,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        const data =
        await response.json();

        if(!response.ok){
            alert(data.message);
            return;
        }

        document.getElementById("profileProjects").innerText =
        data.totalProjects || 0;

        document.getElementById("profileTasks").innerText =
        data.totalTasks || 0;

        if(document.getElementById("accountProjects")){
            document.getElementById("accountProjects").innerText =
            data.totalProjects || 0;
        }

        if(document.getElementById("accountTasks")){
            document.getElementById("accountTasks").innerText =
            data.totalTasks || 0;
        }

    }
    catch(error){

        console.log("STATS ERROR:", error);

    }

}

/* ==========================
   LOAD PAGE
========================== */

loadProfile();
loadStats();