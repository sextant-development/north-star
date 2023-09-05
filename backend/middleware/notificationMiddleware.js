const asyncHandler = require('express-async-handler')
const firebase = require('firebase-admin')

const notificationHandler = asyncHandler(async (req, res, next) => {
    if(!req.notificationData) next()

    let notificationData = req.notificationData

    try {
        response = await firebase.messaging().sendEachForMulticast(notificationData)
        notificationData.sent = true
    } catch(error) {
        console.log(error)
    }
    next()
})

module.exports = notificationHandler