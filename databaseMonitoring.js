
const mysql = require('mysql');
const fs = require('fs');
const config = require('./config/config.json');
const { writeErr } = require('./util/writeErr');
const { getCurrDate } = require('./util/getCurrDate');

const defPath = config.defPath.directoryDatabase;
const connections = config.connections;

setInterval(() => {
    for (let i = 0; i < connections.length; i++) {

        const connection = mysql.createConnection(connections[i]);
        let start = Date.now();
        connection.connect();
        
        connection.query(connections[i].query, (err, results) => {
            let host = connections[i].host.split('.').join('-');
            if(err) writeErr({fileName: 'databaseLog.txt', src: `${host}_${connections[i].database}`, text:`Error for ${host}_${connections[i].database}: ${err.message}`});
            let end = Date.now();
            let delay = end - start;
            if(results !== undefined){
                fs.writeFileSync(`${defPath}/${host}_${connections[i].database}.0.${config.time.slowResp}.${config.time.timeout}.txt`, `${getCurrDate()};${delay}\n`, {flag: 'a'});
            }
        });

        connection.end();
    }
}, config.time.refresh); 