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

const errors = {
  NO_ERR: {
    value: 0,
    text: 'No error'
  },
  ERR_CREATE: {
    value: 1,
    text: 'Error while creating an account'
  },
  ERR_MAIL_AUTH: {
    value: 2,
    text: 'Error while getting authentification'
  },
  ERR_MAIL_RECEIVED: {
    value: 3,
    text: 'Error while reading inbox, no mail received'
  },
  ERR_MESSAGE_IN_MAIL: {
    value: 4,
    text: 'Error while parsing mail, no link in mail'
  },
  ERR_LOGIN: {
    value: 5,
    text: 'Error while logging in'
  },
  ERR_PASS: {
    value: 6,
    text: 'Error while renewing forgotten password'
  },
  ERR_SITE_PING: {
    value: 7,
    text: 'Error, site page did not contain specified message'
  },
  ERR_READ_MAIL: {
    value: 8,
    text: 'Error while reading mail'
  },
  ERR_RESPONSE: {
    value: 9,
    text: 'Error, login page did not have proper response status'
  },
  ERR_SITE_CRASH: {
    value: 10,
    text: 'Error, site did not respond to ping'
  }
}


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = `${__dirname}/config/token.json`;

const signUp = config.signUp;
signUp.errState = 0;

const defPost = signUp.parameters;

const defPath = config.defPath.directoryWebsite;
const login = config.login;

let paramsLogin = new url.URLSearchParams(login.parameters);

function checkLogin() {
  axios.post(login.post, paramsLogin.toString(), {
    maxRedirects: 0,
    validateStatus: function (status) {
      return status === 301;
    }
  })
    .then((response) => {
      for (let i = 0; i < response.headers['set-cookie'].length; i++) {
        if (response.headers['set-cookie'][i].split('=')[0] === login.cookieName) {
          logForm(errors.NO_ERR, login.logFile, config.time.login.refresh);
          return;
        }
      }
      logForm(errors.ERR_LOGIN, login.logFile, config.time.login.refresh);
    })
    .catch((err) => {
      logForm(errors.ERR_RESPONSE, login.logFile, config.time.login.refresh);
    });
}

function checkSignup() {
  let post = { ...defPost };

  post.email = post.email.replace('{var}', `xx-${Math.floor(Date.now() / 1000)}`);
  post.name = Math.floor(Date.now() / 1000);

  let params = new url.URLSearchParams(post);

  axios.post(signUp.post, params.toString())
    .then(() => {
      setTimeout(() => {
        authorize(signUp, post.email, listMessages, true, signUp.logFile, config.time.signUp.refresh);
        exec(signUp.bashToExecute);
      }, config.time.signUp.timeout);
    })
    .catch((err) => {
      logForm(errors.ERR_CREATE, signUp.logFile, config.time.signUp.refresh);
    });
}

function checkPassword() {
  axios.post(login.forgotPass, paramsLogin.toString())
    .then(() => {
      setTimeout(() => {
        authorize(signUp, login.parameters.email, listMessages, false, login.newPassFile, config.time.password.refresh);
        exec(login.bashToExecute);
      }, config.time.password.timeout);
    })
    .catch((err) => {
      logForm(errors.ERR_PASS, login.newPassFile, config.time.password.refresh);
    });
}

setInterval(checkSignup, config.time.signUp.refresh);
setInterval(checkLogin, config.time.login.refresh);
setInterval(checkPassword, config.time.password.refresh);
checkSignup();
checkPassword();
checkLogin();


function logForm(errState, logFile, refresh) {
  if (errState !== errors.NO_ERR) {
    alert({ errList: [{ message: errState.text, src: config.signUp.errSource }], fileName: 'websiteLog', sendMail: true });
  }
  logValue({ pathToDir: defPath, fileName: logFile, value: errState.value, valueMax: 0, valueMin: 0, refreshRate: refresh/1000 });

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
function authorize(credentials, mail, callback, accessSite, logFile, refresh) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      logForm(errors.ERR_MAIL_AUTH, logFile, refresh);
      return getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, mail, accessSite, logFile, refresh);
  });
}


function listMessages(auth, mail, accessSite, logFile, refresh) {
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
      if (!res.data.messages || err) {
        logForm(errors.ERR_MAIL_RECEIVED, logFile, refresh);
        return;
      }
      if (accessSite) getMail(res.data.messages[0].id, auth, handleBody, logFile, refresh);
      else {
        if (!err) logForm(errors.NO_ERR, logFile, refresh);
      }
      gmail.users.messages.trash({
        userId: 'me',
        id: res.data.messages[0].id
      });
    });
}

function getMail(msgId, auth, callback, logFile, refresh) {
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.messages.get({
    userId: 'me',
    id: msgId
  }, (err, res) => {
    if (!err) {
      if (res.data.payload.body.size > 0) {
        let body = res.data.payload.body.data;

        callback(base64.decode(body.replace(/-/g, '+').replace(/_/g, '/')), checkActivity, logFile, refresh);
        gmail.users.messages.trash({
          userId: 'me',
          id: msgId
        });
      }
      else if (res.data.payload.parts) {
        let body = res.data.payload.parts[0].body.data;

        callback(base64.decode(body.replace(/-/g, '+').replace(/_/g, '/')), checkActivity, logFile, refresh);
        gmail.users.messages.trash({
          userId: 'me',
          id: msgId
        });
      }
    }
    else {
      logForm(errors.ERR_READ_MAIL, logFile, refresh);
    }
  });
}

function handleBody(body, callback, logFile, refresh) {
  let url = '';
  if (body.includes('<span id="link-account">')) {
    url = body.split('<span id="link-account">')[1].split('</span>')[0];
  }
  else {
    logForm(errors.ERR_MESSAGE_IN_MAIL, logFile, refresh);
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
      if (data[0].status !== 'fulfilled') logForm(ERR_SITE_PING, logFile, refresh);
      else logForm(errors.NO_ERR, logFile, refresh, refresh);
    })
    .catch((err) => {
      logForm(errors.ERR_SITE_CRASH, logFile, refresh);
    });
}
