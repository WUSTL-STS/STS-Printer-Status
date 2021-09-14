const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group')

const scripts = require('../scripts/update')

// Desc: Main index page, lists printers and management options. Lets users create new groups.
// Route: GET /
router.get('/', async (req, res) => {
    try {
        let groups = await Group.find({}).populate({path: 'printers', populate: { path: 'contact '}}).lean()
        scripts()
        res.render('admin', {
            groups
        })
    }
    catch (err) {
        console.log(err)
    }
});

router.get('/flash', function(req, res){
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.session.message = {
        type: 'danger',
        message: 'Holy Guacamole!'
    }
    res.redirect('/')
  });

module.exports = router;