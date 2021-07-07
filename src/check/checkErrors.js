
const { getValue } = require('../get/getValue');
const { shortenPath } = require('../modify/shortenPath');
const { checkColor } = require('./checkColor');


function checkErrors(path, max, min, value, refreshRate, date) {
    let err = '';
    let errCode = checkColor(max, min, value, refreshRate, date);

    let file = path.split('/');
    let fileExploded = file.pop().split('.');
    let shortPath = shortenPath(path);

    if(errCode === 1) {}

    else if(errCode === 0) {
        err = `Underperformance for ${fileExploded[0]} in ${shortPath}.`;
    }
    else if(errCode === 2) {
        err = `Overperformance for ${fileExploded[0]} in ${shortPath}.`;
    }
    else if(errCode === 3) {
        err = `${fileExploded[0]} in ${shortPath} took too long to respond.`;
    }
    
    return err;
}

module.exports = {checkErrors};

// let value = parseFloat(getValue(path));

// let file = path.split('/');
// let fileExploded = file.pop().split('.');

// let max = parseFloat(fileExploded[2]);
// let min = parseFloat(fileExploded[1]);

// let shortPath = shortenPath(path);

// if(max<value) {
//     throw new Error(`Overperformance for ${fileExploded[0]} in ${shortPath}`);
// }

// else if (min>value) {
//     throw new Error(`Underperformance for ${fileExploded[0]} in ${shortPath}`);
// }