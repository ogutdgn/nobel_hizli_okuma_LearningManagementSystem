"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Stage Controller:

const Stage = require('../models/stages');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Stages"]
            #swagger.summary = "List Stages"
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

        const data = await res.getModelList(Stage)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Stage),
            data
        })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Stages"]
            #swagger.summary = "Create Stage"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "description": "Description 1",
                    "courseId": "CourseId"
                }
            }
        */
        try {
            // Mevcut en yüksek order değerini al
            const highestOrderStage = await Stage.findOne({ courseId: req.body.courseId })
                .sort({ order: -1 });
    
            // Yeni stage için order belirle
            const newOrder = highestOrderStage ? highestOrderStage.order + 1 : 1;
    
            // Yeni stage oluştur ve title'ı order'a göre ayarla
            const newStage = await Stage.create({
                ...req.body,
                title: `Aşama ${newOrder}`,
                order: newOrder
            });
    
            res.status(201).send({
                error: false,
                data: newStage
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: error.message
            });
        }
    },
    

    read: async (req, res) => {
        /*
            #swagger.tags = ["Stages"]
            #swagger.summary = "Get Single Stage"
        */

        if (req.params?.id) {
        // Single:
            const data = await Stage.findOne({ _id: req.params.id })

            res.status(200).send({
                error: false,
                data
            })

        } else {
        // All:
            const data = await res.getModelList(Stage)

            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(Stage),
                data
            })
        }

    },

    // Update method in controller
    update: async (req, res) => {
        try {
            
                const data = await Stage.updateOne({ _id: req.params.id }, req.body, { runValidators: true });
    
                return res.status(202).send({
                    error: false,
                    data,
                    new: await Stage.findOne({ _id: req.params.id })
                });
            
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error.message
            });
        }
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

        const data = await Stage.updateOne({ _id: id }, { isDone }, { runValidators: true });

        res.status(202).send({
            error: false,
            data,
            new: await Stage.findOne({ _id: id })
        });
    },
    

    
    
    

delete: async (req, res) => {
    /*
        #swagger.tags = ["Stages"]
        #swagger.summary = "Delete Stage"
    */

    try {
        const stageToDelete = await Stage.findById(req.params.id);
        if (!stageToDelete) {
            return res.status(404).send({
                error: true,
                message: 'Stage not found.'
            });
        }

        await Stage.deleteOne({ _id: req.params.id });

        // Order'ı güncelle
        const stagesToUpdate = await Stage.find({ courseId: stageToDelete.courseId, order: { $gt: stageToDelete.order } });
        for (let stage of stagesToUpdate) {
            stage.order -= 1;
            stage.title = `Aşama ${stage.order}`;
            await stage.save();
        }

        res.status(200).send({
            error: false,
            message: 'Stage deleted successfully.'
        });
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        });
    }
}

    

}
