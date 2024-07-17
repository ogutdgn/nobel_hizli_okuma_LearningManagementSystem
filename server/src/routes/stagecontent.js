"use strict"
const router = require('express').Router();
const stagecontent = require('../controllers/stagecontent');
const permissions = require('../middlewares/permissions');

// URL: /stagecontents

router.route('/(:id)?')
    .post(permissions.isAdmin, stagecontent.create)
    .get(permissions.isLogin, stagecontent.read)
    .put(permissions.isAdmin, stagecontent.update)
    .patch(permissions.isAdmin, stagecontent.update)
    .delete(permissions.isAdmin, stagecontent.delete)

router.route('/updateOrder')
    .post(permissions.isAdmin, stagecontent.updateOrder);

module.exports = router;
