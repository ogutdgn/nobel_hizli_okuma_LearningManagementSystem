"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | StockAPI Project
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')

// User Model:
const AssignmentSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,  
        required: true,
        ref: "User",
    },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,  
        required: true,
        ref: "User",
        default: "65343222b67e9681f937f001",
    },
    
    taskContent: [{
        type: String,
        required: true
    }],
    
    dueDate: {
        type: Date,
        required: true
    },

    isDone: {
        type: Boolean,
        required: true,
        default: false
    }

}, { collection: 'assignments', timestamps: true })

/* ------------------------------------------------------- */
module.exports = mongoose.model('Assignment', AssignmentSchema);
