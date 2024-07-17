"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Enrollment Controller:

const Enrollment = require('../models/enrollment');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Enrollments"]
            #swagger.summary = "List Enrollments"
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

        // const data = await res.getModelList(Enrollment, {}, ["studentId", "courseId"])
        // const data = await res.getModelList(Enrollment, {}, ["studentId", "courseId"])
        // const data = await res.getModelList(Enrollment, names, { path: "courseId" })
        // const data = await res.getModelList(Enrollment, {}, { path: "courseId" })


        // res.status(200).send({
        //     error: false,
        //     details: await res.getModelListDetails(Enrollment),
        //     data
        // })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Enrollments"]
            #swagger.summary = "Create Enrollment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Enrollment 1"
                }
            }
        */
        if (await Enrollment.findOne({ studentId: req.body.studentId, courseId: req.body.courseId })) {
            res.status(404).send({
                error: true,
                message: "Zaten bu kursa kayıtlısınız.",
                
            })
        } else {
            const data = await Enrollment.create(req.body)

            res.status(201).send({
                error: false,
                data
            })
        }

        // const data = await Enrollment.create(req.body)

        // res.status(201).send({
        //     error: false,
        //     data
        // })
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Enrollments"]
            #swagger.summary = "Get Single Enrollment"
        */

        if (req.params?.id) {
        // Single:
            const data = await Enrollment.findOne({ _id: req.params.id }).populate([
                { path: 'studentId', select: 'username email' },
                { path: 'courseId', select: 'courseName courseContent' },
            ])

            res.status(200).send({
                error: false,
                data
            })

        } else {
        // All:
            const data = await res.getModelList(Enrollment, {}, [
                { path: 'studentId', select: 'username email' },
                { path: 'courseId', select: 'courseName courseContent' },
            ])
            
            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(Enrollment),
                data
            })
        }

    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Enrollments"]
            #swagger.summary = "Update Enrollment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Enrollment 1"
                }
            }
        */

        const data = await Enrollment.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await Enrollment.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Enrollments"]
            #swagger.summary = "Delete Enrollment"
        */

        const data = await Enrollment.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })

    },

}