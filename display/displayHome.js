
const {checkColor} = require('./checkColor');
const { getDate } = require('../srcServer/get/getDate');
const { getFolders } = require('../srcServer/get/getFolders');
const { getValue } = require('../srcServer/get/getValue');


const color = ['#0000FF', '#00FF00', '#FF0000', '#000000'];

function displayHome(object) {
    let output = [];

    for (keys in object) {
        output.push(`<h1>${keys}</h1>`);

        for (let i = 0; i < object[keys].length; i++) {
            let value = getValue(object[keys][i].path);
            let date = getDate(object[keys][i].path)
            let filePath = object[keys][i].path;
            output.push(`
            <li>
                <a href="?file=${filePath}">
                    <span style="color:${color[checkColor(object[keys][i].max,object[keys][i].min, value, object[keys][i].refreshRate, date)]}">
                        ${object[keys][i].name} : ${date} . . . <b>${value}</b>.
                    </span>
                </a>
         </li>`);
        }
    }
    return output.join('');
}

module.exports = {displayHome};
