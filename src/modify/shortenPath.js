const config = require('../../config/config.json')

function shortenPath(path) {
    
    let currDir = path.split(config.defPath.directory);

    return currDir[1];
}


module.exports = {shortenPath};