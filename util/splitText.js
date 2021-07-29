
function splitText(text) {
    let output = [];

    let textExploded = text.split('\n');
    for (let i = 0; i < textExploded.length; i++) {
        output.push(textExploded[i].trim().split(';'));
    }

    if (output[output.length-1][0] === '' || output[output.length-1][0] === '\r' || output[output.length-1][0] === '\n') {
        output.pop();
    }

    return output;
}

module.exports = {splitText};