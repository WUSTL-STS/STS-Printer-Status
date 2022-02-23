const express = require('express')
const router = express.Router()

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group')

router.get('/', async (req, res) => {
    try {
    // const printers = await Printer.find({}).lean()
        res.redirect('/')
    } catch (err) {
        console.error(err)
        res.redirect('error/505')
    }
})

// Desc: Loads the page where new printers can be created
// Route: GET /printers/add
router.get('/add', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('login')
        return
    }
    try {
        const groups = await Group.find({}).lean()
        if (!groups.length) {
            req.session.message = {
                type: 'warning',
                title: 'No groups exist!',
                message: 'Please create a printer group before adding a printer.'
            }
            res.redirect('/')
        }
        const users = await User.find({}).lean()
        if (!users.length) {
            req.session.message = {
                type: 'warning',
                title: 'No user exist!',
                message: 'Please create users before adding a printer.'
            }
            res.redirect('/')
        }
        res.render('printer', {
            groups,
            users
        })
    } catch (err) {
        console.error(err)
        return res.render('error/505')
    }
})

// Desc: The endpoint at which new printers are created
// Route: POST /printers/add
router.post('/add', async (req, res) => {
    try {
    // Parse the first and last name
        const firstname = req.body.user.split(' ').slice(0, -1).join(' ')
        const lastname = req.body.user.split(' ').slice(-1).join(' ')

        // Create a query Mongoose can use to search for the correct user
        const nameQuery = {}
        nameQuery.firstname = firstname
        nameQuery.lastname = lastname
        console.log('creating new printer with user object ' + nameQuery)
        const contactUser = await User.findOne(nameQuery)

        // Create new printer object with correct parameters
        const newPrinter = new Printer()
        newPrinter.location = req.body.location
        newPrinter.url = req.body.url
        newPrinter.model = req.body.model
        newPrinter.contact = contactUser
        newPrinter.toner = [0, 0, 0, 0, 0]
        newPrinter.paper = [true, true, true, true]
        await newPrinter.save()

        // Update the group to contain the printer
        const groupQuery = {}
        groupQuery.groupName = req.body.group
        const printerGroup = await Group.findOne(groupQuery)
        printerGroup.printers.push(newPrinter)
        await printerGroup.save()
        req.session.message = {
            type: 'success',
            message: 'Success!'
        }
        res.redirect('/')
    } catch (err) {
        console.error(err)
        return res.render('error/505')
    }
})

// Desc: Delete a printer
// Route: DELETE /printers/:id
router.delete('/:id', async (req, res) => {
    try {
        console.log('Deleting printer with id ' + req.params.id)
        const g = await Group.findOne({ printers: req.params.id })
        g.printers.pull(req.params.id)
        await g.save()

        await Printer.findByIdAndDelete(req.params.id)
        req.session.message = {
            type: 'success',
            message: 'Success!'
        }
        console.log('success!')
        res.redirect('/')
    } catch (err) {
        console.error(err)
        return res.render('error/505')
    }
})

// Desc: Switch a printer's email status
// Route: PUT /printers/:id/email
router.put('/:id/email', async (req, res) => {
    try {
        const updateP = await Printer.findById(req.params.id)
        updateP.email = !updateP.email
        await updateP.save()
        console.log(updateP.location + ' has email set to ' + updateP.email)
        res.redirect('/')
    } catch (err) {
        console.error(err)
        return res.render('error/505')
    }
})

module.exports = router
