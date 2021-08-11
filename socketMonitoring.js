
const io = require('socket.io-client');

const { alert, logValue } = require('./util/writeLog');
const config = require('./config/config.json');

let sockets = config.sockets;
let nbConnected = [];
let errList = [];
let bash = [];

function checkSocket() {
    for (let i = 0; i < sockets.length; i++) {
        logValue({ pathToDir: config.defPath.directorySocket, fileName: sockets[i].name, valueMin: config.fileConfig.minSocket, valueMax: config.fileConfig.maxSocket, refreshRate: config.time.sockets.refresh / 1000, value: nbConnected[i] });
        nbConnected[i] = 0;
    }
    if (errList.length > 0) {
        alert({ errList: errList, fileName: 'websocketLog', sendMail: true, bashToExecute: bash });
        errList = [];
        bash = [];
    }
}

for (let i = 0; i < sockets.length; i++) {

    nbConnected[i] = 0;
    let name = sockets[i].name;
    let stream = sockets[i].stream;

    let socket = io(sockets[i].site, { transports: ["websocket"] });
    socket.on('connect', () => {
        socket.emit('joinStream', stream);
        alert({ fileName: 'websocketLog', errList: [{ message: `Connected to ${name}, stream: ${stream}`, src: name }], sendMail: false });
    });
    let timer = setTimeout(() => {
        errList.push({
            message: `${name}, stream: ${stream}, took too long to respond`,
            src: sockets[i].name
        })

        bash.push(sockets[i].bash);
    }, config.time.sockets.slowResp);

    socket.on('price_update', (dataFromServer) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            errList.push({
                message: `${name}, stream: ${stream}, took too long to respond`,
                src: sockets[i].name
            })
            bash.push(sockets[i].bash);
        }, config.time.sockets.slowResp);

    });

    socket.on('number_connected', (data) => {
        let object = JSON.parse(data);
        let nb = object.nb;
        nbConnected[i] = Math.max(nb, nbConnected[i]);

        clearTimeout(timer);
        timer = setTimeout(() => {
            errList.push({
                message: `${name}, stream: ${stream}, took too long to respond`,
                src: sockets[i].name
            })
            bash.push(sockets[i].bash);
        }, config.time.sockets.slowResp);
    });

    socket.on('disconnect', () => {
        socket.connect();
        socket.emit('joinStream', stream);
        alert({ fileName: 'websocketLog', errList: [{ message: `Disconnected from ${name}, stream: ${stream}`, src: name }], sendMail: false });
    });

    socket.on('connect_error', () => {
        socket.connect()
        socket.emit('joinStream', stream);
        alert({ fileName: 'websocketLog', errList: [{ message: `Connection error to ${name}, stream: ${stream}`, src: name }], sendMail: false });
    });

}

setInterval(checkSocket, config.time.sockets.refresh);
