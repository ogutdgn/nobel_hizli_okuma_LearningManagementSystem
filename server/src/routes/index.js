"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | StockAPI Project
------------------------------------------------------- */
const router = require('express').Router()

/* ------------------------------------------------------- */
// routes/:

// URL: /

// auth:
router.use('/auth', require('./auth'))
// user:
router.use('/users', require('./user'))
// token:
router.use('/tokens', require('./token'))


// assingment:
router.use('/assignments', require('./assignment'))
// course:
router.use('/courses', require('./course'))
// enrollment:
router.use('/enrollments', require('./enrollment'))
// exercises
router.use('/exercises', require('./exercises'))
// stages
router.use('/stages', require('./stages'))
// stagecontent
router.use('/stagecontent', require('./stagecontent'))



// document:
router.use('/documents', require('./document'))

/* ------------------------------------------------------- */
module.exports = router