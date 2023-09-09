"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//const mongoose = require('mongoose')
const PrinterSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
module.exports = mongoose_1.default.model('Printer', PrinterSchema);
