const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

// FIRST EXECUTE accessTokenProtection(), after accessLevelProtection



const accessTokenProtection = asyncHandler(async (req, res, next) => {
        let token

        // Check for Auth Header and Bearer Type
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                // Extract token
                token = req.headers.authorization.split(' ')[1]

                //Verify Token
                const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS)
                
                // Make User available (without Password)
                req.user = await User.findById(decoded.id).select('-password')
                
                next()
            } catch(error) {
                console.log(error)
                if (error.name === 'TokenExpiredError') {
                    res.status(401)
                    throw new Error('Token expired')
                } else {
                    res.status(401)
                    throw new Error('Not authorized')
                }
            }
        }
        if (!token) {
            res.status(401)
            throw new Error('Not authorized, no token')
        }
})

const refreshTokenProtection = asyncHandler(async (req, res, next) => {
    let token

    // Check for Auth Header and Bearer Type
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token
            token = req.headers.authorization.split(' ')[1]

            //Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH)

            // Make User available (without Password)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch(error) {
            console.log(error)
            if (error.name === 'TokenExpiredError') {
                res.status(401)
                throw new Error('Token expired')
            } else {
                res.status(401)
                throw new Error('Not authorized')
            }
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})


const accessLevelProtection = (requiredAccessLevel) => {
    return (req, res, next) => {
        // Get accessLevel of User
        accessLevel = req.user.accessLevel

        // Check if (not) users accessLevel is high enough for requiredAccessLevel
        if(!(accessLevel >= requiredAccessLevel)) {
            res.status(401)
            throw new Error('Too low access level.')
        }
        next()
    }
}

module.exports = {accessTokenProtection,refreshTokenProtection, accessLevelProtection}