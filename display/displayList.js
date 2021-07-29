
const { checkColor } = require("./checkColor");
const { getFile } = require("../util/getFile");
const { shortenPath } = require("../srcServer/modify/shortenPath");
const { splitText } = require("../util/splitText");
const config = require('../config/config.json');

const color = ['#0000FF', '#00FF00', '#FF0000'];

function displayList (path, directory) {
    let text = getFile(path);

    if (text) {
        text = splitText(text);
        
        let fileName = path.split('/');
        fileName = fileName[fileName.length-1];
        
        let max = fileName.split('.');
        let min = max[1];
        max = max[2];
        
        for (let i = 0; i < text.length; i++) {
            
            text[i] = ` 
            <span style="color:${color[checkColor(max, min, text[i][1])]}">
            <li>
            ${text[i][0]} : <b>${text[i][1]}</b>
            </li>
            </span>`
        }
        text.reverse();
        let shortPath = shortenPath(path, directory);
        if (!shortPath) {
            let a = path.split('/');
            let b = a[a.length-1].split('.');
            shortPath = b[0];
        }
        text.unshift(`<h1>${shortPath}</h1>`);
    
        return text.join('');
    }

    return false;
}


module.exports = {displayList};