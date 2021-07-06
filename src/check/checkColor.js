
function checkColor(max, min, value, refreshRate, date) {
    let txtColor = 1;

    
    min = parseFloat(min);
    max = parseFloat(max);
    value = parseFloat(value);
    refreshRate = parseFloat(refreshRate);
    
    if(max<value) {
        txtColor = 2;
    }
    else if (min>value) {
        txtColor = 0;
    }
    if (refreshRate !== undefined && date !== undefined) {
        let dateExploded = date.split(';')[0].split('-');
        let time = new Date(dateExploded[0],dateExploded[1]-1,dateExploded[2],dateExploded[3],dateExploded[4]);
        let now = new Date(); 
          
        if ((now.getTime() - time.getTime())/1000 > (60 + refreshRate)) {
            txtColor = 3;
        }
    }

    return txtColor;
}

module.exports = {checkColor};