"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | StockAPI Project
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')

// User Model:
const LessonSchema = new mongoose.Schema({

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User",
        required: true,
    },

    studentId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User",
        required: true,
    },


}, { collection: 'lessons', timestamps: true })

/* ------------------------------------------------------- */
module.exports = mongoose.model('Lesson', LessonSchema);