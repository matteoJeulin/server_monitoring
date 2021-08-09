
const { getFile } = require("./getFile");
const { splitText } = require("./splitText");

function selectTime(path, date, delta) {
    const text = getFile(path);
    const textS = splitText(text);
    let output = [];

    if (!date || !delta) {
        for (let i = 0; i < textS.length; i++) {
            const line = textS[i];
            output.push({
                date: line[0],
                value: line[1]
            });
        }
    }
    else {
        const d = date.split('-');
        let dateParsed = new Date(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
        dateParsed = Date.parse(dateParsed);

        for (let i = 0; i < textS.length; i++) {
            const line = textS[i];
            const cD = line[0].split('-');
            let lineDateParsed = new Date(cD[0], cD[1], cD[2], cD[3], cD[4], cD[5], cD[6]);
            lineDateParsed = Date.parse(lineDateParsed);

            if (dateParsed + delta * 60000 >= lineDateParsed && dateParsed - delta * 60000 <= lineDateParsed) {
                output.push({
                    date: line[0],
                    value: line[1]
                });
            }
        }
    }
    return output;
}

module.exports = { selectTime };

