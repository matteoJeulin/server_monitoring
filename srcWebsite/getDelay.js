
const fs = require('fs');
const  config  = require('../config/config.json');
const { getCurrDate } = require('../util/getCurrDate');
const { logValue } = require('../util/writeLog');

function getDelay(from, website) {
    
    let now = Date.now();
    let delay = now - from;
    logValue({pathToDir: config.defPath.directoryWebsite, fileName: website, valueMax: config.time.site.slowResp, valueMin: 0, value: delay, refreshRate:config.time.site.refresh/1000});

}

module.exports = {getDelay};