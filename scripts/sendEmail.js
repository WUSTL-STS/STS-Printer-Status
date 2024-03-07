const nodemailer = require('nodemailer')
const Printer = require('../models/Printer')
const fs = require('fs')
const util = require('util')
const config = require('../config/config')
const logger = require('../scripts/logger')

const appendLog = util.promisify(fs.appendFile)

// Function called by other scripts on a cron job
async function send () {
    if (!config.global_email) {
        return
    }
    // Look for errors within all the printers
    logger.info('Email script called. Querying printers from database.')
    const errors = await queryPrinters()
    // Create the nodemailer item that sends the emails
    const transport = nodemailer.createTransport({
        host: 'rsmtp.mx.wustl.edu',
        port: 587,
        secure: false
        // auth: {
        //     user: 'student.technology@wustl.edu',
        //     pass: process.env.EMAIL_PASS
        // }
    })
    // Iterate over the error json array and construct the string of html
    const date = new Date()
    for (const p in errors) {
        await appendLog('./logs/emails_weekly.csv', date.toString() + ',' + errors[p].contact.firstname + ' ' + errors[p].contact.lastname + ',' + p + '\n')
            .catch((error) => {
                logger.error('error writing to weekly email logfile' + error)
            })
        let html = '<h1>STS Printer Status Report</h1><p>' + errors[p].contact.firstname + ', the following problems ' +
            'have been detected with the ' + p + ' printer:</p><ul>'
        if (errors[p].toner) {
            for (const color in errors[p].toner) {
                if (errors[p].toner[color] !== null) {

                    if (color === undefined){
                        //do nothing if undefined
                    }
                    else{
                        html += '<li>The ' + color + ' toner is at ' + errors[p].toner[color] + '%.</li>'
                    }
                }
            }
        }
        if (errors[p].paper) {
            for (let tray = 0; tray < errors[p].paper.length; tray++) {
                if (errors[p].paper[tray] === 'Empty' && errors[p].paper[tray] !== null) {
                    html += '<li>Tray ' + (tray + 1) + ' empty.</li>'
                }
            }
        }
        logger.info(`Sending To ${errors[p].contact.email}`)
        html += '</ul><p>Please fix these issues when possible.</p>'
        try {
            const msg = await transport.sendMail({
                from: 'student.technology@wustl.edu',
                to: errors[p].contact.email,
                subject: 'STS Printer Status Alert',
                html: html
            })
            logger.info('Message sent: %s', msg.messageId)
        } catch (err) {
            logger.error(`error sending email to ${errors[p].contact.email} -- ${err}`)
        }
        logger.info('Finished sending emails')
    }

    /*
    This function constructs a JSON object based on whether the printer's toner and paper are empty.
    Example:
    {
      Myers: {
        toner: { Yellow: 15 },
        contact: {
            firstname: "Jack"
            lastname: "Heuberger"
            email: "jackheuberger@wustl.edu"
        }
      },
      Beaumont: { paper: { '4': 'Empty' }, contact: {...} },
      Shepley: { paper: { '1': 'Empty',  '4': 'Empty' }, contact: {...} }
    }
     */
    async function queryPrinters() {
        const printers = await Printer.find().populate('contact').lean()
        // Reference arrays. There should probably be a better way to edit these.
        const tonerRef = ['Black', 'Cyan', 'Magenta', 'Yellow', 'Fuser']
        const errors = []
        const tonerValue = 4
        // Iterate over all the printers
        for (let i = 0; i < printers.length - 1; i++) {
            if (printers[i].email === false) {
                continue
            }
            // For each printer, iterate over its stored toner values
            for (let tonerCount = 0; tonerCount < tonerValue; tonerCount++) {
                // If a printer has a toner value below 15 and the value is not -3 (given by the fuser (i think?))
                if (printers[i].toner[tonerCount] <= config.toner_email_percentage && printers[i].toner[tonerCount] !== '-3') {
                    // Create the JSON objects in case they don't already exist
                    if (!errors[printers[i].location]) {
                        errors[printers[i].location] = {}
                        errors[printers[i].location].toner = []
                        errors[printers[i].location].contact = printers[i].contact
                    }
                    // Write the data to the JSON object
                    errors[printers[i].location].toner[tonerRef[tonerCount]] = printers[i].toner[tonerCount]
                }
            }
            // For each printer, iterate over its paper values
            for (let paperCount = 0; paperCount < printers[i].paper.length; paperCount++) {
                // Write the value to the JSON object if the value is false.
                if (!printers[i].paper[paperCount]) {
                    if (!errors[printers[i].location]) {
                        errors[printers[i].location] = {}
                        errors[printers[i].location].contact = printers[i].contact
                    }
                    if (!errors[printers[i].location].paper) {
                        errors[printers[i].location].paper = []
                    }
                    errors[printers[i].location].paper[paperCount] = 'Empty'
                }
            }
        }
        return errors
    }
}

module.exports = send
