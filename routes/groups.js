const express = require('express');
const router = express.Router();

const Printer = require('../models/Printer')
const User = require('../models/User')
const Group = require('../models/Group')

// Desc: Return information about a specific group at its mongo-assigned ID
// Route: GET /groups/id
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

// Desc: The endpoint for POST requests to define a new printer group
// Route: POST /groups/add
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

// Desc: The endpoint for DELETE requests to delete printer groups. Groups can only be deleted when they are empty.
// Route: DELETE /groups/:id
router.delete('/:id', async (req, res) => {
    try {
        let g = await Group.findById(req.params.id).lean();
        if(g.printers.length == 0){
            await Group.deleteOne({ _id: req.params.id })
            res.redirect('/')
        } else {
            console.log("There are still printers in this group!")
        }
    } catch (err) {
        console.log(err)
        return res.render('error/505')
    }
})

module.exports = router