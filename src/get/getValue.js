const { getFile } = require("./getFile");
const { splitText } = require("../modify/splitText");

function getValue(path) {
    let text = getFile(path);
    text = splitText(text);

    text = text[text.length-1][1];

    return text
}

// console.log(getValue('C:/Users/matte/OneDrive/Documents/__job/server_monitoring/src/serverStatus/RAM/RAM2/server1.4.6.txt'));

module.exports = {getValue};