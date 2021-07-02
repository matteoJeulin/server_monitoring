
const fs = require('fs');
const { readDirectory } = require('./readDirectory');

function getFolders(initPath, folders = {}) {
    let URL = initPath;
    let files = readDirectory(URL);

    for (let i = 0; i < files.length; i++) {
        let fileName = files[i].split('.');
        let currentDir = URL.split('/');
        let rightURL = false;
        while (!rightURL) {
            if (currentDir[0] === 'serverStatus') rightURL = true;
            else {
                currentDir.shift();
            }
        }
        currentDir = currentDir.join('/');

        if (fileName[fileName.length-1] === 'txt') {
            let fileProp = {
                name: fileName[0],
                path: `${URL}/${files[i]}`,
                min : fileName[1],
                max : fileName[2]
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

let folders = getFolders('C:/Users/matte/OneDrive/Documents/__job/server_monitoring/src/serverStatus',{});

module.exports = {getFolders};