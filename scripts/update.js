let snmp = require("snmp-native");

const Printer = require('../models/Printer')

let session;

async function updateValues() {
    let printers = await Printer.find();
    for(let i = 0; i < printers.length; i++){
        session = new snmp.Session({host: printers[i].url})
        let toner = await fetchToner()
        let paper = await fetchPaper()
        console.log(toner)
        console.log(paper)
        printers[i].set("toner", toner)
        printers[i].set("paper", paper)
        await printers[i].save()
    }
}

function fetchToner() {
    return new Promise((resolve, reject) => {
        let toner = new Array(8)
        session.getSubtree({oid: [1,3,6,1,2,1,43,11,1,1,9,1]}, function(error, varbinds) {
            if(error){
                console.error(error)
                reject(error)
            } else {
                for(let i = 0; i < varbinds.length; i++){
                    // console.log(varbinds[i].value)
                    toner[i] = parseInt(varbinds[i].value)
                }
                resolve(toner)
            }
        })
    })
}

function fetchPaper() {
    return new Promise(((resolve, reject) => {
        let paper = new Array(4)
        session.getSubtree({oid: [1,3,6,1,2,1,43,8,2,1,10]}, (error, varbinds) => {
            if(error){
                console.error(error)
                reject(error)
            } else {
                //5 total tray varbinds, first is for bypass so we don't need it
                for(let i = 1; i < varbinds.length; i++){
                    paper[i - 1] = varbinds[i].value == "-3";
                }
                resolve(paper)
            }
        })
    }))
}
    // const tonerOids = ["1,3.6.1.2.1.43.11.1.1.9.1.1", "1.3.6.1.2.1.43.11.1.1.9.1.2", "1.3.6.1.2.1.43.11.1.1.9.1.3", "1.3.6.1.2.1.43.11.1.1.9.1.4", "1.3.6.1.2.1.43.11.1.1.9.1.5"]
module.exports = updateValues