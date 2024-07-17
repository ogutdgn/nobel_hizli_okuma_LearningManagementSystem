"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// sync():

module.exports = async function () {

    return null;

    /* REMOVE DATABASE *
    const { mongoose } = require('../configs/dbConnection')
    await mongoose.connection.dropDatabase()
    console.log('- Database and all data DELETED!')
    /* REMOVE DATABASE */

    /* User */
    // const User = require('../models/user')
    const Stage = require('../models/stages')
    await Stage.deleteMany() 

    // await User.updateMany(
    //     { isTeacher: { $exists: false } },
    //     { $set: { isTeacher: false } }
    // );
    // await User.deleteMany() // !!! Clear collection.
    // await User.create({
    //     "_id": "65343222b67e9681f937f001",
    //     "username": "admin",
    //     "password": "aA!12345",
    //     "email": "admin@site.com",
    //     "firstName": "admin",
    //     "lastName": "admin",
    //     "isActive": true,
    //     "isAdmin": true
    // })
    // await User.create({
    //     "_id": "65343222b67e9681f937f002",
    //     "username": "teacher",
    //     "password": "aA?123456",
    //     "email": "teacher@site.com",
    //     "firstName": "teacher",
    //     "lastName": "teacher",
    //     "isActive": true,
    //     "isAdmin": false
    // })
    // await User.create({
    //     "_id": "65343222b67e9681f937f003",
    //     "username": "student",
    //     "password": "aA?123456",
    //     "email": "student@site.com",
    //     "firstName": "student",
    //     "lastName": "student",
    //     "isActive": true,
    //     "isAdmin": false
    // })

    /* Finished */
    console.log('* Synchronized.')
}