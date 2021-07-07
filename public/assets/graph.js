
let xPadding = 3;
let yPadding = 3;

function getMaxY(data) {
    let max = 0;
    
    for(let i = 0; i < data.length; i ++) {
        if(parseFloat(data[i].value) > max) {
            max = parseFloat(data[i].value);
        }
    }
    
    max += 10 - max % 10;
    return max;
}

function getXPixel(val, x, data) {
    return ((x - xPadding) / data.length) * val + (xPadding * 1.5);
}

function getYPixel(val, y, max) {
    return y - (((y - yPadding) / max) * val) - yPadding;
}

function drawGraph(id, data) {

    let graph = document.getElementById(id);
    let c = graph.getContext('2d');
    let maxY = getMaxY(data);
    console.log(data);
    
    let xPadding = 3;
    let yPadding = 3;
    let x = graph.width;
    let y = graph.height;

    c.lineWidth = 1;
    c.strokeStyle = '#333';
    c.font = 'italic 8pt sans-serif';
    c.textAlign = "center";
    
    // c.beginPath();
    // c.moveTo(xPadding, yPadding);
    // c.lineTo(xPadding, y - yPadding);
    // c.lineTo(x, y - yPadding);
    // c.stroke();
    
    // for(let i = 0; i < data.length; i ++) {
    //     c.fillText(data[i].date, getXPixel(i, x, data), y - yPadding + 20);
    // }
    
    c.textAlign = "right"
    c.textBaseline = "middle";
    
    // for(let i = 0; i < maxY; i += 10) {
    //     c.fillText(i, xPadding - 10, getYPixel(i, y, maxY));
    // }
    
    
    c.strokeStyle = '#fff';
    c.beginPath();
    c.moveTo(getXPixel(0, x, data), getYPixel(parseFloat(data[0].value,y , maxY)));
            
    for(let i = 0; i < data.length; i ++) {
         c.lineTo(getXPixel(i,x , data), getYPixel(parseFloat(data[i].value), y, maxY));
    }
    c.stroke();
}


