
const { getFile } = require("../../util/getFile");
const { splitText } = require("../../util/splitText");

function getDate(path) {
    let text = getFile(path);
    text = splitText(text);

    text = text[text.length-1][0];

    return text
}


module.exports = {getDate};