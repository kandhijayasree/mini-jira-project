async function registerUser() {

    const name =
    document.getElementById("name").value;

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const message =
    document.getElementById("message");

    message.innerText = "";

    if (
        name === "" ||
        email === "" ||
        password === ""
    ) {

        message.style.color = "red";

        message.innerText =
        "Please fill all fields";

        return;
    }

    try {

        const response =
        await fetch(
            "http://localhost:3000/register",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    name,
                    email,
                    password

                })
            }
        );

        const data =
        await response.json();

        if(data.success){

            message.style.color =
            "green";

            message.innerText =
            "Registration Successful";

            setTimeout(() => {

                window.location.href =
                "login.html";

            }, 1500);

        }
        else{

            message.style.color =
            "red";

            message.innerText =
            data.message;

        }

    }
    catch(error){

        console.log(error);

        message.style.color =
        "red";

        message.innerText =
        "Backend connection failed";

    }

}