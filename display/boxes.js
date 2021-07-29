
function boxes(colorID, graphID, title, boxTxt, data) {
    return `
        <a href="?file=${title}">
            <div class="box box-${colorID}" title="${title}">
                <div class="txt">${boxTxt}</div>
                <canvas id="${graphID}" width="100" height="100"></canvas>
            </div>
        </a>
        <script>drawGraph("${graphID}",${JSON.stringify(data)});</script>
    `;
}

module.exports = {boxes};