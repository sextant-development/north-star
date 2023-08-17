const mongoose = require("mongoose")

const userDBSwitch = (req, res, next) => {
    mongoose.connection.useDb('userDB')
    next()
}

module.exports = userDBSwitch