const nodemailer = require('nodemailer')
const config = require('../config/config')

async function generateReport () {
    const transport = await nodemailer.createTransport({
        host: 'outlook.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'student.technology@go.wustl.edu',
            pass: config.pwd
        }
    })
    const msg = await transport.sendMail({
        from: 'student.technology@wustl.edu',
        to: 'jackheuberger@wustl.edu',
        subject: 'STS Weekly Printer Status Report',
        attachments: [
            {
                filename: 'report.csv',
                content: '../log/emails_weekly.csv'
            }
        ],
        text: 'Attached is the weekly status report for STS-managed printers'
    })
    console.log('Message sent: %s', msg.messageId)
}

module.exports = generateReport
