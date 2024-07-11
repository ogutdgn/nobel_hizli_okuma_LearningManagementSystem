"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Course Controller:

const Course = require('../models/course');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Courses"]
            #swagger.summary = "List Courses"
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

        const data = await res.getModelList(Course)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Course),
            data
        })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Courses"]
            #swagger.summary = "Create Course"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Course 1"
                }
            }
        */

        const data = await Course.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Courses"]
            #swagger.summary = "Get Single Course"
        */

        if (req.params?.id) {
        // Single:
            const data = await Course.findOne({ _id: req.params.id })

            res.status(200).send({
                error: false,
                data
            })

        } else {
        // All:
            const data = await res.getModelList(Course)

            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(Course),
                data
            })
        }

    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Courses"]
            #swagger.summary = "Update Course"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Course 1"
                }
            }
        */

        const data = await Course.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await Course.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Courses"]
            #swagger.summary = "Delete Course"
        */

            const data = await Course.deleteOne({ _id: req.params.id });

            if (data.deletedCount) {
                res.status(204).send({
                    error: false,
                    message: 'Course deleted successfully.',
                    data
                });
            } 
            else {
                res.status(404).send({
                    error: true,
                    message: 'Course not found.',
                    data
                });
            }

    },

}