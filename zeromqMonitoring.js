
const zmq = require('zeromq');
const fs = require('fs'); 
const { exec } = require('child_process');

const config = require('./config/config.json');
const { alert } = require('./util/alert');
const { getCurrDate } = require('./util/getCurrDate');

const IPlist = config.IPlist;
let zmqSock = [];
let nbOfResp = [];

for(let i = 0; i < IPlist.length; i++) {
    zmqSock[i] = zmq.socket('sub');
    zmqSock[i].connect(IPlist[i].IP);
    zmqSock[i].subscribe('');
    nbOfResp[i] = 0; 

    let timer = setTimeout(() => {
        alert([`${IPlist[i].IP} took too long to respond ( ͡° ʖ̯ ͡°)`], IPlist[i].IP, 'zmqLog');
        exec(IPlist[i].bash);
    },config.time.slowResp);

    zmqSock[i].on('message', () => {
        nbOfResp[i]++;
        clearTimeout(timer);
        timer = setTimeout(() => {
            alert([`${IPlist[i].IP} took too long to respond ( ͡° ʖ̯ ͡°)`], IPlist[i].IP, 'zmqLog');
            exec(IPlist[i].bash);
        },config.time.slowResp);
    });
}

setInterval(() => {
    for(let i = 0; i < IPlist.length; i++) {
        let fileName = IPlist[i].IP.split('/');
        fileName.shift();
        fileName.shift();
        fileName = fileName.join('-').split('.').join('-').split(':').join('-');
        fs.writeFileSync(`${config.defPath.directoryZmq}/${fileName}.${config.fileConfig.minZmq}.${config.fileConfig.maxZmq}.${config.time.timeout}.txt`, `${getCurrDate()};${nbOfResp[i]}\n`, {flag: 'a'});
        nbOfResp[i] = 0;
    }
}, config.time.refresh);