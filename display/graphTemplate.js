const { getFile } = require("../util/getFile");
const { splitText } = require("../util/splitText");

const graphTemplate = (data, body) => {

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Refresh" content="60">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <script src="./public/assets/graph.js"></script>
    </head>
    <body>
        <canvas id="graph" width="900" height="600">   
        </canvas> 
        <script>
        let graph;
        let xPadding = 30;
        let yPadding = 30;

        let data = ${JSON.stringify(data)};

        function getMaxY() {
            let max = 0;
            
            for(let i = 0; i < data.length; i ++) {
                if(parseFloat(data[i].value) > max) {
                    max = parseFloat(data[i].value);
                }
            }
            
            max += 10 - max % 10;
            return max;
        }

        function getXPixel(val) {
            return ((graph.width - xPadding) / data.length) * val + (xPadding * 1.5);
        }

        function getYPixel(val) {
            return graph.height - (((graph.height - yPadding) / getMaxY()) * val) - yPadding;
        }
        
        graph = document.getElementById('graph');
        let c = graph.getContext('2d');

        c.lineWidth = 2;
        c.strokeStyle = '#333';
        c.font = 'italic 8pt sans-serif';
        c.textAlign = "center";

        c.beginPath();
        c.moveTo(xPadding, yPadding);
        c.lineTo(xPadding, graph.height - yPadding);
        c.lineTo(graph.width, graph.height - yPadding);
        c.stroke();

        c.textAlign = "right"
        c.textBaseline = "middle";

        for(let i = 0; i < getMaxY(); i += 10) {
            c.fillText(i, xPadding - 10, getYPixel(i));
        }

        
        c.strokeStyle = '#f00';
        c.beginPath();
        c.moveTo(getXPixel(0), getYPixel(parseFloat(data[0].value)));
                
        for(let i = 1; i < data.length; i ++) {
             c.lineTo(getXPixel(i), getYPixel(parseFloat(data[i].value)));
        }
        c.stroke();

        </script>
        ${body}
    </body>
    </html>`;
}

module.exports = {graphTemplate};