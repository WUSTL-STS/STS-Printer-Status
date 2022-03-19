const mongoose = require('mongoose')
const config = require('../config/config')
const logger = require('../scripts/logger')

const connectDB = async (uri, callback) => {
    try {
        let url
        if (process.env.DEPLOY === 'docker') {
            url = config.URI_Docker
        } else {
            url = config.URI_Local
        }
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        logger.info(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        logger.error(err)
        process.exit(1)
    }
}

module.exports = connectDB
