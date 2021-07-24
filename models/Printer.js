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
        required: true
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: Boolean
    },
    id: {
        type: Number,
        required: true
    },
    
    toner: [Number],
    paper: [Boolean],

})

module.exports = mongoose.model('Printer', PrinterSchema)