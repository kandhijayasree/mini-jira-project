const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },

    userId:String,

    taskName:String,

    description:String,

    assignedTo:String,

    dueDate:String,

    priority:String,

    status:String,

    attachments:[
        {
            fileName:String,

            filePath:String,

            uploadedAt:{
                type:Date,
                default:Date.now
            }
        }
    ]

});

module.exports = mongoose.model("Task", taskSchema);