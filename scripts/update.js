let snmp = require("snmp-native");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const generateTable = require('./genTable')
const promisify = require('util').promisify

const Printer = require('../models/Printer')
const Group = require('../models/Group')



async function updateValues(){
    let printers = await Printer.find();
    printers.forEach(function (printer) {

        let session = new snmp.Session({ host: printer.url })
        const TonerReq = promisify(session.getSubtree)
        TonerReq({oid: [1,3,6,1,2,1,43,11,1,1,9,1]}).then(varbinds =>{
            varbinds.forEach(function (vb) {
                console.log(vb.oid + ' = ' + vb.value + ' (' + vb.type + ')');
            });
        }).catch(error => console.error(error))
        // console.log(printer.location + "paper:")
        // let paper = requestPaper(printer.url)

        //await printer.save()
    })
}



async function requestToner(ip) {
    var session = new snmp.Session({ host: ip });
    console.log("requested")
    TonerReq 
}

function parseToner(error, varbinds) {
    if (error) {
        console.log('Fail :(');
    } else {
        varbinds.forEach(function (vb) {
            console.log(vb.oid + ' = ' + vb.value + ' (' + vb.type + ')');
        });
    }
}

async function requestPaper(ip) {
    let paper = new Array()
    var session = new snmp.Session({ host: ip });
    //This function gets the entire subtree for that OID, which contains more info than we need. We store it anyways!
    session.getSubtree({oid: [1,3,6,1,2,1,43,8,2,1,10]}, function(error, varbinds) {
        if (error) {
            console.error(error)
            session.close();
            return null;
        } else {
                for(let i = 0; i < varbinds.length; i++){
                    console.log(varbinds[i].oid + ' = ' + varbinds[i].value + ' (' + varbinds[i].type + ')');
                }
        }        
    })
}

    
    // const tonerOids = ["1,3.6.1.2.1.43.11.1.1.9.1.1", "1.3.6.1.2.1.43.11.1.1.9.1.2", "1.3.6.1.2.1.43.11.1.1.9.1.3", "1.3.6.1.2.1.43.11.1.1.9.1.4", "1.3.6.1.2.1.43.11.1.1.9.1.5"]
module.exports = updateValues