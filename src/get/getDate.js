
const { getFile } = require("./getFile");
const { splitText } = require("../modify/splitText");

function getDate(path) {
    let text = getFile(path);
    text = splitText(text);

    text = text[text.length-1][0];

    return text
}


module.exports = {getDate};