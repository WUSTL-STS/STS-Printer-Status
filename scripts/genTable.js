const fs = require('fs')
const logger = require('./logger')
const config = require('../config/config')

const Group = require('../models/Group')

const moment = require('moment-timezone')

async function generateTable() {
    console.log('generating table')
    const groups = await Group.find({}).populate({ path: 'printers', populate: { path: 'contact' }, options: { sort: { location: 1 } } })
    for (let i = 0; i < groups.length; i++) {
        const g = groups[i]
        const time = moment().tz('America/Chicago').format()
        // Add bootstrap, set up the table head
        let table = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"><table class="table table-striped"><tbody><tr><th colspan="100" style="text-align: center">' + g.groupName + ' - ' + time + '</th></tr><tr><th>Location</th><th>Black</th><th>Cyan</th><th>Magenta</th><th>Yellow</th><th>Fuser</th><th>Tray2</th><th>Tray3</th><th>Tray4</th><th>Tray5</th><th>Status</th><th>Model</th><th>Service Tag</th></tr>'
        // Add message if there are no printers in the group
        if (g.printers.length === 0) {
            table += '<tr class="table-warning"><th colspan="100" style="text-align: center">There are no printers in this group!</th></tr>'
        } else {
            // I decided to use for loops because it was significantly cleaner looking than putting everything on one giant line
            for (const p of g.printers) {
                table += '<tr><th scope="row">' + p.location + '</th>'

                // As of now, toner length should be 5 for COLOR PRINTERS!
                // It's actually not, we just only want to print the first 5 values
                for (let i = 0; i < 5; i++) {
                    // Handle BW printers. index 0 is toner, index 1 is maintenance kit
                    if (p.model == 'M605' || p.model == 'M608') {
                        // Make the cell red if it's <= a % set config.js
                        if (p.toner[0] <= config.table_red_threshold) {
                            table += '<td class="table-danger">'
                        } else {
                            table += '<td>'
                        }
                        table += p.toner[i] + '%</td><td class="table-warning">N/A</td><td class="table-warning">N/A</td><td class="table-warning">N/A</td><td class="table-warning">N/A</td>'
                        break
                    }

                    if (p.toner[i] === null) {
                        // Add warning if we couldn't pull data from a printer section
                        table += '<td class="table-warning">N/A</td>'
                    } else {
                        // Make the cell red if it's <= a % set config.js
                        if (p.toner[i] <= config.table_red_threshold) {
                            table += '<td class="table-danger">'
                        } else {
                            table += '<td>'
                        }
                        table += p.toner[i] + '%</td>'
                    }
                }
                // Paper length should be 4
                for (let i = 0; i < p.paper.length; i++) {
                    if (p.paper[i] === null) {
                        table += '<td class="table-warning">N/A</td>'
                    } else {
                        // Make the cell red if the paper is empty
                        if (p.paper[i] == false) {
                            table += '<td class="table-danger">Empty'
                        } else {
                            table += '<td>Filled'
                        }
                        table += '</td>'
                    }
                }
                table += '<td>' + (p.status == null ? '' : p.status) + '</td>'
                table += '<td>' + p.model + '</td>'
                table += '<td>' + p.tag + '</td>'
            }
        }

        table += '</tbody></table>'
        // Write the file to the /public/tables directory
        fs.writeFile('./public/tables/' + (g.groupName).replace(/ /g, '') + '.html', table, (err) => {
            if (err) { throw err }
            logger.info('Finished generating table for ' + g.groupName)
        })
    }
}
module.exports = generateTable
