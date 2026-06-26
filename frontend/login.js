const API = "http://localhost:3000";

/* Login */

async function login(){

    const email =
    document.getElementById("email").value.trim();

    const password =
    document.getElementById("password").value.trim();

    if(email === "" || password === ""){

        alert("Please fill all fields");
        return;

    }

    try{

        const response =
        await fetch(`${API}/login`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })

        });

        const data =
        await response.json();

        if(response.ok){

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "userId",
                data.user._id
            );

            localStorage.setItem(
                "userName",
                data.user.name
            );

            localStorage.setItem(
                "userEmail",
                data.user.email
            );

            alert("Login Successful");

            window.location.href =
            "dashboard.html";

        }
        else{

            alert(
                data.message ||
                "Invalid Email or Password"
            );

        }

    }
    catch(error){

        console.log(error);

        alert(
            "Cannot connect to backend server"
        );

    }

}

/* Enter Key Support */

document.addEventListener(
    "keypress",
    function(event){

        if(event.key === "Enter"){

            login();

        }

    }
);