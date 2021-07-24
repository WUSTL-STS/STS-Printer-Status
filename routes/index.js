const express = require('express');
const router = express.Router();

const Job = require('../models/Printer')
const User = require('../models/User')

router.get('/', (req, res) => {
    res.render("admin");
});

module.exports = router;