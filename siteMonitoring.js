
const config = require('./config/config.json');
const fs = require('fs');
const { exec } = require('child_process');

const {sendEmail} = require('./util/sendEmail');
const { checkActivity } = require('./srcWebsite/checkActivity');
const { writeErr } = require('./util/writeErr');
const { getCurrDate } = require('./util/getCurrDate');


let sites = config.sites;

for (let i = 0; i < sites.length; i++) {
    sites[i].errStatus = 0;
}

setInterval(() => {
    
    let err = [];
    let sitesUpdated = sites;
    
    const promiseArray = [];
    
    for (let i = 0; i < sites.length; i++) {

        promiseArray.push(checkActivity(sites[i]));
    }
    
    Promise.allSettled(promiseArray)
    .then((data) => {
        for(let i = 0; i < data.length; i++) {
            for (let j = 0; j < sites.length; j++) {                    
                if(data[i].status === 'rejected' && data[i].reason.url === sites[j].site && sites[j].errStatus === 0) {
                    sitesUpdated[j].errStatus = 1;
                    err.push(data[i].reason.errMessage);
                    exec(sites[i].bash);
                }
                else if (data[i].status === 'fulfilled' && data[i].value === sites[j].site && sites[j].site !== sitesUpdated[j].site) {
                    writeErr('websiteLog.txt', `${sites[j].site} fixed :D`);
                    sitesUpdated.errStatus = 0;
                }
            }
        }

        if (err.length > 0) {
            sendEmail(err);
            for(let i = 0; i < err.length; i++) {
                writeErr({fileName:'websiteLog.txt', text: err[i], src: err[i].split(' ')[0]});
            }
        }
        sites = sitesUpdated;
    });

}, config.time.refresh);