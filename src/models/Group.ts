//const mongoose = require('mongoose')
import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
    groupName: String,
    printers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Printer'
    }
})
 
module.exports = mongoose.model('Group', GroupSchema)
