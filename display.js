
const {displayHome} = require('./display/displayHome');
const {displayList} = require('./display/displayList');
const { displayBoxes } = require('./display/displayBoxes');
const {pageTemplate} = require('./display/pageTemplate');
const { graphTemplate } = require('./display/graphTemplate');

const {getFolders} = require('./srcServer/get/getFolders');

const { getData } = require('./srcServer/get/getData');

const config = require('./config/config.json');

const http = require('http');
const fs = require('fs');

const defPathS = config.defPath.directoryServer;
const defPathW = config.defPath.directoryWebsite;
const defPathD = config.defPath.directoryDatabase;
const defPathZ = config.defPath.directoryZmq;
const defPathK = config.defPath.directorySocket;

const server = http.createServer((req,res) => {

    const serverData = getFolders(defPathS, defPathS, 'S');
    const siteData = getFolders(defPathW, defPathW, 'W');
    const databaseData = getFolders(defPathD, defPathD, 'D');
    const zmqData = getFolders(defPathZ, defPathZ, 'Z');
    const socketData = getFolders(defPathK, defPathK, 'K');

    try {    
        let myURL = req.url;
        
        let myURLExploded = myURL.split('/');
        if (myURLExploded[1] === 'assets' || myURLExploded[1] === 'favicon.ico'){
            fs.readFile(`${__dirname}/public/${myURL}`, (err,data) => {
                if (err) {
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                
                res.writeHead(200);
                res.end(data);
            });
            
        }
        else{
            
            res.writeHead(200, {'Content-Type': 'text/html'});
            
            if (myURL === '/detail') {
                const detail = displayHome(serverData);
                res.end(pageTemplate('Detailed',detail));
                return;
            }
            
            let parameters = myURL.split('?');
            if (parameters.length > 1) {
                let files = parameters[1].split('&');
                
                for (let i = 0; i < files.length; i++) {
                    files[i] = files[i].split('=')
                    
                    for (let j = 0; j < files[i].length; j++) {
                        
                        let pathToDoc = files[i][j+1].split('/');
                        pathToDoc.pop();
                        let pathToDocJ = pathToDoc.join('/') 
                        if (files[i][j] === 'file' && displayList(files[i][j+1], pathToDocJ)) {
                            
                            let data = getData(files[i][j+1]);
                            
                            let display = displayList(files[i][j+1], pathToDocJ); 
                            let graph = graphTemplate(data, display);
                            
                            res.end(graph);
                            
                            return;
                        }
                    }
                }
            }
            
            const boxesS = displayBoxes(serverData, defPathS);
            const boxesW = displayBoxes(siteData, defPathW);
            const boxesD = displayBoxes(databaseData, defPathD);
            const boxesZ = displayBoxes(zmqData, defPathZ);
            const boxesK = displayBoxes(socketData, defPathK);

            const disp = `<div class="container">${boxesS}${boxesW}${boxesD}${boxesZ}${boxesK}</div>`;

            res.end(pageTemplate('Home',disp));
        }
    }
    catch (e) {

        console.error(e);
        res.end(JSON.stringify(e));
    }
});
        
server.listen(3000, '0.0.0.0');