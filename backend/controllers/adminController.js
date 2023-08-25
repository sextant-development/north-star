const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const { registerUser } = require('./userController')

const revokeRefreshToken = asyncHandler(async (req, res) => {
    let id
    let iat
    // Get Token and decode it
    try {
        const revokeToken = req.body.refreshToken
        const decodedToken = jwt.verify(revokeToken, process.env.JWT_SECRET_REFRESH)
        // Get Time and User
        iat = decodedToken.iat
        id = decodedToken.id
    } catch (error) {
        res.status(400)
        throw new Error('Token nicht lesbar')
    }

    // Update User
    const user = await User.findById(id)
    user.lastRevokedTokenTime = iat
    await user.save()
    
    res.status(200)
    res.send('Revoked Token')
})

const updateDetails = asyncHandler(async (req, res) => {
    const { name, username, email, accessLevel, groups } = req.body
    if(!username) {
        res.status(400)
        throw new Error('Please specify user to update. (username)')
    }

    // Get User
    const user = await User.findOne({username})
    if(!user) {
        res.status(400)
        throw new Error('Couldnt find user')
    }

    // Update all necessary details
    if(name) user.name = name
    if(email) user.email = email
    if(accessLevel) user.accessLevel = accessLevel
    if(groups) user.groups = groups

    await user.save()

    res.send('updated Details')
})

const addUser = asyncHandler(async (req, res) => {
    // Für Einfachheit einfach Register Funktion:
    const { name, email, password, username, groups, accessLevel } = req.body
    // Check for all fields
    if(!name || !username || !password || !accessLevel || !groups) {
        res.status(400)
        throw new Error('Please add all fields')
    }
    
    // Check if user exists
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        username,
        groups,
        accessLevel,
        lastRevokedTokenTime: ''
    })

    // Send Result
    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            groups: user.groups,
            accessLevel: user.accessLevel,
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const addUsers = asyncHandler(async (req, res) => {
    // TODO: Add Users
    res.send('add multiple Users')
})

const removeUser = asyncHandler(async (req, res) => {
    username = req.body.username
    const result = await User.deleteOne({username})
    console.log(result)
    if (result.acknowledged && result.deletedCount == 1) {
        res.status(200)
        res.send('Deleted User')
    } else {
        res.status(400)
        res.send('User doesnt exist or already deleted')
    }
})

const removeUsers = asyncHandler(async (req, res) => {
    // TODO: Remove Users
    res.send('remove multiple Users')
})

const getNotifications = asyncHandler(async (req, res) => {
    // TODO: Get Notifications
    res.send('Here are your notifications')
})


module.exports = {
    revokeRefreshToken,
    updateDetails,
    addUser,
    addUsers,
    removeUser,
    removeUsers,
    getNotifications
}