async function updatePassword(){

    const email =
    document.getElementById(
        "email"
    ).value;

    const newPassword =
    document.getElementById(
        "newPassword"
    ).value;

    const confirmPassword =
    document.getElementById(
        "confirmPassword"
    ).value;

    const message =
    document.getElementById(
        "message"
    );

    message.innerText = "";

    if(
        email === "" ||
        newPassword === "" ||
        confirmPassword === ""
    ){
        message.style.color = "red";
        message.innerText =
        "Please fill all fields";
        return;
    }

    if(
        newPassword !==
        confirmPassword
    ){
        message.style.color = "red";
        message.innerText =
        "Passwords do not match";
        return;
    }

    try{

        const response =
        await fetch(
            "http://localhost:3000/forgot-password",
            {
                method:"PUT",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    email,
                    newPassword
                })
            }
        );

        const data =
        await response.json();

        if(data.success){

            message.style.color =
            "green";

            message.innerText =
            "Password Updated Successfully";

            setTimeout(() => {

                window.location.href =
                "login.html";

            }, 1500);

        }else{

            message.style.color =
            "red";

            message.innerText =
            data.message;
        }

    }
    catch(error){

        message.style.color =
        "red";

        message.innerText =
        "Backend connection failed";
    }
}