const mongoose = require('mongoose')

const PrinterSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    model: {
        type: String,
        enum: ['M577', 'M578'],
        required: true
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: Boolean,
        default: 'true'
    },
    // id: {
    //     type: Number,
    //     required: true
    // },

    toner: [Number], // blk, cyn, mag, yel, fuser, status?, feeder?, img transfer?
    paper: [Boolean], //tray 2, 3, 4, 5

    status: {
        type: String,
    }

})

module.exports = mongoose.model('Printer', PrinterSchema)