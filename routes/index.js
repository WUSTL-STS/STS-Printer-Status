const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group')

// Desc: Main index page, lists printers and management options. Lets users create new groups.
// Route: GET /
router.get('/', async (req, res) => {
    try {
        let groups = await Group.find({}).populate({path: 'printers', populate: { path: 'contact '}}).lean()
        console.log(groups)
        res.render('admin', {
            groups
        })
    }
    catch (err) {
        console.log(err)

    }
});

module.exports = router;