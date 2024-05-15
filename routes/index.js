const express = require('express')
const router = express.Router()

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group')
const logger = require('../scripts/logger')

const updateValues = require('../scripts/updatePrinters')
const generateTable = require('../scripts/genTable')
const sendEmail = require('../scripts/sendEmail')
const generateReport = require('../scripts/generateReport')
const getError = require ('../scripts/getError')

// Desc: Main index page, lists printers and management options. Lets users create new groups.
// Route: GET /
router.get('/', async (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('login')
    }
    try {
        const groups = await Group.find({}).populate({ path: 'printers', populate: { path: 'contact' }, options: { sort: { location: 1 } } }).lean()
        // for (g of groups) {
        //     await generateTable(g)
        // }
        res.render('admin', {
            groups
        })
    } catch (err) {
        logger.error(err)
    }
})

router.get('/flash', function (req, res) {
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.session.message = {
        type: 'danger',
        message: 'Holy Guacamole!'
    }
    return res.redirect('/')
})

router.get('/fetch', async function (req, res) {
    if (!req.session.loggedIn) {
        return res.redirect('login')
        return
    }
    updateValues()
    return res.redirect('/')
})

router.get('/table', async function (req, res) {
    if (!req.session.loggedIn) {
        return res.redirect('login')
        return
    }
    await generateTable()
    return res.redirect('/')
})

router.get('/email', async function (req, res) {
    if (!req.session.loggedIn) {
        return res.redirect('login')
        return
    }
    await sendEmail()
    return res.redirect('/')
})

router.get('/report', async function (req, res) {
    if (!req.session.loggedIn) {
        return res.redirect('login')
        return
    }
    await generateReport()
    return res.redirect('/')
})

router.get('/getError', async function (req, res) {
    if (!req.session.loggedIn) {
        return res.redirect('login')
        return
    }
    await getError()
    return res.redirect('/')
})

module.exports = router
