
function detailTemplate(title, body) {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta http-equiv="Refresh" content="60">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body{
                    margin: 0px;
                }
                .txt{
                    font-size: 5px;
                    font-weight: bold;
                    background: #00000055;
                    padding: 2px;
                }
                .link{
                    font-size: 25px;
                    font-weight: bold;
                    text-decoration: none;
                    background: #60000055;
                    color: #000000;
                }
            </style>
        </head>
        <body>
            <h3><a class="link" href="javascript:history.back()">Go back</a></h3>
            ${body}
        </body>
    </html>`;
}

module.exports = {detailTemplate};
