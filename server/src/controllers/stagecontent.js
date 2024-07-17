"use strict"
const StageContent = require('../models/stagecontent');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["StageContent"]
            #swagger.summary = "List StageContent"
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
        const data = await res.getModelList(StageContent);
        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(StageContent),
            data
        });
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["StageContent"]
            #swagger.summary = "Create StageContent"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "stageId": "60d21b4667d0d8992e610c85",
                    "exerciseId": "60d21b4667d0d8992e610c84",
                    "order": 1
                }
            }
        */
        const data = await StageContent.create(req.body);
        res.status(201).send({
            error: false,
            data
        });
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["StageContent"]
            #swagger.summary = "Get Single StageContent"
        */
        if (req.params?.id) {
            // Single:
            const data = await StageContent.findOne({ _id: req.params.id });
            res.status(200).send({
                error: false,
                data
            });
        } else {
            // All:
            const data = await res.getModelList(StageContent);
            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(StageContent),
                data
            });
        }
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["StageContent"]
            #swagger.summary = "Update StageContent"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "stageId": "60d21b4667d0d8992e610c85",
                    "exerciseId": "60d21b4667d0d8992e610c84",
                    "order": 2
                }
            }
        */
        const data = await StageContent.updateOne({ _id: req.params.id }, req.body, { runValidators: true });
        res.status(202).send({
            error: false,
            data,
            new: await StageContent.findOne({ _id: req.params.id })
        });
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["StageContent"]
            #swagger.summary = "Delete StageContent"
        */
        const data = await StageContent.deleteOne({ _id: req.params.id });
        if (data.deletedCount) {
            res.status(200).send({
                error: false,
                message: 'StageContent deleted successfully.',
                data
            });
        } else {
            res.status(404).send({
                error: true,
                message: 'StageContent not found.',
                data
            });
        }
    },

    updateOrder: async (req, res) => {
        /*
            #swagger.tags = ["StageContent"]
            #swagger.summary = "Update Order of StageContent"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "order": [
                        { "id": "60d21b4667d0d8992e610c84", "order": 1 },
                        { "id": "60d21b4667d0d8992e610c85", "order": 2 },
                        // More items...
                    ]
                }
            }
        */
        const { order } = req.body;

        try {
            const bulkOps = order.map(item => ({
                updateOne: {
                    filter: { _id: item.id, stageId: req.params.stageId },
                    update: { order: item.order }
                }
            }));
            await StageContent.bulkWrite(bulkOps);
            res.status(200).send({ error: false, message: 'Order updated successfully.' });
        } catch (error) {
            res.status(500).send({ error: true, message: error.message });
        }
    },
};
