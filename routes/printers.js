const express = require('express')
const router = express.Router()
const csv = require('csvtojson')
const logger = require('../scripts/logger')

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group')
const path = require('path')

router.get('/', async (req, res) => {
    try {
    // const printers = await Printer.find({}).lean()
        return res.redirect('/')
    } catch (err) {
        logger.error(err)
        return res.redirect('error/505')
    }
})

// Desc: Loads the page where new printers can be created
// Route: GET /printers/add
router.get('/add', async (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('login')
    }
    try {
        const groups = await Group.find({}).lean()
        if (!groups.length) {
            req.session.message = {
                type: 'warning',
                title: 'No groups exist!',
                message: 'Please create a printer group before adding a printer.'
            }
            logger.warn('Tried to add a printer before creating a group')
            return res.redirect('/')
        }
        const users = await User.find({}).lean()
        if (!users.length) {
            req.session.message = {
                type: 'warning',
                title: 'No users exist!',
                message: 'Please create users before adding a printer.'
            }
            logger.warn('Tried to add a printer before adding users')
            return res.redirect('/')
        }
        res.render('printer', {
            groups,
            users
        })
    } catch (err) {
        logger.error(err)
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
        logger.info('creating new printer with user object ' + nameQuery)
        const contactUser = await User.findOne(nameQuery)

        // Create new printer object with correct parameters
        const newPrinter = {}
        newPrinter.location = req.body.location
        const existing = await Printer.findOne({ location: newPrinter.location })
        if (existing !== null) {
            console.log('found' + existing.location)
            req.session.message = {
                type: 'warning',
                title: 'Form incorrect!',
                message: 'A printer with that name already exists!.'
            }
            logger.warn('Duplicate name')
            return res.redirect('/printers/add')
        }
        newPrinter.url = req.body.url
        newPrinter.model = req.body.model
        newPrinter.tag = req.body.tag
        newPrinter.contact = contactUser
        newPrinter.toner = [0, 0, 0, 0, 0]
        newPrinter.paper = [true, true, true, true]
        if (!newPrinter.location || !newPrinter.url) {
            req.session.message = {
                type: 'warning',
                title: 'Form incorrect!',
                message: 'Please make sure to fill out all required form elements.'
            }
            logger.warn('Printer add form incorrect')
            return res.redirect('/printers/add')
        }
        const saved_printer = await Printer.create(newPrinter)

        // Update the group to contain the printer
        const groupQuery = {}
        groupQuery.groupName = req.body.group
        const printerGroup = await Group.findOne(groupQuery)
        printerGroup.printers.push(saved_printer)
        await printerGroup.save()
        req.session.message = {
            type: 'success',
            message: 'Success!'
        }
        logger.info(newPrinter.location + ' printer added successfully')
        return res.redirect('/')
    } catch (err) {
        logger.error(err)
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
            logger.warn('Blank form in file upload')
            return res.redirect('/users')
        }

        // Make sure the file is a csv and that there is 1 file
        if (!(req.files.printerImport.name).includes('.csv') || Object.keys(req.files).length > 1) {
            req.session.message = {
                type: 'warning',
                title: 'File import error!',
                message: 'Make sure to upload a CSV and to upload only one file.'
            }
            logger.warn('File uploaded is not a CSV in printer import')
            return res.redirect('/users')
        }

        const upload = await csv().fromString(req.files.printerImport.data.toString('utf8'))
        for (let i = 0; i < upload.length; i++) {
            const p = {}
            p.location = upload[i].location
            p.url = upload[i].url
            if (!upload[i].contact_email) {
                p.contact = await User.findOne({ email: 'student.technology@wustl.edu' })
                p.email = false
            } else {
                p.contact = await User.findOne({ email: upload[i].contact_email })
            }

            upload[i].model ? p.model = upload[i].model : p.model = 'M577'

            p.tag = upload[i].service_tag

            const printer = await Printer.create(p)
            await printer.save()
            const group = await Group.findOne({ groupName: upload[i].group })
            // console.log(upload[i].group)
            await group.printers.push(printer)
            await group.save()
            logger.info('imported ' + p.location + ' printer')
        }
        return res.redirect('/')
    } catch (err) {
        logger.error(err)
        console.error(err)
        return res.render('error/505')
    }
})

// Desc: Delete a printer
// Route: DELETE /printers/:id
router.delete('/:id', async (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('login')
    }
    try {
        const g = await Group.findOne({ printers: req.params.id })
        g.printers.pull(req.params.id)
        await g.save()

        await Printer.findByIdAndDelete(req.params.id)
        req.session.message = {
            type: 'success',
            message: 'Success!'
        }
        logger.info('Deletion of printer with id ' + req.params.id + ' successful')
        return res.redirect('/')
    } catch (err) {
        logger.error(err)
        return res.render('error/505')
    }
})

router.get('/:id/', async (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login')
    }
    try {
        const p = await Printer.findById(req.params.id).populate('contact').lean()
        const groups = await Group.find().lean()
        const users = await User.find().lean()
        p.group = await Group.findOne({ printers: req.params.id }).lean()

        res.render('printer', { p, groups, users })
    } catch (err) {
        logger.error(err)
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

        return res.redirect('/')
    } catch (err) {
        logger.error(err)
    }
})

// Desc: Switch a printer's email status
// Route: PUT /printers/:id/email
router.put('/:id/email', async (req, res) => {
    try {
        const updateP = await Printer.findById(req.params.id)
        updateP.email = !updateP.email
        await updateP.save()
        logger.info(updateP.location + ' has email set to ' + updateP.email)
        return res.redirect('/')
    } catch (err) {
        logger.error(err)
        return res.render('error/505')
    }
})

module.exports = router