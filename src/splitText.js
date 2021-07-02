
function splitText(text) {

    text = text.split('\r\n');
    for (let i = 0; i < text.length; i++) {
        text[i] = text[i].split(';');
    }
    return text;
}

module.exports = {splitText};