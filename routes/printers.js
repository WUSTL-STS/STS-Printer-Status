const express = require('express')
const router = express.Router()
const csv = require('csvtojson')

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group')
const path = require('path')

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

router.get('/import', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/samples', 'printers.csv'))
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
        if (!(req.files.printerImport.name).includes('.csv') || Object.keys(req.files).length > 1) {
            req.session.message = {
                type: 'warning',
                title: 'File import error!',
                message: 'Make sure to upload a CSV and to upload only one file.'
            }
            res.redirect('/users')
        }

        const upload = await csv().fromString(req.files.printerImport.data.toString('utf8'))
        for (let i = 0; i < upload.length; i++) {
            const p = {}
            p.location = upload[i].location
            p.url = upload[i].url
            if (!upload[i].contact_email) {
                p.contact = await User.findOne({ email: 'student.technology@wustl.edu' })
            } else {
                p.contact = await User.findOne({ email: upload[i].contact_email })
            }

            upload[i].model ? p.model = upload[i].model : p.model = 'M577'

            const printer = await Printer.create(p)
            await printer.save()
            const group = await Group.findOne({ name: upload[i].group })
            await group.printers.push(printer)
            await group.save()
            console.log('imported ' + p.location + ' printer')
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
    if (!req.session.loggedIn) {
        res.redirect('login')
        return
    }
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

router.get('/:id/', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/login')
        return
    }
    try {
        const p = await Printer.findById(req.params.id).populate('contact').lean()
        const groups = await Group.find().lean()
        const users = await User.find().lean()
        p.group = await Group.findOne({ printers: req.params.id }).lean()
        console.log(p)

        res.render('printer', { p, groups, users })
    } catch (err) {
        console.error(err)
    }
})

router.put('/:id/', async (req, res) => {
    try {
        const nameQuery = {}
        nameQuery.firstname = req.body.user.split(' ').slice(0, -1).join(' ')
        nameQuery.lastname = req.body.user.split(' ').slice(-1).join(' ')
        const contactUser = await User.findOne(nameQuery)

        let select = Printer.findById(req.params.id).lean()
        const p = {}
        p.email = select.email
        p.toner = select.toner
        p.paper = select.paper
        p.location = req.body.location
        p.url = req.body.url
        p.model = req.body.model
        p.contact = contactUser

        select = await Printer.findByIdAndUpdate(req.params.id, p)
        await select.save()

        // Remove the printer from the old group (assuming it changed)
        const oldGroup = await Group.findOne({ printers: req.params.id })
        oldGroup.printers.pull(req.params.id)
        await oldGroup.save()

        // Update the group to contain the printer
        const groupQuery = {}
        groupQuery.groupName = req.body.group
        const newGroup = await Group.findOne(groupQuery)
        newGroup.printers.push(select)
        await newGroup.save()

        res.redirect('/')
    } catch (err) {
        console.error(err)
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
