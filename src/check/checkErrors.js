
const { getValue } = require('../get/getValue');
const { shortenPath } = require('../modify/shortenPath');


function checkErrors(path) {
    let value = parseFloat(getValue(path));

    let file = path.split('/');
    let fileExploded = file.pop().split('.');

    let max = parseFloat(fileExploded[2]);
    let min = parseFloat(fileExploded[1]);

    let shortPath = shortenPath(path);

    if(max<value) {
        throw new Error(`Overperformance for ${fileExploded[0]} in ${shortPath}`);
    }

    else if (min>value) {
        throw new Error(`Underperformance for ${fileExploded[0]} in ${shortPath}`);
    }
}

module.exports = {checkErrors};
