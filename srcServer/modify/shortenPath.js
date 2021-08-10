
function shortenPath(path, directory) {
    
    let currFile = path.split(directory);
    let output = currFile[1].split('.');

    return output[0];
}


module.exports = {shortenPath};