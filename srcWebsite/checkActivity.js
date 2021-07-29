
const { default: axios } = require("axios");
const { getDelay } = require("./getDelay");
const config = require('../config/config.json');

function checkActivity(site) {

    return new Promise((resolve, reject) => {
        let time = Date.now();
        axios.get(site.site, {timeout: config.time.timeout})
        .then((response) => {
            getDelay(time, site.site);
            if (!response.data.includes(site.message) || response.status !== 200) {
                reject({
                    url: site.site,
                    errMessage: `${site.site} is down... :'( It didn't contain ${site.message}`
                });
            }
            resolve(site.site);
        })
        .catch((e) => {
            getDelay(time, site.site);
            reject({
                url: site.site,
                errMessage: `${site.site} is down... :'( Error ${e.message}`
            });
        });
    });
}

module.exports = {checkActivity};