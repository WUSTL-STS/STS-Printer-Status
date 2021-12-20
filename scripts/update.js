let snmp = require("net-snmp");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

function update() {

    let session = snmp.createSession("172.17.19.243");

    // const tonerOids = ["1.3.6.1.2.1.43.11.1.1.9.1.1", "1.3.6.1.2.1.43.11.1.1.9.1.2", "1.3.6.1.2.1.43.11.1.1.9.1.3", "1.3.6.1.2.1.43.11.1.1.9.1.4", "1.3.6.1.2.1.43.11.1.1.9.1.5"]
    const tonerOids = ["1.3.6.1.2.1.43.11.1.1.9.1.1"]
    console.log("Running get on 172.17.19.243")
    session.get(tonerOids, (error, varbinds) => {
        if (error) {
            console.error(error.toString());
        } else {
            for (let i = 0; i < varbinds.length; i++) {
                // for version 1 we can assume all OIDs were successful
                console.log(varbinds[i].oid + "|" + varbinds[i].value);
            }
        }
    })

    session.close()
}

module.exports = update