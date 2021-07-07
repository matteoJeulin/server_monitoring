
const {getFile} = require('./getFile');
const {splitText} = require('../modify/splitText');

function getData(path) {
    let data = [];
    let text = getFile(path);
    let sText = splitText(text);

    for(let i = 0; i < sText.length; i++ ){
        let date = sText[i][0].split('.')[0];
        data.push({
            date: date,
            value: sText[i][1],
        });
    }

    return data;
}

module.exports = {getData};