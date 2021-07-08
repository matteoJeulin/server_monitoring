
const pageTemplate = (title, body) => {
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
                .txt{
                    position: absolute;
                    top: 1px;
                    left: 1px;
                    color: #FFF;
                }
                .container{
                    display: flex;
                    flex-flow: row wrap;
                }
                .box{
                    height:100px;
                    width:100px;
                    margin: 1px;
                    position: relative;
                }
                .box-0{
                    background-color: #002080;
                }
                .box-1{
                    background-color: #2eb82e;
                }
                .box-2{
                    background-color: #e60000;
                }
                .box-3{
                    background-color: #333333;
                }
            </style>
            <script src="/assets/graph.js"></script>
        </head>
        <body>
            ${body}
        </body>
    </html>`;
}


module.exports = {pageTemplate};