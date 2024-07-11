"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | StockAPI Project
------------------------------------------------------- */
// Middleware: permissions

module.exports = {

    isLogin: (req, res, next) => {

        //! Set Passive:
        // return next()

        // any User:
        if (req.user && req.user.isActive) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login.')
        }
    },

    // isStudent: (req, res, next) => {

    //     //! Set Passive:
    //     // return next()

    //     // any User:
    //     if (req.user && req.user.isActive && req.user.isStudent && (req.user.isAdmin || req.user.isTeacher)) {

    //         next()

    //     } else {

    //         res.errorStatusCode = 403
    //         throw new Error('NoPermission: You must login.')
    //     }
    // },

    isAdmin: (req, res, next) => {

        //! Set Passive:
        // return next()
        
        // only Admin:
        if (req.user && req.user.isActive && req.user.isAdmin) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login and to be Admin.')
        }
    },

    isTeacher: (req, res, next) => {

        //! Set Passive:
        // return next()
        
        // only Admin or Staff:
        if (req.user && req.user.isActive && (req.user.isAdmin || req.user.isTeacher)) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login and to be Staff.')
        }
    },
}