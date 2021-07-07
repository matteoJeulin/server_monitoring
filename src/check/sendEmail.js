
const {transporter, mailOptions} = require('../../config/config');
const nodemailer = require('nodemailer');

function sendEmail(err) {
    mailOptions.subject = `There were ${err.length} errors.`;
    mailOptions.html = err.join('<br>');

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

// sendEmail([1,2,3,4,5,6,7,8,9]);

module.exports = {sendEmail};