
const fs = require('fs');

function getFile(path) {

    let text = fs.readFileSync(path, 'utf-8');

    return text;
}

module.exports = {getFile};