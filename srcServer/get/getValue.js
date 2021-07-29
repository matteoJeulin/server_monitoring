const { getFile } = require("../../util/getFile");
const { splitText } = require("../../util/splitText");

function getValue(path) {
    let text = getFile(path);
    text = splitText(text);

    text = text[text.length-1][1];

    return text
}


module.exports = {getValue};