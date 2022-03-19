const express = require('express')
const router = express.Router()

const logger = require('../scripts/logger')

const Group = require('../models/Group')

// Desc: Return information about a specific group at its mongo-assigned ID
// Route: GET /groups/id
router.get('/:id', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('login')
        return
    }
    try {
        const group = await Group.findById(req.params.id).lean()
        if (!group) {
            req.session.message = {
                type: 'warning',
                title: 'Group ID not recognized'
            }
            logger.warn('Group ID ' + req.params.id + ' not recognized')
            res.redirect('/')
        } else {
            res.render('group', {
                group
            })
        }
    } catch (err) {
        logger.error(err)
        return res.render('error/505')
    }
})

// Desc: The endpoint for POST requests to define a new printer group
// Route: POST /groups/add
router.post('/add', async (req, res) => {
    try {
        if (req.body.groupName == '' || req.body.groupName == null) {
            req.session.message = {
                type: 'danger',
                title: 'No name was entered'
            }
            logger.warn('No groupname entered')
            res.redirect('/')
        } else {
            await Group.create(req.body)
            req.session.message = {
                type: 'primary',
                message: 'Success!'
            }
            logger.info('Group ' + req.body.groupName + ' created')
            res.redirect('/')
        }
    } catch (err) {
        logger.error(err)
        return res.render('error/505')
    }
})

// Desc: The endpoint for DELETE requests to delete printer groups. Groups can only be deleted when they are empty.
// Route: DELETE /groups/:id
router.delete('/:id', async (req, res) => {
    try {
        const g = await Group.findById(req.params.id).lean()
        if (g.printers.length === 0) {
            await Group.deleteOne({ _id: req.params.id })
            req.session.message = {
                type: 'success',
                message: 'Success!'
            }
            logger.info('Deleted group ' + g.name)
            res.redirect('/')
        } else {
            req.session.message = {
                type: 'warning',
                title: 'There are still printers in this group!'
            }
            logger.warn('Attempted deletion of ' + g.name + ' but printers still exist within the group.')
            res.redirect('/')
        }
    } catch (err) {
        logger.error(err)
        return res.render('error/505')
    }
})

module.exports = router
