const { getData } = require("../srcServer/get/getData");
const { checkColor } = require("./checkColor");
const { getDate } = require("../srcServer/get/getDate");
const { getValue } = require("../srcServer/get/getValue");
const { shortenPath } = require("../srcServer/modify/shortenPath");
const { boxes } = require("./boxes");
const { selectTime } = require("../util/selectTime");


function displayBoxes(object, directory, date, delta) {
    let output = [];
    let value = 0;
    let dateFile = '';
    let data = [];

    for (keys in object) {
        for (let i = 0; i < object[keys].length; i++) {
            let filePath = object[keys][i].path;
            if (date && delta) {
                data = selectTime(filePath, date, delta);
                if (data.length > 0) {
                    value = data[data.length - 1][1];
                    dateFile = data[data.length - 1][0];
                }
                else data.push({
                    date: 'No values at this date',
                    value: 0
                })
            }
            else {
                data = getData(filePath);
                value = getValue(filePath);
                dateFile = getDate(filePath);
            }
            let shortPath = shortenPath(filePath, directory);


            let path = shortPath.split(/[/_]/);
            let div = [...path[0]];

            for (let i = 1; i < path.length; i++) {
                div.push(`${path[i]}`);
            }
            div[div.length - 1] = div[div.length - 1].split('.')[0];

            let pathTxt = div.join('<br>');

            output.push(boxes(checkColor(object[keys][i].max, object[keys][i].min, value, object[keys][i].refreshRate, dateFile), object[keys][i].id, filePath, pathTxt, data, date, delta));
        }
    }

    return output.join('');
}

module.exports = { displayBoxes };