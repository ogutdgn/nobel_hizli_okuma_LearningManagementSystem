"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Assignment Controller:

const Assignment = require('../models/assignment');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Assignments"]
            #swagger.summary = "List Assignments"
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

        const data = await res.getModelList(Assignment)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Assignment),
            data
        })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Assignments"]
            #swagger.summary = "Create Assignment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Assignment 1"
                }
            }
        */

        const data = await Assignment.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Assignments"]
            #swagger.summary = "Get Single Assignment"
        */

        if (req.params?.id) {
        // Single:
            const data = await Assignment.findOne({ _id: req.params.id })

            res.status(200).send({
                error: false,
                data
            })

        } else {
        // All:
            // const data = await res.getModelList(Assignment)

            const data = await res.getModelList(Assignment, {}, [
                { path: 'studentId', select: 'firstName lastName id' },
                // { path: 'courseId', select: 'courseName courseContent' },
            ])

            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(Assignment),
                data
            })
        }

    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Assignments"]
            #swagger.summary = "Update Assignment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Assignment 1"
                }
            }
        */

        const data = await Assignment.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await Assignment.findOne({ _id: req.params.id })
        })
    },

    updateIsDone: async (req, res) => {
        /*
            #swagger.tags = ["Assignments"]
            #swagger.summary = "Update Assignment isDone status"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "isDone": true
                }
            }
        */

        const { id } = req.params;
        const { isDone } = req.body;

        if (typeof isDone !== 'boolean') {
            return res.status(400).send({
                error: true,
                message: "Invalid isDone value, it should be boolean."
            });
        }

        const data = await Assignment.updateOne({ _id: id }, { isDone }, { runValidators: true });

        res.status(202).send({
            error: false,
            data,
            new: await Assignment.findOne({ _id: id })
        });
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Assignments"]
            #swagger.summary = "Delete Assignment"
        */

        const data = await Assignment.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })

    },

}