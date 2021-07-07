
const { checkErrors } = require('./src/check/checkErrors');
const {sendEmail} = require('./src/check/sendEmail');
const { getDate } = require('./src/get/getDate');
const { getFolders } = require('./src/get/getFolders');
const { getValue } = require('./src/get/getValue');

const defPath = './src/serverStatus';

let object = getFolders(defPath);
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

setInterval(() => {

    let upErrState = currErrState;

    object = getFolders(defPath);
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
                        err.push(currErr);
                        continue;
                    }
                }
            }
            else {
                for (let i = 0; i < upErrState.length; i++) {
                    if (currErrState[i].path === path) {
                        upErrState[i].errState = 0;
                        continue;
                    }
                }
            }
        }
    }

    console.log(err);
    if(err.length !== 0) {
        sendEmail(err);
    }

    currErrState = upErrState;

},60000);