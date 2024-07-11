"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | StockAPI Project
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')

// User Model:
const EnrollmentSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User",
        required: true,
    },

    courseId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "Course",
        required: true,
    },


}, { collection: 'enrollments', timestamps: true })

/* ------------------------------------------------------- */
module.exports = mongoose.model('Enrollment', EnrollmentSchema);