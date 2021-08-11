
const zmq = require('zeromq');
const config = require('./config/config.json');
const { alert, logValue } = require('./util/writeLog');

const IPlist = config.zmq;
let zmqSock = [];
let nbOfResp = [];
let errList = [];
let bash = [];

function checkZmq() {

    for (let i = 0; i < IPlist.length; i++) {
        logValue({ pathToDir: config.defPath.directoryZmq, fileName: IPlist[i].name, valueMin: config.fileConfig.minZmq, valueMax: config.fileConfig.maxZmq, refreshRate: config.time.zmq.refresh / 1000, value: nbOfResp[i] });
        nbOfResp[i] = 0;
    }

    if (errList.length > 0) {
        alert({ errList: errList, fileName: 'zmqLog', bashToExecute: bash, sendMail: true });
        errList = [];
        bash = [];
    }

}

for (let i = 0; i < IPlist.length; i++) {

    zmqSock[i] = zmq.socket('sub');
    zmqSock[i].connect(IPlist[i].IP);
    zmqSock[i].subscribe('');
    nbOfResp[i] = 0;

    let name = IPlist[i].name;

    let timer = setTimeout(() => {
        errList.push({
            message: `${name} took too long to respond ( ͡° ʖ̯ ͡°)`,
            src: name
        });
        bash.push(IPlist[i].bash)
    }, config.time.zmq.slowResp);

    zmqSock[i].on('message', () => {
        nbOfResp[i]++;
        clearTimeout(timer);
        timer = setTimeout(() => {
            errList.push({
                message: `${name} took too long to respond ( ͡° ʖ̯ ͡°)`,
                src: name
            });
            bash.push(IPlist[i].bash)
        }, config.time.zmq.slowResp);
    });
}

setInterval(checkZmq, config.time.zmq.refresh);
