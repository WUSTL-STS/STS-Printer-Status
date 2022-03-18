const express = require('express')

const config = require('../config/config')

const router = express.Router()

router.get('/', (req, res) => {
    if (process.env.DEPLOY !== 'docker') {
        req.session.loggedIn = true
        res.redirect('/')
    }
    res.render('login')
})

router.post('/', (req, res) => {
    if (req.body.password === process.env.SITE_PASS) {
        req.session.loggedIn = true
        res.redirect('/')
    } else {
        res.render('login')
    }
})

module.exports = router
