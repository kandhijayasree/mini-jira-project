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
"http://localhost:3000";

if(!userId){

    alert("Please login first");

    window.location.href =
    "../login.html";

}

/* Load Profile */

async function loadProfile(){

    try{

        const response =
        await fetch(
            `${API}/users/${userId}`
        );

        const user =
        await response.json();

        document.getElementById("userName").innerText =
        user.name || "User";

        document.getElementById("userEmail").innerText =
        user.email || "No Email";

        document.getElementById("name").value =
        user.name || "";

        document.getElementById("email").value =
        user.email || "";

    }
    catch(error){

        console.log(error);

    }

}

/* Update Profile */

async function updateProfile(){

    const name =
    document.getElementById("name").value;


    try{

        const response =
        await fetch(
            `${API}/users/${userId}`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
    name
})
            }
        );

        const data =
        await response.json();

        if(data.success){

            localStorage.setItem(
                "userName",
                data.user.name
            );

    

            alert(
                "Profile Updated Successfully"
            );

            loadProfile();

        }
        else{

            alert(data.message);

        }

    }
    catch(error){

    console.log("PROFILE ERROR:", error);

    alert(error);

}
}

/* Change Password */

async function changePassword(){

    const oldPassword =
    document.getElementById("oldPassword").value;

    const newPassword =
    document.getElementById("newPassword").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

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
                    "Content-Type":"application/json"
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

        console.log(error);

        alert("Password change failed");

    }

}
async function loadStats(){

    try{

        const response =
        await fetch(
            `http://localhost:3000/dashboard/${userId}`,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        const data =
        await response.json();

        document.getElementById("totalProjects").innerText =
        data.totalProjects;

        document.getElementById("totalTasks").innerText =
        data.totalTasks;

        document.getElementById("accountProjects").innerText =
        data.totalProjects;

        document.getElementById("accountTasks").innerText =
        data.totalTasks;

    }
    catch(error){
        console.log(error);
    }
}
loadProfile();
loadStats();