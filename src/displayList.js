
const { checkColor } = require("./checkColor");
const { getFile } = require("./getFile");
const { splitText } = require("./splitText");

const color = ['#0000FF', '#00FF00', '#FF0000'];

function displayList (path) {
    let text = getFile(path);
    text = splitText(text);

    let fileName = path.split('/');
    fileName = fileName[fileName.length-1];

    let max = fileName.split('.');
    min = max[1];
    max = max[2];

    for (let i = 0; i < text.length; i++) {
        console.log
        text[i] = ` 
        <span style="color:${color[checkColor(max,min,text[i][1])]}">
            <li>
                ${text[i][0]} : <b>${text[i][1]}</b>
            </li>
        </span>`
    }

    return text
}

module.exports = {displayList};