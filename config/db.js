"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const config_1 = __importDefault(require("./config"));
const logger = require('../scripts/logger');
const connectDB = async (uri, callback) => {
    try {
        let url;
        if (process.env.DEPLOY === 'docker') {
            url = config_1.default.URI_Docker;
        }
        else {
            url = config_1.default.URI_Local;
        }
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
};
module.exports = connectDB;
