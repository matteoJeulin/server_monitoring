
function checkColor(max, min, value, refreshRate, date) {
    let txtColor = 1;
    let time = {};

    min = parseFloat(min);
    max = parseFloat(max);
    value = parseFloat(value);
    refreshRate = parseFloat(refreshRate);

    if (max < value) {
        txtColor = 2;
    }
    else if (min > value) {
        txtColor = 0;
    }
    if (refreshRate !== undefined && date !== undefined) {
        let dateExploded = date.split(';')[0].split('-');
        if (dateExploded[5] === undefined) {
            time = new Date(dateExploded[0], dateExploded[1] - 1, dateExploded[2], dateExploded[3], dateExploded[4]);
        }
        else {
            time = new Date(dateExploded[0], dateExploded[1] - 1, dateExploded[2], dateExploded[3], dateExploded[4], dateExploded[5]);
        }
        let now = new Date();

        if ((now.getTime() - time.getTime()) / 1000 > (2 * refreshRate) + 60) {
            txtColor = 3;
        }
    }

    return txtColor;
}

module.exports = { checkColor };