const fs = require('fs')

const Group = require('../models/Group')

async function generateTable () {
  console.log('Generating table...')
  const groups = await Group.find({}).populate({ path: 'printers', populate: { path: 'contact' } })
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i]
    // Add bootstrap, set up the table head
    let table = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"><table class="table table-striped"><tbody><tr><th colspan="100" style="text-align: center">' + g.groupName + '</th></tr><tr><th>Location</th><th>Black</th><th>Cyan</th><th>Magenta</th><th>Yellow</th><th>Fuser</th><th>Tray2</th><th>Tray3</th><th>Tray4</th><th>Tray5</th><th>Status</th><th>Model</th></tr>'
    // Add message if there are no printers in the group
    if (g.printers.length === 0) {
      table += '<tr class="table-warning"><th colspan="100" style="text-align: center">There are no printers in this group!</th></tr>'
    } else {
      // I decided to use for loops because it was significantly cleaner looking than putting everything on one giant line
      for (const p of g.printers) {
        table += '<tr><th scope="row">' + p.location + '</th>'
        // As of now, toner length should be 5!
        // It's actually not, we just only want to print the first 5 values
        for (let i = 0; i < 5; i++) {
          if (p.toner[i] === undefined) {
            // Add warning if we couldn't pull data from a printer section
            table += '<td class="table-warning">UNKNOWN</td>'
          } else {
            // Make the cell red if it's <=10%
            if (p.toner[i] <= 20) {
              table += '<td class="table-danger">'
            } else {
              table += '<td>'
            }
            table += p.toner[i] + '%</td>'
          }
        }
        // Paper length should be 4
        for (let i = 0; i < p.paper.length; i++) {
          if (p.paper[i] === undefined) {
            table += '<td class="table-warning">UNKNOWN</td>'
          } else {
            // Make the cell red if the paper is empty
            if (p.paper[i] == false) {
              table += '<td class="table-danger">'
            } else {
              table += '<td>'
            }
            table += p.paper[i] + '</td>'
          }
        }
        table += '<td>' + (p.status == null ? '' : p.status) + '</td>'
        table += '<td>' + p.model + '</td>'
      }
    }

    table += '</tbody></table>'
    // Write the file to the /public/tables directory
    fs.writeFile('./public/tables/' + g.groupName + '.html', table, (err) => {
      if (err) { throw err }
      console.log('---Finished Generating File---')
    })
  }
}
module.exports = generateTable
