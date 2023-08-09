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
        enum: ['M577', 'M578', 'M605', 'M608'],
        required: true
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: Boolean,
        default: 'true' // If true, then send emails
    },
    tag: {
        type: String
    },
    toner: [Number],
    paper: [Boolean],
    status: {
        type: String
    }
});
module.exports = mongoose.model('Printer', PrinterSchema);
