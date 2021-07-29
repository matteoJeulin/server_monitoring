
const fs = require('fs');

function readDirectory(path) {

    return fs.readdirSync(path);
};    

module.exports = {readDirectory};