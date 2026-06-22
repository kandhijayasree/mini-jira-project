const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
 
const SECRET_KEY =
"minijira_secret_key";

const app = express();

/* MIDDLEWARE */
function verifyToken(req, res, next){

    const token =
    req.headers.authorization;

    if(!token){

        return res.status(401).json({
            success:false,
            message:"Access Denied. No Token Provided"
        });

    }

    try{

        const verified =
        jwt.verify(
            token,
            SECRET_KEY
        );

        req.user =
        verified;

        next();

    }
    catch(error){

       return res.status(401).json({
            success:false,
            message:"Invalid Token. Please Login Again"
        });

    }

}
app.use(cors());
app.use(express.json());


app.use(
    express.static(
        path.join(__dirname)
    )
);

/* DATABASE */

mongoose
.connect("mongodb://127.0.0.1:27017/minijira")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log(error);
});

/* MODELS */

const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");

/* HOME */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "login.html"
        )
    );

});

/* REGISTER */

app.post("/register", async (req, res) => {

    try {

        const { name, email, password } =
        req.body;

        const existingUser =
        await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success:false,
                message:"Email already exists"
            });

        }

        const hashedPassword =
await bcrypt.hash(password, 10);

const newUser =
new User({
    name,
    email,
    password: hashedPassword
});

        await newUser.save();

        res.json({
            success:true,
            message:"Registration Successful",
            user:newUser
        });

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});

/* LOGIN */

app.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
        await User.findOne({
            email: email
        });

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

       const token = jwt.sign(
    {
        userId: user._id,
        email: user.email
    },
    SECRET_KEY,
    {
        expiresIn: "1d"
    }
);

res.json({
    success: true,
    message: "Login Successful",
    token,
    user
});

    }
    catch (error) {

        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

app.put("/forgot-password", async (req, res) => {

    try {

        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        }

        const hashedPassword =
        await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.json({
            success:true,
            message:"Password Updated Successfully"
        });

    } catch(error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
});

/* ==========================
   USER PROFILE
========================== */

app.get("/users/:id", async (req, res) => {

    try {

        const user =
        await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        }

        res.json(user);

    } catch(error) {

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
});

app.put("/users/:id", async (req, res) => {

    try {

        const { name } = req.body;

        const updatedUser =
        await User.findByIdAndUpdate(
            req.params.id,
            { name },
            { new:true }
        );

        res.json({
            success:true,
            message:"Profile Updated Successfully",
            user:updatedUser
        });

    } catch(error) {

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
});
/* DASHBOARD - USER WISE */

app.get(
    "/dashboard/:userId",
    verifyToken,
    async (req, res) => {

    try {

        const userId =
        req.params.userId;

        const totalProjects =
await Project.countDocuments({
    userId:userId,
    status:"Active"
});

        const totalTasks =
        await Task.countDocuments({
            userId:userId
        });

        const openTasks =
        await Task.countDocuments({
            userId:userId,
            status:"Open"
        });
const progressTasks =
await Task.countDocuments({
    userId:userId,
    status:"In Progress"
});
        const completedTasks =
        await Task.countDocuments({
            userId:userId,
            status:"Completed"
        });

        const overdueTasks =
        await Task.countDocuments({
            userId:userId,
            status:"Overdue"
        });

        res.json({
              success:true,
            totalProjects,
            totalTasks,
            openTasks,
            progressTasks,
            completedTasks,
            overdueTasks
        });

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});

/* PROJECTS - USER WISE */

/* Get Projects By User */

app.get(
    "/projects",
    verifyToken,
    async (req, res) => {

    try {

        const userId =
        req.query.userId;

        const projects =
        await Project.find({
            userId:userId
        });

        res.json(projects);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

/* Get Single Project */

app.get("/projects/:id", async (req, res) => {

    try {

        const project =
        await Project.findById(
            req.params.id
        );

        res.json(project);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

/* Create Project */

app.post("/projects", async (req, res) => {

    try {

        const project =
        new Project(req.body);

        await project.save();

        res.json(project);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

/* Update Project */

app.put("/projects/:id", async (req, res) => {

    try {

        const updatedProject =
        await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );

        res.json(updatedProject);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

/* Delete Project */

app.delete("/projects/:id", async (req, res) => {

    try {

        await Project.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success:true,
            message:"Project Deleted"
        });

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

app.get("/projects-with-task-count", async (req, res) => {
    try {
        const userId = req.query.userId;

       const projects = await Project.find({
    userId
});
        const result = [];

        for (let project of projects) {

            const taskCount =
            await Task.countDocuments({
                projectId: project._id
            });

            result.push({
                ...project._doc,
                taskCount
            });
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: "Error loading project task count"
        });
    }
});

/* TASKS - USER WISE */

/* Get Tasks By User */

app.get("/tasks", async (req, res) => {
    try {
        const { userId, projectId } = req.query;

        let filter = { userId };

        if(projectId){
            filter.projectId = projectId;
        }

        const tasks = await Task.find(filter);

        res.json(tasks);

    } catch(error) {
        res.status(500).json({
            message: "Error loading tasks"
        });
    }
});

/* Get Single Task */

app.get("/tasks/:id", async (req, res) => {

    try {

        const task =
        await Task.findById(
            req.params.id
        );

        res.json(task);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

/* Create Task */

app.post("/tasks", async (req, res) => {

    try {

        const task =
        new Task(req.body);

        await task.save();

        res.json(task);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

/* Update Task */

app.put("/tasks/:id", async (req, res) => {

    try {

        const updatedTask =
        await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );

        res.json(updatedTask);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

/* Delete Task */

app.delete("/tasks/:id", async (req, res) => {

    try {

        await Task.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success:true,
            message:"Task Deleted"
        });

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

/* SERVER */

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Server Running on Port ${PORT}`
    );

});