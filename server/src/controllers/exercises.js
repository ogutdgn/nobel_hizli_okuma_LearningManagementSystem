"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | StockAPI Project
------------------------------------------------------- */
// Exercise Controller:

const Exercise = require('../models/exercises');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Exercises"]
            #swagger.summary = "List Exercises"
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */

        const data = await res.getModelList(Exercise)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Exercise),
            data
        })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Exercises"]
            #swagger.summary = "Create Exercise"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "title": "Exercise 1",
                    "description": "This is a description",
                    "type": "Type of exercise"
                }
            }
        */

        const data = await Exercise.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Exercises"]
            #swagger.summary = "Get Single Exercise"
        */

        if (req.params?.id) {
            // Single:
            const data = await Exercise.findOne({ _id: req.params.id })

            res.status(200).send({
                error: false,
                data
            })

        } else {
            // All:
            const data = await res.getModelList(Exercise)

            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(Exercise),
                data
            })
        }

    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Exercises"]
            #swagger.summary = "Update Exercise"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "title": "Exercise 1",
                    "description": "This is a description",
                    "type": "Type of exercise"
                }
            }
        */

        const data = await Exercise.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await Exercise.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Exercises"]
            #swagger.summary = "Delete Exercise"
        */

        const data = await Exercise.deleteOne({ _id: req.params.id });

        if (data.deletedCount) {
            res.status(200).send({
                error: false,
                message: 'Exercise deleted successfully.',
                data
            });
        } else {
            res.status(404).send({
                error: true,
                message: 'Exercise not found.',
                data
            });
        }
    },
}
