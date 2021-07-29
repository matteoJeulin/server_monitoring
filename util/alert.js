
const {sendEmail} = require('./sendEmail');
const { writeErr } = require('./writeErr');

function alert(err, src, fileName){
    sendEmail(err);
    let text = err.join('\n');
    writeErr({fileName: `${fileName}.txt`, text: text, src: src})
}

module.exports = {alert};