const mongoose = require('mongoose')

// let uri = process.env.L_URI;
// if(process.env.DEPLOY == 'docker'){
//     uri = process.env.D_URI;
// }

const connectDB = async() => {
    try {
        let uri;
        const conn = await mongoose.connect(
            (process.env.DEPLOY == 'docker') ? process.env.D_URI : process.env.L_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB