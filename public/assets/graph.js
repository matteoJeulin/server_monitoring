
let xPadding = 3;
let yPadding = 3;


let fitSquares = (x, y, n) => {
    let sx, sy;

    let px = Math.ceil(Math.sqrt(n * x / y));
    if (Math.floor(px * y / x) * px < n) {
        sx = y / Math.ceil(px * y / x);
    } else {
        sx = x / px;
    }

    var py = Math.ceil(Math.sqrt(n * y / x));
    if (Math.floor(py * x / y) * py < n) {
        sy = x / Math.ceil(x * py / y);
    } else {
        sy = y / py;
    }

    return Math.max(sx, sy);
};

function resizeSquares() {
    let nbBox = document.querySelectorAll('div .box').length;
    let w = window.innerWidth;
    let h = window.innerHeight;

    let s = Math.floor(fitSquares(w, h, nbBox)) - 2;

    document.querySelectorAll(".box").forEach(function (element) {
        element.style.width = s + "px";
        element.style.height = s + "px";
    });
    document.querySelectorAll(".box canvas").forEach(function (element) {
        element.width = s;
        element.height = s;
    });
}


function getMaxY(data) {
    let max = 0;

    for (let i = 0; i < data.length; i++) {
        if (parseFloat(data[i].value) > max) {
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

    let x = graph.clientWidth;
    let y = graph.clientHeight;
    c.lineWidth = 1;
    c.strokeStyle = '#CCCCCC88';
    c.font = 'italic 8pt sans-serif';
    c.textAlign = "center";

    c.textAlign = "right"
    c.textBaseline = "middle";


    c.strokeStyle = '#fff';
    c.beginPath();
    c.moveTo(getXPixel(0, x, data), getYPixel(parseFloat(data[0].value, y, maxY)));

    for (let i = 0; i < data.length; i++) {
        c.lineTo(getXPixel(i, x, data), getYPixel(parseFloat(data[i].value), y, maxY));
    }
    c.stroke();
}


