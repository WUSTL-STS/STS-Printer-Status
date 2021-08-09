const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group');

// Desc: Loads the page where new printers can be created
// Route: GET /printers/add
router.get('/add', async (req, res) => {
    try {
        let groups = await Group.find({}).lean()
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

// Desc: The endpoint at which new printers are created
// Route: POST /printers/add
router.post('/add', async (req, res) => {
    try {
        //Parse the first and last name
        let firstname = req.body.user.split(' ').slice(0, -1).join(' ')
        let lastname = req.body.user.split(' ').slice(-1).join(' ')

        //Create a query Mongoose can use to search for the correct user
        var nameQuery = {}
        nameQuery['firstname'] = firstname
        nameQuery['lastname'] = lastname
        console.log(nameQuery)
        let contactUser = await User.findOne(nameQuery)

        //Create new printer object with correct parameters
        const newPrinter = new Printer()
        newPrinter.location = req.body.location
        newPrinter.url = req.body.url
        newPrinter.model = req.body.model
        newPrinter.contact = contactUser
        await newPrinter.save()

        //Update the group to contain the printer
        var groupQuery = {}
        groupQuery['groupName'] = req.body.group
        let printerGroup = await Group.findOne(groupQuery)
        printerGroup.printers.push(newPrinter)
        await printerGroup.save()
        res.redirect('/')
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

// Desc: Return information about a specific printer
// Route: /printers/:id
router.get('/:id', async (req, res) => {
    try {
        let printer = await Printer.findById(req.params.id).lean()
        let groups = await Group.find({}).lean()
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

router.delete('/:id', async (req, res) => {
    try {
        await Printer.deleteOne({ _id: req.params.id })
        res.redirect('/')
        
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

module.exports = router