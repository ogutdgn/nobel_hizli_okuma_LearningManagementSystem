"use strict"
const { mongoose } = require('../configs/dbConnection')

// StageContent Model:
const StageContentSchema = new mongoose.Schema({
    stageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stage',
        required: true,
    },
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
}, { collection: 'stagecontents', timestamps: true })

module.exports = mongoose.model('StageContent', StageContentSchema)
