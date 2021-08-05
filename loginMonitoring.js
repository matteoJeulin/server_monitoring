const fs = require('fs');
const readline = require('readline');
const url = require('url');

const config = require('./config/config.json');
const { checkActivity } = require('./srcWebsite/checkActivity');
const { alert, logValue } = require('./util/writeLog');

const { google } = require('googleapis');
const base64 = require('js-base64');
const axios = require('axios');
const { exec } = require('child_process');

const NO_ERR = 0;
const ERR_CREATE = 1;
const ERR_MAIL_AUTH = 2;
const ERR_MAIL_RECEIVED = 3;
const ERR_MESSAGE_IN_MAIL = 4;
const ERR_LOGIN = 5;
const ERR_MSG_LIST = 6;
const ERR_SITE_PING = 7;
const ERR_READ_MAIL = 8;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './config/token.json';

const login = config.login;
login.errState = 0;

const defPost = login.parameters;

const defPath = config.defPath.directoryWebsite;

function logForm(errState) {
  if (errState === NO_ERR) logValue({ pathToDir: defPath, fileName: login.logFile, value: errState, valueMax: 0, valueMin: 0, refreshRate: config.time.site.refresh / 1000 });
  else {
    alert({ errList: [{ message: `There was an error while creating the account: Error ${errState}`, src: config.login.errSource }], fileName: 'websiteLog', sendMail: true });
    logValue({ pathToDir: defPath, fileName: login.logFile, value: errState, valueMax: 0, valueMin: 0, refreshRate: config.time.site.refresh / 1000 });
  }
}


setInterval(() => {
  let post = {...defPost};
  
  post.email = post.email.replace('{var}', `xx-${Math.floor(Date.now() / 1000)}`);
  post.name = Math.floor(Date.now() / 1000);
  
  let params = new url.URLSearchParams(post);

  axios.post(login.post, params.toString())
    .then(() => {
      setTimeout(() => {
        authorize(login, post.email,listMessages);
        exec(login.bashToExecute);
      }, config.time.login.timeout);
    })
    .catch((err) => {
      logForm(ERR_CREATE);
      alert({ errList: [{ message: err.message, src: config.login.errSource }], fileName: 'websiteLog', sendMail: true });
    });

}, config.time.login.refresh);


/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, mail, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      logForm(ERR_MAIL_AUTH);
      return getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, mail);
  });
}


function listMessages(auth, mail) {
  let timestamp = Math.floor((Date.now() - config.time.login.emailDelay) / 1000);
  let query = `to:${mail} after: ${timestamp}`;
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.messages.list(
    {
      userId: 'me',
      q: query,
      maxResults: 1
    },
    (err, res) => {
      if (err) {
        logForm(ERR_MSG_LIST);
        return;
      }
      if (!res.data.messages) {
        logForm(ERR_MAIL_RECEIVED);
        return;
      }
      getMail(res.data.messages[0].id, auth, handleBody);
    }
  );
}

function getMail(msgId, auth, callback) {
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.messages.get({
    userId: 'me',
    id: msgId,
  }, (err, res) => {
    if (!err) {
      if (res.data.payload.body.size > 0) {
        let body = res.data.payload.body.data;

        callback(base64.decode(body.replace(/-/g, '+').replace(/_/g, '/')), checkActivity);
        gmail.users.messages.trash({
          userId: 'me',
          id: msgId,
        });
      }
      else if (res.data.payload.parts) {
        let body = res.data.payload.parts[0].body.data;

        callback(base64.decode(body.replace(/-/g, '+').replace(/_/g, '/')), checkActivity);
        gmail.users.messages.trash({
          userId: 'me',
          id: msgId,
        });
      }
    }
    else {
      logForm(ERR_READ_MAIL);
    }
  });
}

function handleBody(body, callback) {
  let url = '';
  if (body.includes('<span id="link-account">')) {
    url = body.split('<span id="link-account">')[1].split('</span>')[0];
  }
  else {
    logForm(ERR_MESSAGE_IN_MAIL);
    return;
  }
  let site = {
    site: url,
    name: login.logFile,
    message: login.message
  }
  let promiseArray = [callback(site, false)];
  Promise.allSettled(promiseArray)
    .then((data) => {
      mailState = true;
      if (data[0].status !== 'fulfilled') logForm(ERR_SITE_PING);
      else logForm(NO_ERR)
    })
    .catch((err) => {
      logForm(ERR_LOGIN);
    });
}
