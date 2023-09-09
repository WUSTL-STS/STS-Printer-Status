"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const mongoose = require('mongoose')
const mongoose_1 = __importDefault(require("mongoose"));
const GroupSchema = new mongoose_1.default.Schema({
    groupName: String,
    printers: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'Printer'
    }
});
module.exports = mongoose_1.default.model('Group', GroupSchema);
