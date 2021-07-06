

const {fileNames} = require('./src/modify/fileNames');
const { splitText } = require('./src/modify/splitText');
const { shortenPath } = require('./src/modify/shortenPath');
const {splitDocuments} = require('./src/modify/splitDocuments');

const {displayHome} = require('./src/display/displayHome');
const {displayList} = require('./src/display/displayList');
const { displayBoxes } = require('./src/display/displayBoxes');
const {pageTemplate} = require('./src/display/pageTemplate');

const {checkErrors} = require('./src/check/checkErrors');

const {getFolders} = require('./src/get/getFolders');
const { getFile } = require('./src/get/getFile');
const {readDirectory} = require('./src/get/readDirectory');
const {readFiles} = require('./src/get/readFiles');


const http = require('http');


// const allPaths = [];

// for(keys in folders) {
//     for(let i = 0; i < folders[keys].length; i++) {
//         allPaths.push(folders[keys][i].path);
//     }
// } 
// const defPath = 'C:/Users/matte/OneDrive/Documents/__job/server_monitoring/src/serverStatus';
const defPath = './src/serverStatus';


const server = http.createServer((req,res) => {
    
    const folders = getFolders(defPath, {});
    
    try {    
        res.writeHead(200, {'Content-Type': 'text/html'});
        let myURL = req.url;

        if (myURL === '/detail') {
            const detail = displayHome(folders);
            res.end(pageTemplate('Detailed',detail));
            return;
        }

        let parameters = myURL.split('?');
        if (parameters.length > 1) {
            let files = parameters[1].split('&');

            for (let i = 0; i < files.length; i++) {
                files[i] = files[i].split('=')

                for (let j = 0; j < files[i].length; j++) {

                    if (files[i][j] === 'file' && displayList(files[i][j+1])) {
                        let display = displayList(files[i][j+1]); 
                        let joinedDisplay = display.join('');
                        let shortPath = shortenPath(files[i][j+1]);

                        res.end(pageTemplate(shortPath,`<h1>${shortPath}</h1>${joinedDisplay}`));

                        return;
                    }
                }
            }
        }

        const boxes = displayBoxes(folders);
        res.end(pageTemplate('Home',boxes));
    }
    catch (e) {
        res.end(e);
    }
});
        
server.listen(3000, '0.0.0.0');