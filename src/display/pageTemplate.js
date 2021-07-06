
const pageTemplate = (title, body) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
    .container{
        display: flex;
        flex-flow: row wrap;
    }
    .box{
        height:100px;
        width:100px;
        margin: 1px;
    }
    .box-0{
        background-color: #0000FF;
    }
    .box-1{
        background-color: #00FF00;
    }
    .box-2{
        background-color: #FF0000;
    }
    .box-3{
        background-color: #000000;
    }
    </style>
    </head>
    <body>
    ${body}
    </body>
    </html>`
}


module.exports = {pageTemplate};