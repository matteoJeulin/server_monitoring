
const fs = require('fs');

function getFile(path) {

    if (path === undefined) return false;

    let endFile = path.split('/');
    let endFileExploded = endFile[endFile.length-1].split('.');
    let extension = endFileExploded.pop();

    if (extension === 'txt') {
        let text = fs.readFileSync(path, 'utf-8');
    
        return text;
    }

    return false;
}



module.exports = {getFile};