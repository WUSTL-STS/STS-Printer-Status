const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Groups = require('../models/Group')

// Desc: The page where users are listed and can be created
// Route: GET /users/
router.get('/', async (req, res) => {
    try {
        let users = await User.find({}).lean()
        res.render('user', {
            users
        })
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

// Desc: The endpoint at which POST requests are handled to create new users
// Route: POST /users/add
router.post('/add', async (req, res) => {
    try {
        console.log(req.body)
        if (req.body.firstname == '' || req.body.firstname == null || req.body.lastname == '' || req.body.lastname == null) {
            return res.render('error/505')
        } else {
            await User.create(req.body)
            res.redirect('/users/')
        }
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

// Desc: The endpoint for DELETE requests to delete users.
// Route: DELETE /groups/:id
router.delete('/:id', async (req, res) => {
    try {
        let userPrinters = await Printer.find({ contact: req.params.id })
        if(userPrinters){
            return res.render('error/505')
        } else {
            await User.deleteOne({ _id: req.params.id })
            res.redirect('/users')
        }

    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

module.exports = router