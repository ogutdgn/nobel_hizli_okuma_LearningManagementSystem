"use strict";
const { mongoose } = require('../configs/dbConnection');

// Stage Model:
const StageSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    exercises: [],
    order: {
        type: Number,
        required: true,
    },
    isDone: {
        type: Boolean,
        required: true,
        default: false
    },
}, { collection: 'stages', timestamps: true });

// Pre-save hook to update the title based on order
StageSchema.pre('save', function (next) {
    this.title = `Aşama ${this.order}`;
    next();
});

// Pre-update hook to update the title based on order
StageSchema.pre('findOneAndUpdate', function (next) {
    if (this._update.order !== undefined) {
        this._update.title = `Aşama ${this._update.order}`;
    }
    next();
});

module.exports = mongoose.model('Stage', StageSchema);
