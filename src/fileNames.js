
const {splitName} = require('./splitName');

function fileNames(files) {

    for (let i = 0; i < files.length; i++) {
        files[i] = splitName(files[i]);
    }
    return files;
}

module.exports = {fileNames};