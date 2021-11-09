let fs = require('fs')

function generateTable(g) {
    console.log(g.groupName)
    fs.writeFile("./public/tables/" + g.groupName + ".html", "Hello World!", (err) => {
        if (err)
            throw err
        console.log('saved!')
    })
}
module.exports = generateTable