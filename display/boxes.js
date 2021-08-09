
function boxes(colorID, graphID, title, boxTxt, data, date, delta) {
    if (date && delta) {
        return `
        <a href="?date=${date}&delta=${delta}&file=${title}">
            <div class="box box-${colorID}" title="${title}">
                <div class="txt">${boxTxt}</div>
                <canvas id="${graphID}"></canvas>
            </div>
        </a>
        <script>
        onLoadFunctions.push(()=>{
            drawGraph("${graphID}",${JSON.stringify(data)});
        });
        </script>
        `;
    }
    else {
        return `
        <a href="?file=${title}">
            <div class="box box-${colorID}" title="${title}">
                <div class="txt">${boxTxt}</div>
                <canvas id="${graphID}"></canvas>
            </div>
        </a>
        <script>
        onLoadFunctions.push(()=>{
            drawGraph("${graphID}",${JSON.stringify(data)});
        });
        </script>
        `;
    }
}

module.exports = { boxes };