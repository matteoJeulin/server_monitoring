
const {getFile} = require('./getFile');

function readFiles(files, path) {
    let text = [];

    for (let i = 0; i < files.length; i++) {
        text.push(getFile(files[i],path));
    }

    return text;
}

module.exports = {readFiles};