const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group')

router.get('/:id', async (req, res) => {
    try {
        let group = await Group.findById(req.params.id).lean()
        if (!group) {
            return res.render('error/404')
        } else {
            res.render('group', {
                group,
            })
        }
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

router.post('/add', async (req, res) => {
    try {
        if (req.body.groupName == '' || req.body.groupName == null) {
            return res.render('error/505')
        } else {
            await Group.create(req.body)
            res.redirect('/')
        }
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

module.exports = router