
const {splitName} = require('./splitName');

function fileNames(files) {
    let output = [];
    for (let i = 0; i < files.length; i++) {
        output.push(splitName(files[i]));
    }
    return files;
}

module.exports = {fileNames};