const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Groups = require('../models/Group')

router.get('/:id', async (req, res) => {
    try {
        let printer = await Printer.findById(req.params.id).lean()
        if (!printer){
            return res.render('error/404')
        } else {
            console.log(printer)
            res.render('printer', {
                printer,
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

module.exports = router