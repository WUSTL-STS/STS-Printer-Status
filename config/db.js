const mongoose = require('mongoose')
const config = require('../config/config')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      (process.env.DEPLOY === 'docker') ? config.URI_Docker : config.URI_Local, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB
