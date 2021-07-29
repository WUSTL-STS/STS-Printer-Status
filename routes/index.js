const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group')

router.get('/', async (req, res) => {
    try {
        let groups = await Group.find({}).lean()
        // console.log(groups)
        res.render('admin', {
            groups
        })
    }
    catch (err) {
        console.log(err)

    }
});

module.exports = router;