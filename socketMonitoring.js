const io = require ('socket.io-client');
const fs = require('fs');
const { exec } = require('child_process');

const { writeErr } = require('./util/writeErr');
const {alert} = require('./util/alert');
const config = require('./config/config.json');
const { getCurrDate } = require('./util/getCurrDate');

let sockets = config.sockets;
let nbConnected = [];

for (let i = 0; i < sockets.length; i++) {
    nbConnected[i] = 0;

    let socket = io(sockets[i].site, { transports: ["websocket"] });
    socket.on('connect', () => {
        socket.emit('joinStream', sockets[i].stream);
        writeErr({fileName:'websocketLog.txt', src: sockets[i].site, text:`Connected to ${sockets[i].site}, stream: ${sockets[i].stream}`});
    });
    
    let timer = setTimeout(() => {
        alert([`${sockets[i].site}, stream: ${sockets[i].stream}, took too long to respond`], sockets[i].site);
        sockets[i].bash;
    }, config.time.slowResp);

    socket.on('price_update', (dataFromServer) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            alert([`${sockets[i].site}, stream: ${sockets[i].stream}, took too long to respond`], sockets[i].site);
            exec(sockets[i].bash);
        }, config.time.slowResp);
    });

    socket.on('number_connected', (data) => {
        let split = data.split(':')[1];
        let nb = split.split(',')[0];
        if(parseFloat(nb) > nbConnected[i]) {
            nbConnected[i] = parseFloat(nb);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            alert([`${sockets[i].site}, stream: ${sockets[i].stream}, took too long to respond`], sockets[i].site);
        }, config.time.slowResp);
    });

    socket.on('disconnect', () => {
        socket.connect();
        socket.emit('joinStream', sockets[i].stream);
        writeErr({fileName: 'websocketLog.txt', text: `Disconnected from ${sockets[i].site}, stream: ${sockets[i].stream}`, src: sockets[i].site});
    });

    socket.on('connect_error', () => {
        socket.connect()
        socket.emit('joinStream', sockets[i].stream);
        writeErr({fileName: 'websocketLog.txt', text: `Connection error to ${sockets[i].site}, stream: ${sockets[i].stream}`, src: sockets[i].site});
    });

}

setInterval(() => {
    for(let i = 0; i < sockets.length; i++) {
        let a = sockets[i].site.split('/')
        a.shift();
        a.shift();
        a = a.join('-').split('.').join('-').split(':').join('-');
        let fileName = `${a}_${sockets[i].stream}`;
        fs.writeFileSync(`${config.defPath.directorySocket}/${fileName}.${config.fileConfig.minSocket}.${config.fileConfig.maxSocket}.${config.time.timeout}.txt`, `${getCurrDate()};${nbConnected[i]}\n`, {flag: 'a'});
        nbConnected[i] = 0;
    }
}, config.time.refresh);