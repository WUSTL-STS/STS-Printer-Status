let fs = require('fs')

function generateTable(g) {

    let table = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\"><table class=\"table table-striped\"><tbody><tr><th colspan=\"100\" style=\"text-align: center\">" + g.groupName + "</th></tr><tr><th>Location</th><th>Black</th><th>Cyan</th><th>Magenta</th><th>Yellow</th><th>Fuser</th><th>Tray2</th><th>Tray3</th><th>Tray4</th><th>Tray5</th><th>Status</th><th>Model</th></tr>"
    if (g.printers.length == 0) {
        table += "<tr class=\"table-warning\"><th colspan=\"100\" style=\"text-align: center\">There are no printers in this group!</th></tr>"
    } else {
        for (let p of g.printers) {
            table += "<tr><th scope=\"row\">" + p.location + "</th>"
            for (let i = 0; i < p.toner.length; i++) {
                if (p.toner[i] === undefined) {
                    table += "<td class=\"table-warning\">UNKNOWN</td>"
                } else {
                    if (p.toner[i] <= 10) {
                        table += "<td class=\"table-danger\">"
                    } else {
                        table += "<td>"
                    }
                    table += p.toner[i] + "</td>"

                }
            }
            for (let i = 0; i < p.paper.length; i++) {
                if (p.paper[i] === undefined) {
                    table += "<td class=\"table-warning\">UNKNOWN</td>"
                } else {
                    if (p.paper[i] == false) {
                        table += "<td class=\"table-danger\">"
                    } else {
                        table += "<td>"
                    }
                    table += p.paper[i] + "</td>"

                }
            }
            table += "<td>" + (p.status == null ? "" : p.status) + "</td>"
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