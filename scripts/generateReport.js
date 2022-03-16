const nodemailer = require('nodemailer')
const fs = require('fs')

async function generateReport () {
    const transport = await nodemailer.createTransport({
        host: 'outlook.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'student.technology@go.wustl.edu',
            pass: process.env.EMAIL_PASS
        }
    })
    const msg = await transport.sendMail({
        from: 'student.technology@wustl.edu',
        to: process.env.REPORT_TARGET,
        subject: 'STS Weekly Printer Status Report',
        attachments: [
            {
                filename: 'report.csv',
                content: fs.createReadStream('./log/emails_weekly.csv')
            }
        ],
        text: 'Attached is the weekly status report for STS-managed printers'
    })
    console.log('Message sent: %s', msg.messageId)
}

module.exports = generateReport
