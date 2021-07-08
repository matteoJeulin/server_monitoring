
const config = require('./config.json');

let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport(config.transport);

let mailOptions = config.options;

module.exports = {transporter, mailOptions};
