
const fs = require('fs');
const { readDirectory } = require('./readDirectory');
const { shortenPath } = require('../modify/shortenPath');

function getFolders(initPath, folders = {}) {
    let URL = initPath;
    let files = readDirectory(URL);

    for (let i = 0; i < files.length; i++) {
        let fileName = files[i].split('.');
        let currentDir = shortenPath(URL);

        if (fileName[fileName.length-1] === 'txt') {
            let fileProp = {
                name: fileName[0],
                path: `${URL}/${files[i]}`,
                min : fileName[1],
                max : fileName[2],
                refreshRate : fileName[3]
            };
            if (folders[currentDir]) {
                folders[currentDir].push(fileProp);
            }
            else {
                folders[currentDir] = [fileProp];
            }
        }
        else {
            getFolders(`${URL}/${files[i]}`,folders);
        }
    }
    
    return folders;
}

// let folders = getFolders('C:/Users/matte/OneDrive/Documents/__job/server_monitoring/src/serverStatus',{});

module.exports = {getFolders};