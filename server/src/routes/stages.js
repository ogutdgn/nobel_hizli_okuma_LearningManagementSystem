"use strict"

const router = require('express').Router();
const stage = require('../controllers/stages');
const permissions = require('../middlewares/permissions');

// URL: /stages

router.route('/(:id)?')
    .post(permissions.isAdmin, stage.create)
    .get(permissions.isLogin, stage.read)
    .put(permissions.isAdmin, stage.update)
    .patch(permissions.isAdmin, stage.update)
    .delete(permissions.isAdmin, stage.delete)

router.route('/:id/isDone')
    .patch(permissions.isLogin, stage.updateIsDone);

/* ------------------------------------------------------- */
module.exports = router;
