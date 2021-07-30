
const zmq = require('zeromq');
const config = require('./config/config.json');
const { alert } = require('./util/alert');
const fs = require('fs'); 
const { getCurrDate } = require('./util/getCurrDate');

const IPlist = config.IPlist;
let zmqSock = [];
let nbOfResp = [];

for(let i = 0; i < IPlist.length; i++) {
    zmqSock[i] = zmq.socket('sub');
    zmqSock[i].connect(IPlist[i]);
    zmqSock[i].subscribe('');
    nbOfResp[i] = 0; 

    let timer = setTimeout(() => {
        alert([`${IPlist[i]} took too long to respond ( ͡° ʖ̯ ͡°)`], IPlist[i], 'zmqLog');
    },config.time.slowResp);

    zmqSock[i].on('message', () => {
        nbOfResp[i]++;
        clearTimeout(timer);
        timer = setTimeout(() => {
            alert([`${IPlist[i]} took too long to respond ( ͡° ʖ̯ ͡°)`], IPlist[i], 'zmqLog');
        },config.time.slowResp);
    });
}

setInterval(() => {
    for(let i = 0; i < IPlist.length; i++) {
        let fileName = IPlist[i].split('/');
        fileName.shift();
        fileName.shift();
        fileName = fileName.join('-').split('.').join('-').split(':').join('-');
        fs.writeFileSync(`${config.defPath.directoryZmq}/${fileName}.${config.fileConfig.minZmq}.${config.fileConfig.maxZmq}.${config.time.timeout}.txt`, `${getCurrDate()};${nbOfResp[i]}\n`, {flag: 'a'});
        nbOfResp[i] = 0;
    }
}, config.time.refresh);