let snmp = require("snmp-native");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

function update() {

    var session = new snmp.Session({host: "172.17.19.243"});

    session.get({oid: [1,3,6,1,2,1,43,11,1,1,9,1,1]}, function(error, varbinds) {
        if (error) {
            console.log(error)
            console.log('Fail :(');
        } else {
            console.log(varbinds[0].oid + ' = ' + varbinds[0].value + ' (' + varbinds[0].type + ')');
        }
    })

    //session.close()
    
    // const tonerOids = ["1.3.6.1.2.1.43.11.1.1.9.1.1", "1.3.6.1.2.1.43.11.1.1.9.1.2", "1.3.6.1.2.1.43.11.1.1.9.1.3", "1.3.6.1.2.1.43.11.1.1.9.1.4", "1.3.6.1.2.1.43.11.1.1.9.1.5"]

}


module.exports = update