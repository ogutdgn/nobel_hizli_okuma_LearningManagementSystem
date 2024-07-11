"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | StockAPI Project
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/exercise:

const exercise = require('../controllers/exercises')
const permissions = require('../middlewares/permissions')

// URL: /exercises

router.route('/(:id)?')
    .post(permissions.isAdmin, exercise.create)
    .get(permissions.isLogin, exercise.read)
    .put(permissions.isAdmin, exercise.update)
    .patch(permissions.isAdmin, exercise.update)
    .delete(permissions.isAdmin, exercise.delete)

/* ------------------------------------------------------- */
module.exports = router
