
const { checkColor } = require("./checkColor");
const { shortenPath } = require("../srcServer/modify/shortenPath");
const { selectTime } = require("../util/selectTime");

const color = ['#0000FF', '#00FF00', '#FF0000'];

function displayList(path, directory, date, delta) {
    let text = selectTime(path, date, delta);
    let shortPath = shortenPath(path, directory);
    if (!shortPath) {
        let a = path.split('/');
        let b = a[a.length - 1].split('.');
        shortPath = b[0];
    }

    if (text.length === 0) {
        text.push('<h2>No data available with the parameters you selected (✖╭╮✖)</h2>');
        text.unshift(`<h3><a class="link" href="/">Go back</a></h3><br><h1>${shortPath}</h1>`);
        return text.join('');
    }
    else if (text) {
        let fileName = path.split('/');
        fileName = fileName[fileName.length - 1];

        let max = fileName.split('.');
        let min = max[1];
        max = max[2];

        for (let i = 0; i < text.length; i++) {
            text[i] = ` 
            <span style="color:${color[checkColor(max, min, text[i].value)]}">
            <li>
            ${text[i].date} : <b>${text[i].value}</b>
            </li>
            </span>`
        }
        text.reverse();
        text.unshift(`<h3><a class="link" href="javascript:history.back()">Go back</a></h3><br><h1>${shortPath}</h1>`);

        return text.join('');
    }

    return false;
}


module.exports = { displayList };