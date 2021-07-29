
const fs =require('fs');
const config = require('../config/config.json');
const { getCurrDate } = require('./getCurrDate');

function writeErr({fileName, src, text}) {
    fs.writeFileSync(`${config.defPath.directoryError}/${fileName}`, `${getCurrDate()};${src};${text}\n`, {flag: 'a'});
}

module.exports = {writeErr};