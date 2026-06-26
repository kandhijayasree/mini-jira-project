const loginForm =
document.getElementById(
    "loginForm"
);

loginForm.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const email =
        document.getElementById(
            "email"
        ).value;

        const password =
        document.getElementById(
            "password"
        ).value;

        try{

            const response =
            await fetch(
                "http://localhost:3000/login",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":
                        "application/json"
                    },
                    body:JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data =
            await response.json();

            if(response.ok){
                
    console.log("LOGIN DATA:", data);
    console.log("USER:", data.user);
    console.log("USER NAME:", data.user.name);

                localStorage.setItem(
                    "userId",
                    data.user._id
                );
localStorage.setItem(
    "token",
    data.token
);
                localStorage.setItem(
                    "userName",
                    data.user.name
                );
                localStorage.setItem(
                    "userEmail",
                    data.user.email
                );

                window.location.href =
                "dashboard.html";

            }
            else{

                document.getElementById(
                    "message"
                ).innerText =
                data.message;
            }

        }
        catch(error){

            console.log(error);

            document.getElementById(
                "message"
            ).innerText =
            "Server Error";
        }
    }
);