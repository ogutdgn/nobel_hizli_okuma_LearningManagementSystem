"use strict"
const { mongoose } = require('../configs/dbConnection')

// Exercise Model:
const ExerciseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    urlName: {
        type: String,
        trim: true,
        // required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    type: {
        type: String,
        trim: true,
        required: true,
    },
}, { collection: 'exercises', timestamps: true })

module.exports = mongoose.model('Exercise', ExerciseSchema)
