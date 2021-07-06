
const { checkColor } = require("../check/checkColor");
const { getFile } = require("../get/getFile");
const { splitText } = require("../modify/splitText");

const color = ['#0000FF', '#00FF00', '#FF0000'];

function displayList (path) {
    let text = getFile(path);

    if (text) {
        text = splitText(text);
    
        let fileName = path.split('/');
        fileName = fileName[fileName.length-1];
    
        let max = fileName.split('.');
        let min = max[1];
        let refreshRate = max[3];
        max = max[2];
    
        for (let i = 0; i < text.length; i++) {

            text[i] = ` 
            <span style="color:${color[checkColor(max, min, text[i][1])]}">
                <li>
                    ${text[i][0]} : <b>${text[i][1]}</b>
                </li>
            </span>`
        }
    
        return text
    }

    return false;
}


module.exports = {displayList};