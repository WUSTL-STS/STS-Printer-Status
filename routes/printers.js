const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Groups = require('../models/Group')

router.get('/edit/:id', async (req, res) => {
    try {
        let printer = await Printer.findById(req.params.id).lean()
        let groups = await Groups.find({}).lean()
        let users = await Users.find({}).lean()

        if (!printer) {
            return res.render('error/404')
        } else {
            console.log(printer)
            res.render('printer', {
                printer,
                groups,
                users
            })
        }
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

router.get('/add', async (req, res) => {
    try {
        let groups = await Groups.find({}).lean()
        let users = await User.find({}).lean()
        res.render('printer', {
            groups,
            users
        })
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

router.post('/add', async (req, res) => {
    try {

    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})
module.exports = router