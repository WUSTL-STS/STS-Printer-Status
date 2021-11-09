let fs = require('fs')

function generateTable(g) {
    console.log(g.groupName)
    fs.open("./output/" + g.groupName + ".html", "w", (err, file) => {
        if (err)
            throw err
        console.log('saved!', file)
    })
}
module.exports = generateTable