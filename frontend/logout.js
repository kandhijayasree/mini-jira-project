function logout(){

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("selectedProject");

    window.location.href = "/frontend/login.html";
}