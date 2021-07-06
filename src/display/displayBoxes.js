const { checkColor } = require("../check/checkColor");
const { getDate } = require("../get/getDate");
const { getValue } = require("../get/getValue");
const { shortenPath } = require("../modify/shortenPath");

function displayBoxes(object) {
    let output = [];
    output.push('<div class="container">');

    for (keys in object) {
        for (let i = 0; i < object[keys].length; i++) {
            let value = getValue(object[keys][i].path);
            let date = getDate(object[keys][i].path);
            let filePath = object[keys][i].path;
            let shortPath = shortenPath(filePath);
            output.push(`
            <a href="?file=${filePath}">
            <div class="box box-${checkColor(object[keys][i].max,object[keys][i].min,value,object[keys][i].refreshRate,date)}" title="${shortPath}"></div>
            </a>`);
        }
    }
    output.push('</div>');
    return output.join('');
}

module.exports = {displayBoxes};