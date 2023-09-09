"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config = require('../config/config');
const logger = require('../scripts/logger');
const router = express_1.default.Router();
router.get('/', (req, res) => {
    if (process.env.DEPLOY !== 'docker') {
        req.session.loggedIn = true;
        return res.redirect('/');
    }
    res.render('login');
});
router.post('/', (req, res) => {
    if (req.body.password === process.env.SITE_PASS) {
        req.session.loggedIn = true;
        return res.redirect('/');
    }
    else {
        res.render('login');
    }
});
router.get('/', (req, res) => {
    if (process.env.DEPLOY !== 'docker') {
        req.session.loggedIn = true;
        return res.redirect('/');
    }
    res.render('login');
});
router.post('/', (req, res) => {
    if (req.body.password === process.env.SITE_PASS) {
        req.session.loggedIn = true;
        return res.redirect('/');
    }
    else {
        res.render('login');
    }
});
module.exports = router;
