
const {splitText} = require('./splitText');

function splitDocuments(txt) {

    for (let i = 0; i < txt.length; i++) {
        txt[i] = splitText(txt[i])
    }

    return txt;
}

module.exports = {splitDocuments};