const { getFile } = require("./getFile");
const { splitText } = require("../modify/splitText");

function getValue(path) {
    let text = getFile(path);
    text = splitText(text);

    text = text[text.length-1][1];

    return text
}


module.exports = {getValue};