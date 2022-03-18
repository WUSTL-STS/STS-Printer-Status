const express = require('express')
const router = express.Router()

const Printer = require('../models/Printer')
const User = require('../models/User')

const path = require('path')
const csv = require('csvtojson')

// Desc: The page where users are listed and can be created
// Route: GET /users/
router.get('/', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/login')
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

router.get('/import', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/samples', 'users.csv'))
})

router.post('/import', async (req, res) => {
    try {
        // Make sure a file was uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            req.session.message = {
                type: 'warning',
                title: 'A file was not uploaded!',
                message: ''
            }
            res.redirect('/users')
        }

        // Make sure the file is a csv and that there is 1 file
        if (!(req.files.userImport.name).includes('.csv') || Object.keys(req.files).length > 1) {
            req.session.message = {
                type: 'warning',
                title: 'File import error!',
                message: 'Make sure to upload a CSV and to upload only one file.'
            }
            res.redirect('/users')
        }

        const upload = await csv().fromString(req.files.userImport.data.toString('utf8'))
        for (let i = 0; i < upload.length; i++) {
            await User.create(upload[i])
            console.log('imported user ' + i)
        }
        console.log('finished importing users')
        res.redirect('/users')
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
