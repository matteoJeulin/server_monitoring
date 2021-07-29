
const fs = require('fs');
const  config  = require('../config/config.json');
const { getCurrDate } = require('../util/getCurrDate');

function getDelay(from, website) {
    
    let now = Date.now();
    let delay = now - from;

    let siteName = website.split('/')
    siteName.shift();
    siteName.shift();
    let siteNameJoined = siteName.join('-').split('.').join('-');

    fs.writeFileSync(__dirname + `/siteStatus/${siteNameJoined}.0.${config.time.slowResp}.${config.time.timeout}.txt`, `${getCurrDate()};${delay}\n`, {flag: 'a'});

}

module.exports = {getDelay};