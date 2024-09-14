"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router();
/* ------------------------------------------------------- */
// routes/assignment:

const assignment = require('../controllers/assignment');
const permissions = require('../middlewares/permissions');

// URL: /assignments

router.route('/(:id)?')
    .post(permissions.isTeacher, assignment.create)
    .get(permissions.isLogin, assignment.read)
    .put(permissions.isAdmin, assignment.update)
    .patch(permissions.isAdmin, assignment.update)
    .delete(permissions.isTeacher, assignment.delete);

router.route('/:id/isDone')
    .patch(permissions.isLogin, assignment.updateIsDone);

router.route('/')
    .get(permissions.isLogin, assignment.list);

/* ------------------------------------------------------- */
module.exports = router;
