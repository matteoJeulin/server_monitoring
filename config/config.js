
const credentials = require('./credentials.json');

let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport(credentials.transport);

let mailOptions = credentials.options;

module.exports = {transporter, mailOptions};
