"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/course:

const course = require('../controllers/course')
const permissions = require('../middlewares/permissions')

// URL: /courses

router.route('/(:id)?')
    .post(permissions.isAdmin, course.create)
    .get(permissions.isLogin, course.read)
    .put(permissions.isAdmin, course.update)
    .patch(permissions.isAdmin, course.update)
    .delete(permissions.isAdmin, course.delete)

/* ------------------------------------------------------- */
module.exports = router