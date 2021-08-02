
const fs =require('fs');
const config = require('../config/config.json');
const {exec} = require('child_process');
const { getCurrDate } = require('./getCurrDate');
const {sendEmail} = require('./sendEmail');
const { checkErrors } = require('../srcServer/check/checkErrors');

function logValue({pathToDir, fileName, value, valueMax, valueMin, refreshRate}) {
    let pathToFile = `${pathToDir}/${fileName}.${valueMin}.${valueMax}.${refreshRate}.txt`
    writeLogFile({pathToFile: pathToFile, message: value});
}

function alert({errList, fileName, sendMail, bashToExecute}){
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
        writeLogFile({pathToFile:`${config.defPath.directoryError}/${fileName}.txt`, message: `${errList[i].src};${errList[i].message}`});
    }
}

function writeLogFile({pathToFile, message}){

    fs.writeFileSync(pathToFile, `${getCurrDate()};${message}\n`, {flag: 'a'});

}



module.exports = {alert, logValue};