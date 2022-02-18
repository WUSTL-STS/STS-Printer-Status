const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', (req, res) => {
    if (req.password === process.env.PWD) {
        res.session.login = true
        res.redirect('/')
    }
})

module.exports = router
