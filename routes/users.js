const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Groups = require('../models/Group')

router.get('/', async (req, res) => {
    try {
        res.render('user')
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

router.post('/add', async (req, res) => {
    try {
        console.log(req.body)
        if (req.body.firstname == '' || req.body.firstname == null || req.body.lastname == '' || req.body.lastname == null) {
            return res.render('error/505')
        } else {
            await User.create(req.body)
            res.redirect('/')
        }
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

module.exports = router