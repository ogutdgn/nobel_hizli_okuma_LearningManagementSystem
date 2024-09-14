"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/class:

const lesson = require('../controllers/lesson')
const permissions = require('../middlewares/permissions')

// URL: /lessons

router.route('/(:id)?')
    .post(permissions.isLogin, lesson.create)
    .get(permissions.isLogin, lesson.read)
    .put(permissions.isAdmin, lesson.update)
    .patch(permissions.isAdmin, lesson.update)
    .delete(permissions.isAdmin, lesson.delete)

/* ------------------------------------------------------- */
module.exports = router