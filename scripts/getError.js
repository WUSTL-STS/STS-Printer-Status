const snmp = require('snmp-native')
const logger = require('./logger')

const Printer = require('../models/Printer')

let session // Create global session variable

// This is the function that's called in order to update the values
async function getError () {
    try {
        const printers = await Printer.find() // Get a list of all the printers and iterate over them
        i = 0
        logger.info('attempting query for ' + printers[i].location)
            try {
                //checkpoint1
                logger.info(session = new snmp.Session({ host: printers[i].url, timeouts: [8000] })) // Create new SNMP session
                session = new snmp.Session({ host: printers[i].url, timeouts: [8000] })
                logger.info('Past Error Checkpoint 1')
                //checkpoint2
                const toner = await fetchToner(printers[i].location)
                logger.info('Past Error Checkpoint 2')
                //checkpoint3
                logger.info('Past Error Checkpoint 3')
                printers[i].set('toner', toner)
                await printers[i].save()
                logger.info('successfully queried ' + printers[i].location)
            } catch (err) {
                logger.error(printers[i].location + ' ' + err)
                printers[i].set('toner', [0,0,0,0,0,0,0,0])
                printers[i].set('paper', [0,0,0,0])
                await printers[i].save()
            }
        
        logger.info('Finished updating printer values')
    } catch (err) {
        logger.error('scripts/updatePrinters updateValues ' + err)
    }
}

// Returns an array of length 8 representing all of the toner values. See /models/Printer
function fetchToner (location) {

    logger.info(`attempting toner fetch for ${location}`)

    return new Promise((resolve, reject) => {

        logger.info('creating new array for error')

        const toner = new Array(8)
        logger.info('getting subtree for error')

        logger.info(
        session.getSubtree({ oid: [1, 3, 6, 1, 2, 1, 43, 11, 1, 1, 9, 1]}, function (error, varbinds) {
            
            logger.info('error subtree generated')

            // If error, reject the promise
            if (error) {
                logger.error("error fetching toner for " + location + " " + error)
                reject(error)
            } else {
                // Create the array and resolve the promise using the array
                for (let i = 0; i < varbinds.length; i++) {
                    toner[i] = parseInt(varbinds[i].value)
                }
                logger.info(`toner fetch for ${location} successful: ${toner}`)
                resolve(toner)
            }
        }))
    })
}



module.exports = getError
