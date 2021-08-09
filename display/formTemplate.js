
function formTemplate() {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta http-equiv="Refresh" content="60">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Form</title>
            <style>
                body{
                    margin: 10px;
                }
                input[type=text] {
                    border: 1px dotted #999;
                    border-radius: 1px;
                  
                    -webkit-appearance: none;
                }
                input, textarea, select, button {
                    width : 150px;
                    margin: 0;
                  
                    -webkit-box-sizing: border-box; /* Pour les anciennes versions des navigateurs WebKit */
                       -moz-box-sizing: border-box; /* Pour tous les navigateurs Gecko */
                            box-sizing: border-box;
                }
                textarea {
                    vertical-align: top;
                }
            </style>
        </head>
        <body>
            <form method="get" action="/">
                <input type="text" name="date"> Enter date here in yyyy-mm-dd-hh-mm-ss-mmm format</input>
                <br>
                <br>
                <input type="text" name="delta"> Enter delta (in minutes) here</input>
                <br>
                <br>
                <input type="submit"></input>
            </form>
        </body>
    </html>`;
}

module.exports = {formTemplate};