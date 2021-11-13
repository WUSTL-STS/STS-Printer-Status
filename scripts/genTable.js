let fs = require('fs')

function generateTable(g) {
    let table = "<table><tbody><tr><th colspan=\"100\" alighn=\"center\">" + g.groupName + "</th></tr><tr><th>Location</th><th>Black</th><th>Cyan</th><th>Magenta</th><th>Yellow</th><th>Fuser</th><th>Tray2</th><th>Tray3</th><th>Tray4</th><th>Tray5</th><th>Status</th><th>Model</th></tr>"
    if (g.printers.length == 0) {
        table += "<tr><th colspan=\"100\" alighn=\"center\">There are no printers in this group!</th></tr>"
    } else {
        for (let p of g.printers) {
            table += "<tr><td>" + p.location + "</td>"
            for (let i = 0; i < p.toner.length; i++) {
                table += "<td>" + (p.toner[i] === undefined ? "UNKNOWN" : p.toner[i]) + "</td>";
            }
            for (let i = 0; i < p.paper.length; i++) {
                table += "<td>" + (p.toner[i] === undefined ? "UNKNOWN" : p.toner[i]) + "</td>";
            }
            table += "<td>" + p.status + "</td>"
            table += "<td>" + p.model + "</td>"
        }
    }

    table += "</tbody></table>"
    fs.writeFile("./public/tables/" + g.groupName + ".html", table, (err) => {
        console.log(g)
        if (err)
            throw err
        console.log('Created file!')
    })

}
module.exports = generateTable