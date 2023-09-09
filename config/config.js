"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    email_hours: 3,
    toner_email_percentage: 3,
    table_red_threshold: 2,
    port: 8080,
    URI_Docker: 'mongodb://mongo:27017/printerstatus',
    URI_Local: 'mongodb://localhost:27017/printerstatus',
    global_email: true
};
exports.config.email_hours = 3;
exports.config.toner_email_percentage = 3;
exports.config.table_red_threshold = 2;
exports.config.port = 8080;
exports.config.URI_Docker = 'mongodb://mongo:27017/printerstatus';
exports.config.URI_Local = 'mongodb://localhost:27017/printerstatus';
exports.config.global_email = true;
module.exports = exports.config;
