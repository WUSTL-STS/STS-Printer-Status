const express = require('express')
const router = express.Router()

const Printer = require('../models/Printer')
const User = require('../models/User')

// Desc: The page where users are listed and can be created
// Route: GET /users/
router.get('/', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('login')
        return
    }
    try {
        const users = await User.find({}).lean()
        res.render('user', {
            users
        })
    } catch (err) {
        console.error(err)
        return res.render('error/505')
    }
})

// Desc: The endpoint at which POST requests are handled to create new users
// Route: POST /users/add
router.post('/add', async (req, res) => {
    try {
        if (req.body.firstname == '' || req.body.firstname == null || req.body.lastname == '' || req.body.lastname == null) {
            req.session.message = {
                type: 'danger',
                title: 'Please fill out ALL the required forms!'
            }
            res.redirect('/users/add')
        } else {
            await User.create(req.body)
            req.session.message = {
                type: 'primary',
                message: 'Success!'
            }
            res.redirect('/users/')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/505')
    }
})

// Desc: The endpoint for DELETE requests to delete users.
// Route: DELETE /groups/:id
router.delete('/:id', async (req, res) => {
    try {
        const userPrinters = await Printer.find({ contact: req.params.id })
        console.log('trying to delete user with id ' + req.params.id)
        if (userPrinters && userPrinters.length) {
            console.error('cannot delete, user is associated with printers')
            req.session.message = {
                type: 'danger',
                title: 'This user is still associated with some printers!',
                message: 'Please delete the printers that this user is associated with before deleting this user.'
            }
            res.redirect('/users')
        } else {
            console.log('attempting deletion...')
            await User.deleteOne({ _id: req.params.id })
            req.session.message = {
                type: 'primary',
                message: 'Success!'
            }
            console.log('deletion successful')
            res.redirect('/users')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/505')
    }
})

module.exports = router
