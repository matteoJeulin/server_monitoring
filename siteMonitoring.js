
const config = require('./config/config.json');
const fs = require('fs');

const { checkActivity } = require('./srcWebsite/checkActivity');
const { alert } = require('./util/writeLog');


let sites = config.sites;

for (let i = 0; i < sites.length; i++) {
    sites[i].errStatus = 0;
}

function checkSite() {
    let err = [];
    let sitesUpdated = sites;
    let bash = [];

    const promiseArray = [];

    for (let i = 0; i < sites.length; i++) {

        promiseArray.push(checkActivity(sites[i]));
    }

    Promise.allSettled(promiseArray)
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < sites.length; j++) {
                    if (data[i].status === 'rejected' && data[i].reason.url === sites[j].site && sites[j].errStatus === 0) {
                        sitesUpdated[j].errStatus = 1;
                        err.push({
                            message: data[i].reason.errMessage,
                            src: data[i].reason.name
                        });
                        bash.push(sites[i].bash);
                    }
                    else if (data[i].status === 'fulfilled' && data[i].value === sites[j].site && sites[j].site !== sitesUpdated[j].site) {
                        alert({ fileName: 'websiteLog.txt', errList: [`${sites[j].name} fixed :D`], srcOfError: data[i].name, sendMail: false });
                        sitesUpdated.errStatus = 0;
                    }
                }
            }

            if (err.length > 0) {
                alert({ errList: err, fileName: 'websiteLog', sendMail: true, bashToExecute: bash })
            }
            sites = sitesUpdated;
        });

}

setInterval(checkSite, config.time.site.refresh);
checkSite();