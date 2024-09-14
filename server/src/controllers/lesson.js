"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Lesson Controller:

const Lesson = require('../models/lesson');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Lesson"]
            #swagger.summary = "List Lesson"
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

        // const data = await res.getModelList(Lesson, {}, ["studentId", "teacherId"])
        // const data = await res.getModelList(Lesson, {}, ["studentId", "teacherId"])
        // const data = await res.getModelList(Lesson, names, { path: "teacherId" })
        // const data = await res.getModelList(Lesson, {}, { path: "teacherId" })


        // res.status(200).send({
        //     error: false,
        //     details: await res.getModelListDetails(Lesson),
        //     data
        // })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Lesson"]
            #swagger.summary = "Create Lesson"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Lesson 1"
                }
            }
        */
        if (await Lesson.findOne({ studentId: req.body.studentId, teacherId: req.body.teacherId })) {
            res.status(404).send({
                error: true,
                message: "Zaten bu derse kayıtlısınız.",
                
            })
        } else {
            const data = await Lesson.create(req.body)

            res.status(201).send({
                error: false,
                data
            })
        }

        // const data = await Lesson.create(req.body)

        // res.status(201).send({
        //     error: false,
        //     data
        // })
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Lesson"]
            #swagger.summary = "Get Single Lesson"
        */

        if (req.params?.id) {
        // Single:
            const data = await Lesson.findOne({ _id: req.params.id }).populate([
                { path: 'studentId', select: 'firstName lastName' },
                { path: 'teacherId', select: 'firstName lastName' },
            ])

            res.status(200).send({
                error: false,
                data
            })

        } else {
        // All:
            const data = await res.getModelList(Lesson, {}, [
                { path: 'studentId', select: 'firstName lastName' },
                { path: 'teacherId', select: 'firstName lastName' },
            ])
            
            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(Lesson),
                data
            })
        }

    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Lesson"]
            #swagger.summary = "Update Lesson"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Lesson 1"
                }
            }
        */

        const data = await Lesson.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await Lesson.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Lesson"]
            #swagger.summary = "Delete Lesson"
        */

        const data = await Lesson.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })

    },

}