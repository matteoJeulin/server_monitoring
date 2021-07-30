
const fs = require('fs');
const { exec } = require('child_process');
const mysql = require('mysql');
const config = require('./config/config.json');
const { writeErr } = require('./util/writeErr');
const { getCurrDate } = require('./util/getCurrDate');

const defPath = config.defPath.directoryDatabase;
const connections = config.connections;

for(let i = 0; i < connections.length; i++) {
    connections[i].errStatus = 0;
}

setInterval(() => {

    let connectionsUpdated = connections;

    for (let i = 0; i < connections.length; i++) {

        const connection = mysql.createConnection(connections[i]);
        let start = Date.now();
        connection.connect();
        
        connection.query(connections[i].query, (err, results) => {
            let host = connections[i].host.split('.').join('-');
            if(err && connections[i].errStatus === 0) {
                connectionsUpdated[i].errStatus = 1;
                writeErr({fileName: 'databaseLog.txt', src: `${host}_${connections[i].database}`, text:`Error for ${host}_${connections[i].database}: ${err.message}`});
                exec(connections[i].bash);
            }
            else {
                connectionsUpdated[i].errStatus = 0;
            }
            let end = Date.now();
            let delay = end - start;
            if(results !== undefined){
                fs.writeFileSync(`${defPath}/${host}_${connections[i].database}.0.${config.time.slowResp}.${config.time.timeout}.txt`, `${getCurrDate()};${delay}\n`, {flag: 'a'});
            }
        });

        connection.end();
    }

    connections = connectionsUpdated;

}, config.time.refresh); 