const nodemailer = require('nodemailer')
const logger = require('../scripts/logger')
const fs = require('fs')

async function generateReport () {
    const transport = nodemailer.createTransport({
        host: 'rsmtp.mx.wustl.edu',
        port: 587,
        secure: false
        // auth: {
        //     user: 'student.technology@go.wustl.edu',
        //     pass: process.env.EMAIL_PASS
        // }
    })
    try {
        const msg = await transport.sendMail({
            from: 'student.technology@wustl.edu',
            to: process.env.REPORT_TARGET,
            subject: 'STS Weekly Printer Status Report',
            attachments: [
                {
                    filename: 'report.csv',
                    content: fs.createReadStream('./logs/emails_weekly.csv')
                }
            ],
            text: 'Attached is the weekly status report for STS-managed printers'
        })
        logger.info('Message sent: ' + msg.messageId)
    } catch (err) {
        logger.error('error sending email to ' + process.env.REPORT_TARGET + ' -- ' + err)
    }
}

module.exports = generateReport
