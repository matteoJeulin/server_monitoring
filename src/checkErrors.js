
const {splitName} = require('./splitName');
const {getFile} = require('./getFile');
const {splitText} = require('./splitText');

function checkErrors(fileName) {
    let splName = splitName(fileName);

    let min = parseFloat(splName[1]);
    let max = parseFloat(splName[2]);

    let fileText = getFile(fileName,__dirname + '/server_status');
    fileText = splitText(fileText);

    let value = parseFloat(fileText[fileText.length-1][1]);

    if(max<value) {
        throw new Error(`Overperformance for ${splName[0]}`);
    }
    else if (min>value) {
        throw new Error(`Underperformance for ${splName[0]}`);
    }
}

module.exports = {checkErrors};
