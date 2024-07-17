"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/enrollment:

const enrollment = require('../controllers/enrollment')
const permissions = require('../middlewares/permissions')

// URL: /enrollments

router.route('/(:id)?')
    .post(permissions.isLogin, enrollment.create)
    .get(permissions.isLogin, enrollment.read)
    .put(permissions.isAdmin, enrollment.update)
    .patch(permissions.isAdmin, enrollment.update)
    .delete(permissions.isAdmin, enrollment.delete)

/* ------------------------------------------------------- */
module.exports = router