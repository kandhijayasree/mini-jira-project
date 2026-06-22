const mongoose = require("mongoose");

const projectSchema =
new mongoose.Schema({


    userId:{
        type:String,
        required:true
    },
    
    projectName: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    startDate: {
        type: String
    },

    endDate: {
        type: String
    },

    status: {
        type: String,
        default: "Active"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
mongoose.model(
    "Project",
    projectSchema
);