
const { displayHome } = require('./display/displayHome');
const { displayList } = require('./display/displayList');
const { displayBoxes } = require('./display/displayBoxes');
const { pageTemplate } = require('./display/pageTemplate');
const { graphTemplate } = require('./display/graphTemplate');
const { detailTemplate } = require('./display/detailTemplate');
const { formTemplate } = require('./display/formTemplate');

const { getFolders } = require('./srcServer/get/getFolders');

const config = require('./config/config.json');

const http = require('http');
const fs = require('fs');
const { selectTime } = require('./util/selectTime');

const defPathS = config.defPath.directoryServer;
const defPathW = config.defPath.directoryWebsite;
const defPathD = config.defPath.directoryDatabase;
const defPathZ = config.defPath.directoryZmq;
const defPathK = config.defPath.directorySocket;

const server = http.createServer((req, res) => {

    const serverData = getFolders(defPathS, defPathS, 'S');
    const siteData = getFolders(defPathW, defPathW, 'W');
    const databaseData = getFolders(defPathD, defPathD, 'D');
    const zmqData = getFolders(defPathZ, defPathZ, 'Z');
    const socketData = getFolders(defPathK, defPathK, 'K');

    try {
        let myURL = req.url;

        let myURLExploded = myURL.split('/');
        if (myURLExploded[1] === 'assets' || myURLExploded[1] === 'favicon.ico') {
            fs.readFile(`${__dirname}/public/${myURL}`, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('404 not found');
                    return;
                }

                res.writeHead(200);
                res.end(data);
            });

        }
        else {

            res.writeHead(200, { 'Content-Type': 'text/html' });

            if (myURL === '/detail') {
                const detailS = displayHome(serverData);
                const detailW = displayHome(siteData);
                const detailD = displayHome(databaseData);
                const detailZ = displayHome(zmqData);
                const detailK = displayHome(socketData);
                const detail = detailS + detailW + detailD + detailZ + detailK;
                res.end(detailTemplate('Detailed', detail));
                return;
            }

            if (myURL === '/setTime') {
                res.end(formTemplate());
                return;
            }

            let delta = undefined;
            let date = undefined;

            let parameters = myURL.split('?');
            if (parameters.length > 1) {
                let files = parameters[1].split('&');

                for (let i = 0; i < files.length; i++) {
                    files[i] = files[i].split('=')
                    for (let j = 0; j < files[i].length; j++) {
                        if (files[i][j] === 'delta') {
                            delta = files[i][j + 1];
                        }
                        if (files[i][j] === 'date') {
                            date = files[i][j + 1];
                        }
                        if (files[i][j] === 'file') {

                            let pathToDoc = files[i][j + 1].split('/');
                            pathToDoc.pop();
                            let pathToDocJ = pathToDoc.join('/')
                            if (displayList(files[i][j + 1], pathToDocJ, date, delta)) {

                                let data = selectTime(files[i][j + 1], date, delta);

                                let display = displayList(files[i][j + 1], pathToDocJ, date, delta);
                                let graph = graphTemplate(data, display);

                                res.end(graph);

                                return;
                            }
                        }
                    }
                }
            }

            const boxesS = displayBoxes(serverData, defPathS, date, delta);
            const boxesW = displayBoxes(siteData, defPathW, date, delta);
            const boxesD = displayBoxes(databaseData, defPathD, date, delta);
            const boxesZ = displayBoxes(zmqData, defPathZ, date, delta);
            const boxesK = displayBoxes(socketData, defPathK, date, delta);

            const disp = `<div class="container">${boxesS}${boxesW}${boxesD}${boxesZ}${boxesK}<a href="/setTime">
                            <div class="box link" title="Set time">
                                <div class="txt">Set time</div>
                            </div>
                            </a>
                        </div>`;

            res.end(pageTemplate('Home', disp));
        }
    }
    catch (e) {

        console.error(e);
        res.end(JSON.stringify(e));
    }
});

server.listen(3000, '0.0.0.0');