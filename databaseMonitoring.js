
const fs = require('fs');
const { exec } = require('child_process');
const mysql = require('mysql');
const config = require('./config/config.json');
const { writeErr } = require('./util/writeErr');
const { getCurrDate } = require('./util/getCurrDate');
const { alert, logValue } = require('./util/writeLog');

const defPath = config.defPath.directoryDatabase;
const connections = config.database;

for(let i = 0; i < connections.length; i++) {
    connections[i].errStatus = 0;
}

setInterval(() => {


    for (let i = 0; i < connections.length; i++) {

        const connection = mysql.createConnection(connections[i]);
        let start = Date.now();
        connection.connect();
        
        connection.query(connections[i].query, (err, results) => {
            let host = connections[i].host.split('.').join('-');
            if(err && connections[i].errStatus === 0) {
                connections[i].errStatus = 1;
                alert({fileName: 'databaseLog.txt', errList:[{message: `Error for ${connections[i].name}: ${err.message}`, src: `${connections[i].name}`}], bashToExecute: [connections[i].bash], sendMail: true});
            }
            else {
                connections[i].errStatus = 0;
            }
            let end = Date.now();
            let delay = end - start;
            if(results !== undefined){
                logValue({pathToDir: defPath, fileName: connections[i].name, value: delay, valueMin: 0, valueMax: config.time.database.slowResp, refreshRate: config.time.database.refresh/1000})
            }
        });

        connection.end();
    }


}, config.time.database.refresh); 