const snmp = require('snmp-native')
const logger = require('../scripts/logger')

const Printer = require('../models/Printer')

let session // Create global session variable

// This is the function that's called in order to update the values
async function updateValues () {
    try {
        const printers = await Printer.find() // Get a list of all the printers and iterate over them
        for (let i = 0; i < printers.length; i++) {
            try {
                session = new snmp.Session({ host: printers[i].url, timeouts: [1000, 2000, 4000, 8000] }) // Create new SNMP session
                const toner = await fetchToner()
                const paper = await fetchPaper()
                printers[i].set('toner', toner)
                printers[i].set('paper', paper)
                await printers[i].save()
                logger.info('successfully queried ' + printers[i].location)
            } catch (err) {
                logger.error(printers[i].location + ' ' + err)
            }
        }
        logger.info('Finished updating printer values')
    } catch (err) {
        logger.error('scripts/updatePrinters updateValues ' + err)
    }
}

// Returns an array of length 8 representing all of the toner values. See /models/Printer
function fetchToner () {
    return new Promise((resolve, reject) => {
        const toner = new Array(8)
        session.getSubtree({ oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1] }, function (error, varbinds) {
            // If error, reject the promise
            if (error) {
                reject(error)
            } else {
                // Create the array and resolve the promise using the array
                for (let i = 0; i < varbinds.length; i++) {
                    toner[i] = parseInt(varbinds[i].value)
                }
                resolve(toner)
            }
        })
    })
}

// Returns an array of length 4 representing paper tray fill
function fetchPaper () {
    return new Promise((resolve, reject) => {
        const paper = new Array(4)
        session.getSubtree({ oid: [1, 3, 6, 1, 2, 1, 43, 8, 2, 1, 10] }, (error, varbinds) => {
            if (error) {
                reject(error)
            } else {
                // 5 total tray varbinds, first is for bypass -- can be ignored
                for (let i = 1; i < varbinds.length; i++) {
                    // eslint-disable-next-line eqeqeq
                    paper[i - 1] = varbinds[i].value == '-3'
                }
                resolve(paper)
            }
        })
    })
}

module.exports = updateValues
