const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
/* ==========================
   FILE UPLOAD
========================== */

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({
    storage: storage
});

/* DATABASE */

mongoose.connect("mongodb://127.0.0.1:27017/minijira")
.then(() => console.log("MongoDB Connected"))
.catch(error => console.log(error));

/* MODELS */

const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");
const Comment = require("./models/Comment");
const Notification = require("./models/Notification");

const JWT_SECRET = "minijira_secret_key";

/* AUTH MIDDLEWARE */

function verifyToken(req,res,next){

    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({
            message:"Access Denied"
        });
    }

    try{
        const verified = jwt.verify(token,JWT_SECRET);
        req.user = verified;
        next();
    }
    catch(error){
        res.status(401).json({
            message:"Invalid Token"
        });
    }
}

/* HOME */

app.get("/",(req,res)=>{
    res.send("Mini Jira Backend Running");
});

/* REGISTER */

app.post("/register",async(req,res)=>{

    try{
        const { name,email,password } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({
                message:"Email already exists"
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        res.json({
            success:true,
            message:"Registration Successful",
            user
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

/* LOGIN */

app.post("/login",async(req,res)=>{

    try{
        const { email,password } = req.body;

        const user = await User.findOne({ email,password });

        if(!user){
            return res.status(401).json({
                message:"Invalid Email or Password"
            });
        }

        const token = jwt.sign(
            {
                userId:user._id,
                email:user.email
            },
            JWT_SECRET,
            {
                expiresIn:"1d"
            }
        );

        res.json({
            success:true,
            message:"Login Successful",
            token,
            user
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

/* FORGOT PASSWORD */

app.put("/forgot-password",async(req,res)=>{

    try{
        const { email,newPassword } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        user.password = newPassword;

        await user.save();

        res.json({
            success:true,
            message:"Password Updated Successfully"
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

/* PROFILE */

app.get("/users/:id",verifyToken,async(req,res)=>{

    try{
        const user = await User.findById(req.params.id);

        res.json(user);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.put("/users/:id",verifyToken,async(req,res)=>{

    try{
        const { name } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name },
            { new:true }
        );

        res.json({
            success:true,
            message:"Profile Updated",
            user
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

/* DASHBOARD */

app.get("/dashboard/:userId",verifyToken,async(req,res)=>{

    try{
        const userId = req.params.userId;

        const totalProjects = await Project.countDocuments({
            userId,
            status:{ $ne:"Archived" }
        });

        const totalTasks = await Task.countDocuments({ userId });

        const openTasks = await Task.countDocuments({
            userId,
            status:"Open"
        });

        const progressTasks = await Task.countDocuments({
            userId,
            status:"In Progress"
        });

        const completedTasks = await Task.countDocuments({
            userId,
            status:"Completed"
        });

        const overdueTasks = await Task.countDocuments({
            userId,
            status:"Overdue"
        });

        res.json({
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
            message:error.message
        });
    }
});

/* PROJECTS */

app.get("/projects",verifyToken,async(req,res)=>{

    try{
        const { userId } = req.query;

        const projects = await Project.find({ userId });

        res.json(projects);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.post("/projects",verifyToken,async(req,res)=>{

    try{
        const project = await Project.create(req.body);

        await Notification.create({
            userId:req.body.userId,
            message:`New project created: ${req.body.projectName}`
        });

        res.json({
            success:true,
            message:"Project Added",
            project
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.put("/projects/:id",verifyToken,async(req,res)=>{

    try{
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );

        await Notification.create({
            userId:project.userId,
            message:`Project updated: ${project.projectName}`
        });

        res.json({
            success:true,
            message:"Project Updated",
            project
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.delete("/projects/:id",verifyToken,async(req,res)=>{

    try{
        await Project.findByIdAndDelete(req.params.id);

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

/* PROJECTS WITH TASK COUNT */

app.get("/projects-with-task-count",verifyToken,async(req,res)=>{

    try{
        const { userId } = req.query;

        const projects = await Project.find({ userId });

        const result = await Promise.all(
            projects.map(async(project)=>{

                const taskCount = await Task.countDocuments({
                    projectId:project._id.toString()
                });

                return {
                    _id:project._id,
                    userId:project.userId,
                    projectName:project.projectName,
                    description:project.description,
                    startDate:project.startDate,
                    endDate:project.endDate,
                    status:project.status,
                    taskCount
                };
            })
        );

        res.json(result);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

/* TASKS */

app.get("/tasks",verifyToken,async(req,res)=>{

    try{
        const { userId,projectId } = req.query;

        let filter = { userId };

        if(projectId){
            filter.projectId = projectId;
        }

        const tasks = await Task.find(filter);

        res.json(tasks);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.post("/tasks",verifyToken,async(req,res)=>{

    try{
        const task = await Task.create(req.body);

        await Notification.create({
            userId:req.body.userId,
            message:`New task created: ${req.body.taskName}`
        });

        res.json({
            success:true,
            message:"Task Added",
            task
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});


app.put("/tasks/:id",verifyToken,async(req,res)=>{

    try{
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );

        await Notification.create({
            userId:task.userId,
            message:`Task updated: ${task.taskName}`
        });

        res.json({
            success:true,
            message:"Task Updated",
            task
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.delete("/tasks/:id",verifyToken,async(req,res)=>{

    try{
        await Task.findByIdAndDelete(req.params.id);

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

/* COMMENTS */

app.post("/comments",verifyToken,async(req,res)=>{

    try{
        const { taskId,userId,comment } = req.body;

        const newComment = await Comment.create({
            taskId,
            userId,
            comment
        });

        const task = await Task.findById(taskId);

        if(task){
            await Notification.create({
                userId:task.userId,
                message:`New comment added on task: ${task.taskName}`
            });
        }

        res.json({
            success:true,
            message:"Comment Added",
            comment:newComment
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.get("/comments/:taskId",verifyToken,async(req,res)=>{

    try{
        const comments = await Comment.find({
            taskId:req.params.taskId
        }).sort({ createdAt:-1 });

        res.json(comments);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.delete("/comments/:id",verifyToken,async(req,res)=>{

    try{
        await Comment.findByIdAndDelete(req.params.id);

        res.json({
            success:true,
            message:"Comment Deleted"
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

/* NOTIFICATIONS */

app.get("/notifications/:userId",verifyToken,async(req,res)=>{

    try{
        const notifications = await Notification.find({
            userId:req.params.userId
        }).sort({ createdAt:-1 });

        res.json(notifications);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.post("/notifications",verifyToken,async(req,res)=>{

    try{
        const notification = await Notification.create(req.body);

        res.json({
            success:true,
            message:"Notification Created",
            notification
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.put("/notifications/:id/read",verifyToken,async(req,res)=>{

    try{
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead:true },
            { new:true }
        );

        res.json({
            success:true,
            message:"Notification Marked As Read",
            notification
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.delete("/notifications/:id",verifyToken,async(req,res)=>{

    try{
        await Notification.findByIdAndDelete(req.params.id);

        res.json({
            success:true,
            message:"Notification Deleted"
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});
app.post(
    "/tasks/:id/attachments",
    verifyToken,
    upload.single("file"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    message: "No file uploaded"
                });
            }

            const task = await Task.findById(req.params.id);

            if (!task) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            if (!task.attachments) {
                task.attachments = [];
            }

            task.attachments.push({
                fileName: req.file.originalname,
                filePath: req.file.filename
            });

            await task.save();

            res.json({
                success: true,
                message: "File Uploaded Successfully",
                task
            });

        }
        catch (error) {
            console.log("UPLOAD ERROR:", error);

            res.status(500).json({
                message: error.message
            });
        }
    }
);
/* SERVER */

app.listen(3000,()=>{
    console.log("Server Running on Port 3000");
});