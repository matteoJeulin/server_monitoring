
const { shortenPath } = require('../modify/shortenPath');
const { checkColor } = require('../../display/checkColor');
const config = require('../../config/config.json');

function checkErrors(path, max, min, value, refreshRate, date) {
    let err = '';
    let errCode = checkColor(max, min, value, refreshRate, date);

    let file = path.split('/');
    let fileExploded = file.pop().split('.');
    let shortPath = shortenPath(path, config.defPath.directoryServer);

    if(errCode === 1) {}

    else if(errCode === 0) {
        err = `${fileExploded[0]} in ${shortPath} is underperforming.`;
    }
    else if(errCode === 2) {
        err = `${fileExploded[0]} in ${shortPath} is overperforming.`;
    }
    else if(errCode === 3) {
        err = `${fileExploded[0]} in ${shortPath} took too long to respond.`;
    }
    
    return err;
}

module.exports = {checkErrors};
