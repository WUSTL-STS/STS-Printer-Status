const nodemailer = require('nodemailer')
const Printer = require('../models/Printer')

async function send(){
    let errors = await queryPrinters();
    console.log(errors)
    let transport = nodemailer.createTransport({
        host: "outlook.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: "student.technology@go.wustl.edu",
            pass: process.env.PWD
        }
    })
    for(p in errors) {
        let html = "<h1>STS Printer Status Report</h1><p>" + errors[p].contact.firstname + ", the following problems " +
            "have been detected with the " + p + " printer:</p><ul>"
        if(errors[p].toner){
            for(color in errors[p].toner){
                html += "<li>The " + color + " toner is at " + errors[p].toner[color] + "%.</li>"
            }
        }
        if(errors[p].paper){
            for(let tray = 0; tray < errors[p].paper.length; tray++){
                if(errors[p].paper[tray] === 'Empty'){
                    html += "<li>Tray " + (tray + 1) + " empty.</li>"
                }
            }
        }
        html += "</ul><p>Please fix these issues when possible.</p>"
        let msg = await transport.sendMail({
            from: "student.technology@wustl.edu",
            to: "jackheuberger@wustl.edu",
            subject: "STS Printer Status Alert",
            html: html,
        })
        console.log("Message sent: %s", msg.messageId);
    }
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
async function queryPrinters(){
    let printers = await Printer.find().populate('contact').lean()
    const tonerRef = ['Black', 'Cyan', 'Magenta', 'Yellow', 'Fuser', 'Status', 'feeder?', 'img?']
    const paperRef = ['Tray 2', 'Tray 2', 'Tray 2', 'Tray 2']
    let errors = [];
    //Iterate over all the printers
    for(let i = 0; i < printers.length; i++){
        console.log(printers[i].email)
        if(printers[i].email === false){
            continue;
        }
        //For each printer, iterate over its stored toner values
        for(let tonerCount = 0; tonerCount < printers[i].toner.length; tonerCount++){
            //If a printer has a toner value below 15 and the value is not -3 (given by the
            if(printers[i].toner[tonerCount] <= 15 && printers[i].toner[tonerCount] != '-3'){
                if(!errors[printers[i].location]){
                    errors[printers[i].location] = {}
                    errors[printers[i].location].toner = []
                    errors[printers[i].location]['contact'] = printers[i].contact
                }
                errors[printers[i].location].toner[tonerRef[tonerCount]] = printers[i].toner[tonerCount]
            }
        }
        console.log("Checking paper for " + printers[i].location)
        for(let paperCount = 0; paperCount < printers[i].paper.length; paperCount++){

            if(!printers[i].paper[paperCount]){
                if(!errors[printers[i].location]){
                    errors[printers[i].location] = {}
                    errors[printers[i].location]['contact'] = printers[i].contact
                }
                if(!errors[printers[i].location].paper) {
                    errors[printers[i].location].paper = []
                }
                errors[printers[i].location].paper[paperCount] = "Empty"
            }
        }
    }
    return errors;
}

module.exports = send