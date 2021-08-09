
const { checkErrors } = require('./srcServer/check/checkErrors');
const { sendEmail } = require('./util/sendEmail');
const { getDate } = require('./srcServer/get/getDate');
const { getFolders } = require('./srcServer/get/getFolders');
const { getValue } = require('./srcServer/get/getValue');
const fs = require('fs');

const config = require('./config/config.json');
const { shortenPath } = require('./srcServer/modify/shortenPath');
const { writeErr } = require('./util/writeErr');
const { getCurrDate } = require('./util/getCurrDate');
const { alert } = require('./util/writeLog');

const defPath = config.defPath.directoryServer;

let object = getFolders(defPath, defPath);
let err = [];

let currErrState = [];
for (keys in object) {
    for (let i = 0; i < object[keys].length; i++) {
        currErrState.push({
            path: object[keys][i].path,
            errState: 0
        })
    }
}

function checkServer() {

    let upErrState = currErrState;

    object = getFolders(defPath, defPath);
    err = [];

    for (keys in object) {
        for (let i = 0; i < object[keys].length; i++) {
            let currFile = object[keys][i]
            let path = currFile.path;
            let refresh = currFile.refreshRate;
            let date = getDate(path);
            let value = getValue(path);
            let min = currFile.min;
            let max = currFile.max;

            let currErr = checkErrors(path, max, min, value, refresh, date);
            if (currErr !== '') {
                for (let i = 0; i < upErrState.length; i++) {
                    if (currErrState[i].path === path && currErrState[i].errState === 0) {
                        upErrState[i].errState = 1;
                        err.push({
                            message: currErr,
                            src: shortenPath(currErrState[i].path, defPath)
                        });
                        continue;
                    }
                }
            }
            else {
                for (let i = 0; i < upErrState.length; i++) {
                    if (currErrState[i].path === path && currErrState[i].path !== upErrState[i].path) {

                        alert({ fileName: 'serverLog', errList: [{ message: `${shortenPath(currErrState[i].path, defPath)} fixed :D`, src: shortenPath(currErrState[i].path, defPath) }], sendMail: false });
                        upErrState[i].errState = 0;
                        continue;
                    }
                }
            }
        }
    }

    if (err.length !== 0) {
        alert({ errList: err, fileName: 'serverLog', sendMail: true })
    }

    currErrState = upErrState;

}

setInterval(checkServer, config.time.server.refresh);
checkServer();