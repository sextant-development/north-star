const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const revokeToken = asyncHandler(async (req, res) => {
    res.send('revoke User')
})

const updateDetails = asyncHandler(async (req, res) => {
    res.send('update Details')
})

const addUser = asyncHandler(async (req, res) => {
    res.send('add User')  
})

const addUsers = asyncHandler(async (req, res) => {
    res.send('add multiple Users')  
})

const removeUser = asyncHandler(async (req, res) => {
    res.send('remove User')
})

const removeUsers = asyncHandler(async (req, res) => {
    res.send('remove multiple Users')
})

const getNotifications = asyncHandler(async (req, res) => {
    res.send('Here are your notifications')
})


const registerUser = asyncHandler(async (req, res) => {
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
        accessLevel
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
            accessToken: generateAccessToken(user.id, user.accessLevel),
            refreshToken: generateRefreshToken(user.id, user.accessLevel)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})


module.exports = {
    revokeToken,
    updateDetails,
    addUser,
    addUsers,
    removeUser,
    removeUsers,
    getNotifications
}