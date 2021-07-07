

function shortenPath(path) {

    let currentDir = path.split('/');
    let rightURL = false;
    while (!rightURL) {
        if (currentDir[0] === 'serverStatus') {
            rightURL = true;
            currentDir.shift();
        }
        else {
            currentDir.shift();
        }
    }
    let currentDirJoined = currentDir.join('/');

    return currentDirJoined;
}


module.exports = {shortenPath};