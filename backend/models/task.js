const mongoose = require("mongoose");

const taskSchema =
new mongoose.Schema({


    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    
     userId:{
        type:String,
        required:true
    },
    taskName: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    assignedTo: {
        type: String
    },

    priority: {
        type: String,
        default: "Medium"
    },

    status: {
        type: String,
        default: "Open"
    },

    dueDate: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
mongoose.model(
    "Task",
    taskSchema
);