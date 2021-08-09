
const mysql = require('mysql');
const config = require('./config/config.json');
const { alert, logValue } = require('./util/writeLog');

const defPath = config.defPath.directoryDatabase;
const connections = config.connection;

for(let i = 0; i < connections.length; i++) {
    connections[i].errStatus = 0;
}

function checkConnection() {
    for (let i = 0; i < connections.length; i++) {

        const connection = mysql.createConnection(connections[i]);
        connection.connect();
        
        connection.query(connections[i].query, (err, results) => {
            if (!results && connections[i].errStatus === 0) {
                connections[i].errStatus = 1;
                alert({fileName: 'databaseLog', errList:[{message: `Error for ${connections[i].name}: No response`, src: `${connections[i].name}`}], sendMail: true});
            }
            if(err && connections[i].errStatus === 0) {
                connections[i].errStatus = 1;
                alert({fileName: 'databaseLog', errList:[{message: `Error for ${connections[i].name}: ${err.message}`, src: `${connections[i].name}`}], sendMail: true});
            }
            else {
                connections[i].errStatus = 0;
            }
            
            if(results !== undefined){
                let value = results[0][connections[i].query.split(' ')[1]];
                logValue({pathToDir: defPath, fileName: connections[i].name, value: value, valueMin: 0, valueMax: config.time.database.slowResp, refreshRate: config.time.database.refresh/1000})
            }
        });

        connection.end();
    }

}

setInterval(checkConnection, config.time.database.refresh);
checkConnection();