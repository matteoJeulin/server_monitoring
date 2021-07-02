
function splitName(file) {
    file = file.split('.');
    file.pop()

    return file
}

module.exports = {splitName};