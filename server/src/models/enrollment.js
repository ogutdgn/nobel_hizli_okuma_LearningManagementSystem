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

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User",
        required: true,
    },


}, { collection: 'enrollments', timestamps: true })

/* ------------------------------------------------------- */
module.exports = mongoose.model('Enrollment', EnrollmentSchema);