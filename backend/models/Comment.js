const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    taskId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Comment", commentSchema);