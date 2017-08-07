var val = require('validator');
var undot = require('undot');
var Users = undot('models/user');
var Blogs = undot('models/blog');

var ValidateEmail = function(email) {
    console.log("validateEmailFromDB(email)" + validateEmailFromDB(email));
    if ((val.isEmail(email)) && (validateEmailFromDB(email) === undefined)) {
        return true;
    }
    console.log("Email Validation Failed");
    return false;
};

var validateEmailFromDB = function(emaill) {
    Users.findOne({ 'email': emaill }, function(err, user) {
        if (err) {
            throw err;
        } else {
            if (user) {
                console.log("User exists with " + emaill + " email address");
                return false;
            }
            return true;
        }
    });
};

var ValidatePassword = function(password) {
    if (password.length >= 8 && password.length <= 25) {
        return true;
    }
    console.log("password Validation Failed");
    return false;
};

var ValidateUsername = function(username) {
    if ((username.length >= 5 && username.length <= 25) && (validateUsernameFromDB(username) === undefined)) {
        return true;
    }
    console.log("username Validation Failed");
    return false;
};

var validateUsernameFromDB = function(usernamee) {
    Users.findOne({ username: usernamee }, function(err, user) {
        if (err) {
            throw err;
        } else {
            if (user === undefined) {
                return true;
            }
            console.log("User exists with " + usernamee + " username");
            return false;
        }
    });
};

var ValidateName = function(name) {
    if (val.isAlpha(name)) {
        if (name.length >= 3 && name.length <= 25) {
            return true;
        }
        console.log("Name Validation Failed");
    }
    console.log("Name Validation Failed");
    return false;
};

module.exports = {
    ValidateEmail: ValidateEmail,
    ValidatePassword: ValidatePassword,
    ValidateUsername: ValidateUsername,
    ValidateName: ValidateName,
    validateEmailFromDB: validateEmailFromDB,
    validateUsernameFromDB: validateUsernameFromDB
};