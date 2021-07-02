
const {readDirectory} = require('./src/readDirectory');
const {readFiles} = require('./src/readFiles');

const {fileNames} = require('./src/fileNames');

const {splitDocuments} = require('./src/splitDocuments');
const {displayHome} = require('./src/displayHome');
const {displayList} = require('./src/displayList');

const {checkErrors} = require('./src/checkErrors');

const {getFolders} = require('./src/getFolders');

const http = require('http');
const { getFile } = require('./src/getFile');
const { splitText } = require('./src/splitText');

const path = 'C:/Users/matte/OneDrive/Documents/__job/server_monitoring/src/serverStatus';

const folders = getFolders(path, {});


// const directories = readDirectory(path);

// const files = [];
// for (let i = 0; i < paths.length; i++) {
    //     files.push(readDirectory(paths[i]));
    // }
    
    // const splNames = fileNames([...files]);
    
    // const text = readFiles([...files], path);
    
    // const modText = splitDocuments([...text]);
    
    // const list = displayList([...modText],[...splNames]);
    
    
    // for (let i = 0; i < files.length; i++) {
        //     try {
            //         checkErrors(files[i]);
            //     }
            //     catch (e) {
                //         console.log(e.message);
                //     }
                // }
                
                
const style = displayHome(folders);
                
const server = http.createServer((req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    let myURL = req.url;
    let parameters = myURL.split('?');
    if (parameters.length > 1) {
        let files = parameters[1].split('&');

        for (let i = 0; i < files.length; i++) {
            files[i] = files[i].split('=')

            for (let j = 0; j < files[i].length; j++) {

                if (files[i][j] === 'file' && displayList(files[i][j+1])) {
                    let display = displayList(files[i][j+1]); 
                    display = display.join('');

                    res.end(`${display}`);

                    return;
                }
            }
        }
    }
    res.end(`${style}`);


});
        
server.listen(3000, '127.0.0.1');