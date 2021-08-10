
const { readDirectory } = require('../../util/readDirectory');
const { shortenPath } = require('../modify/shortenPath');

function getFolders(initPath, directory, id, folders = {}, j = 0) {
    let URL = initPath;
    let files = readDirectory(URL);

    for (let i = 0; i < files.length; i++) {
        let fileName = files[i].split('.');
        let currentDir = shortenPath(URL, directory);

        if (fileName[fileName.length-1] === 'txt') {
            let fileProp = {
                name: fileName[0],
                path: `${URL}/${files[i]}`,
                min : fileName[1],
                max : fileName[2],
                refreshRate : fileName[3],
                id: `${id}-${fileName[0]}-${j}-${i}`
            };
            if (folders[currentDir]) {
                folders[currentDir].push(fileProp);
            }
            else {
                folders[currentDir] = [fileProp];
            }
        }
        else {
            getFolders(`${URL}/${files[i]}`, directory, id, folders, j++);
        }
    }
    
    return folders;
}


module.exports = {getFolders};