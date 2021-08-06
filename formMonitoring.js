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

const signUp = config.signUp;
signUp.errState = 0;

const defPost = signUp.parameters;

const defPath = config.defPath.directoryWebsite;
const login = config.login;

let paramsPass = new url.URLSearchParams(login.parameters.email);

let paramsLogin = new url.URLSearchParams(login.parameters);

setInterval(() => {
  let post = { ...defPost };

  post.email = post.email.replace('{var}', `xx-${Math.floor(Date.now() / 1000)}`);
  post.name = Math.floor(Date.now() / 1000);

  let params = new url.URLSearchParams(post);

  axios.post(signUp.post, params.toString())
    .then(() => {
      setTimeout(() => {
        authorize(signUp, post.email, listMessages, true, signUp.logFile);
        exec(signUp.bashToExecute);
      }, config.time.signUp.timeout);
    })
    .catch((err) => {
      logForm(ERR_CREATE, signUp.logFile);
    });


  axios.post(login.forgotPass, paramsPass.toString())
    .then(() => {
      setTimeout(() => {
        authorize(signUp, login.parameters.email, listMessages, false, login.newPassFile);
        exec(login.bashToExecute);
      }, config.time.login.timeout);
    })
    .catch((err) => {
      logForm(ERR_CREATE, login.newPassFile);
    });


  axios.post(login.post, paramsLogin.toString(), {
    maxRedirects: 0,
    validateStatus: function (status) {
      return status === 301; // Resolve only if the status code is less than 500
    }
  })
    .then((response) => {
      let accountLogged = false;
      for (let i = 0; i < response.headers['set-cookie'].length; i++) {
        if (response.headers['set-cookie'][i].split('=')[0] === login.splitText) {
          accountLogged = true;
          logForm(NO_ERR, login.logFile);
          return;
        }
      }
      if (!accountLogged) throw ({ message: ERR_LOGIN });
    })
    .catch((err) => {
      logForm(err.message, login.logFile);
    });

}, config.time.signUp.refresh);



function logForm(errState, logFile) {
  console.log(errState);
  if (errState === NO_ERR) logValue({ pathToDir: defPath, fileName: logFile, value: errState, valueMax: 0, valueMin: 0, refreshRate: config.time.site.refresh / 1000 });
  else {
    alert({ errList: [{ message: `Error ${errState} (*TーT)b`, src: config.signUp.errSource }], fileName: 'websiteLog', sendMail: true });
    logValue({ pathToDir: defPath, fileName: logFile, value: errState, valueMax: 0, valueMin: 0, refreshRate: config.time.site.refresh / 1000 });
  }
}

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
function authorize(credentials, mail, callback, accessSite, logFile) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      logForm(ERR_MAIL_AUTH, logFile);
      return getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, mail, accessSite, logFile);
  });
}


function listMessages(auth, mail, accessSite, logFile) {
  let timestamp = Math.floor((Date.now() - config.time.signUp.emailDelay) / 1000);
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
        logForm(ERR_MSG_LIST, logFile);
        return;
      }
      if (!res.data.messages) {
        logForm(ERR_MAIL_RECEIVED, logFile);
        return;
      }
      if (accessSite) getMail(res.data.messages[0].id, auth, handleBody, logFile);
      else {
        console.log('dont continue');
        gmail.users.messages.trash({
          userId: 'me',
          id: res.data.messages[0].id
        });
        if (!err) logForm(NO_ERR, logFile);
      }
    }
  );
}

function getMail(msgId, auth, callback, logFile) {
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.messages.get({
    userId: 'me',
    id: msgId
  }, (err, res) => {
    if (!err) {
      if (res.data.payload.body.size > 0) {
        let body = res.data.payload.body.data;

        callback(base64.decode(body.replace(/-/g, '+').replace(/_/g, '/')), checkActivity, logFile);
        gmail.users.messages.trash({
          userId: 'me',
          id: msgId
        });
      }
      else if (res.data.payload.parts) {
        let body = res.data.payload.parts[0].body.data;

        callback(base64.decode(body.replace(/-/g, '+').replace(/_/g, '/')), checkActivity, logFile);
        gmail.users.messages.trash({
          userId: 'me',
          id: msgId
        });
      }
    }
    else {
      logForm(ERR_READ_MAIL, logFile);
    }
  });
}

function handleBody(body, callback, logFile) {
  let url = '';
  if (body.includes('<span id="link-account">')) {
    url = body.split('<span id="link-account">')[1].split('</span>')[0];
  }
  else {
    logForm(ERR_MESSAGE_IN_MAIL, logFile);
    return;
  }
  let site = {
    site: url,
    name: signUp.logFile,
    message: signUp.message
  }
  let promiseArray = [callback(site, false)];
  Promise.allSettled(promiseArray)
    .then((data) => {
      mailState = true;
      if (data[0].status !== 'fulfilled') logForm(ERR_SITE_PING, logFile);
      else logForm(NO_ERR, logFile);
    })
    .catch((err) => {
      logForm(ERR_LOGIN, logFile);
    });
}
