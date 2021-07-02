
function checkColor(max, min, value) {
    let txtColor = 1;

    min = parseFloat(min);
    max = parseFloat(max);
    value = parseFloat(value);

    if(max<value) {
        txtColor = 2;
    }
    else if (min>value) {
        txtColor = 0;
    }

    return txtColor;
}

module.exports = {checkColor};