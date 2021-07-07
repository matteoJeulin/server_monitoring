const { getData } = require("../get/getData");
const { checkColor } = require("../check/checkColor");
const { getDate } = require("../get/getDate");
const { getValue } = require("../get/getValue");
const { shortenPath } = require("../modify/shortenPath");

function displayBoxes(object) {
    let output = [];
    output.push('<div class="container">');
    let j = 0;

    for (keys in object) {
        for (let i = 0; i < object[keys].length; i++) {
            let filePath = object[keys][i].path;
            let value = getValue(filePath);
            let date = getDate(filePath);
            let shortPath = shortenPath(filePath);


            let path = shortPath.split('/');
            let div = [...path[0]];

            for(let i = 1; i< path.length; i++){
                div.push(`<br>${path[i]}`)
            }
            div[div.length-1] = div[div.length-1].split('.')[0];

            let pathTxt = div.join('');

            let data = getData(filePath);


            output.push(`
            <a href="?file=${filePath}">
                <div class="box box-${checkColor(object[keys][i].max,object[keys][i].min,value,object[keys][i].refreshRate,date)}" title="${shortPath}">
                    <div class="txt">${pathTxt}</div>
                    <canvas id="graph-${j}" width="100" height="100"></canvas>
                </div>
            </a>
            <script>drawGraph("graph-${j}",${JSON.stringify(data)});</script>
            `);
            j++;
        }
    }
    output.push('</div>');
    return output.join('');
}

module.exports = {displayBoxes};