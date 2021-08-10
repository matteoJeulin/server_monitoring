
const fs = require('fs');
const config = require('../config/config.json');
const { exec } = require('child_process');
const { getCurrDate } = require('./getCurrDate');
const { sendEmail } = require('./sendEmail');

function logValue({ pathToDir, fileName, value, valueMax, valueMin, refreshRate }) {
    let pathToFile = `${pathToDir}/${fileName}.${valueMin}.${valueMax}.${refreshRate}.txt`
    writeLogFile({ pathToFile: pathToFile, message: value });
}

function alert({ errList, fileName, sendMail, bashToExecute }) {
    if (sendMail) {
        let errors = [];
        for (let i = 0; i < errList.length; i++) {
            errors.push(errList[i].message);
        }
        sendEmail(errors);
    }
    if (bashToExecute) {
        for (let i = 0; i < bashToExecute.length; i++) {
            exec(bashToExecute[i]);
        }
    }
    for (let i = 0; i < errList.length; i++) {
        writeErr({fileName: fileName, text: errList[i].message, src: errList[i].src });
    }
}

function writeLogFile({ pathToFile, message }) {

    fs.writeFileSync(pathToFile, `${getCurrDate()};${message}\n`, { flag: 'a' });
}

function writeErr({ fileName, src, text }) {

    fs.writeFileSync(`${config.defPath.directoryError}/${fileName}`, `${getCurrDate()};${src};${text}\n`, { flag: 'a' });
}


module.exports = { alert, logValue };