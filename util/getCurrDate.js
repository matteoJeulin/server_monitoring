
function getCurrDate() {
    let now = new Date();
    let date = now.toISOString();
    let output = date.split(':').join('-').split('T').join('-').split('.').join('-').split('Z')[0];

    return output;
}

module.exports = {getCurrDate};