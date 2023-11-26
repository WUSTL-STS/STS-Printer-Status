const mongoose = require('mongoose')
const config = require('../config/config')
const logger = require('../scripts/logger')

const connectDB = async (uri, callback) => {
    let url
    if (process.env.DEPLOY === 'docker') {
        url = config.URI_Docker
    } else {
        url = config.URI_Local
    }
    logger.info("Attempting connection at " + url)
    try {
        const conn = await mongoose.connect(url, {
            "auth": { "authSource": "admin" },
            "user": process.env.MONGO_USER,
            "pass": process.env.MONGO_PASSWORD
        })
        logger.info(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        logger.error(err.message)
        process.exit(1)
    }
}

module.exports = connectDB
