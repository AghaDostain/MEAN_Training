var val = require('validator');

function ValidateContent(content) {
    //if (val.isAlpha(content)) {
    console.log("(content.length >= 3)" + (content.length >= 3));
    if (content.length >= 3) {
        return true;
    }
    //}
    return false;
}

function ValidateTitle(title) {
    //if (val.isAlpha(title)) {
    console.log("(title.length >= 10)" + (title.length >= 10));
    if (title.length >= 10) {
        return true;
    }
    //}
    return false;
}
module.exports = {
    ValidateContent: ValidateContent,
    ValidateTitle: ValidateTitle
}