
const { splitText } = require('./splitText');

function splitDocuments(txt) {
    let output = [];

    for (let i = 0; i < txt.length; i++) {
        output.push(splitText(txt[i]));
    }

    return output;
}

module.exports = { splitDocuments };