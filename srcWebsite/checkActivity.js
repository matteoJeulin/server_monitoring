
const { default: axios } = require("axios");
const { getDelay } = require("./getDelay");
const config = require('../config/config.json');

function checkActivity(site, log = true) {

    return new Promise((resolve, reject) => {
        let time = Date.now();
        axios.get(site.site, {timeout: config.time.site.timeout})
        .then((response) => {
            if(log) getDelay(time, site.name);
            if (!response.data.includes(site.message) || response.status !== 200) {
                reject({
                    url: site.site,
                    name: site.name,
                    errMessage: `${site.site} is down... :'( It didn't contain ${site.message}`
                });
            }
            resolve(site.name);
        })
        .catch((e) => {
            if(log) getDelay(time, site.name);
            reject({
                url: site.site,
                name: site.name,
                errMessage: `${site.site} is down... :'( Error ${e.message}`
            });
        });
    });
}

module.exports = {checkActivity};