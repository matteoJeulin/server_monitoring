const { getData } = require("../srcServer/get/getData");
const { checkColor } = require("./checkColor");
const { getDate } = require("../srcServer/get/getDate");
const { getValue } = require("../srcServer/get/getValue");
const { shortenPath } = require("../srcServer/modify/shortenPath");
const { boxes } = require("./boxes");
const config = require('../config/config.json');

function displayBoxes(object, directory) {
    let output = [];
    // output.push('<div class="container">');
    let j = 0;

    for (keys in object) {
        for (let i = 0; i < object[keys].length; i++) {
            let filePath = object[keys][i].path;
            let value = getValue(filePath);
            let date = getDate(filePath);
            let shortPath = shortenPath(filePath, directory);


            let path = shortPath.split('/');
            let div = [...path[0]];

            for(let i = 1; i< path.length; i++){
                div.push(`<br>${path[i]}`)
            }
            div[div.length-1] = div[div.length-1].split('.')[0];

            let pathTxt = div.join('');

            let data = getData(filePath);

            
            output.push(boxes(checkColor(object[keys][i].max,object[keys][i].min,value,object[keys][i].refreshRate,date), object[keys][i].id, filePath, pathTxt, data));
            j++;
        }
    }
    // output.push('</div>');
    return output.join('');
}

module.exports = {displayBoxes};