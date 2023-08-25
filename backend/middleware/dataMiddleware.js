const mongoose = require("mongoose")

const dataDBSwitch = (req, res, next) => {
    mongoose.connection.useDb('dataDB')
    next()
}

module.exports = dataDBSwitch