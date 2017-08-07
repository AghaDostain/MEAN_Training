var undot = require('undot');
var Users = undot('models/user');
var Blogs = undot('models/blog');
var ValUsers = undot('models/userHelper');
var ValBlogs = undot('models/blogHelper');
var path = require('path');
var ObjectId = require('mongoose').Schema.ObjectId;
var fs = require('fs');


var ValidateUser = function(email, password, username, org) {
    if (ValUsers.ValidateEmail(email) && ValUsers.ValidatePassword(password) && ValUsers.ValidateUsername(username) && GetFileExtention(org))
        return true;
    return false;
}

var GetSingleUser = function(email, password, callback) {
    Users.findOne({ email: email, password: password }, function(err, person) {
        if (err) {
            throw err;
        } else {
            //console.log(person);
            if (callback && typeof callback == "function") {
                callback(err, person);
            }
            return person;
        }
    });
}
var GetSingleUserOnID = function(id, callback) {
    //console.log(id);
    Users.findOne({ _id: id }, function(err, person) {
        if (err) {
            throw err;
        } else {
            //console.log(person);
            if (callback && typeof callback == "function") {
                callback(err, person);
            }
            return person;
        }
    });
}
var GetSinglePostOnID = function(id, callback) {
    //console.log(id)
    Blogs.findOne({ _id: id }, function(err, post) {
        if (err) {
            throw err;
        } else {
            //console.log(post);
            if (callback && typeof callback == "function") {
                callback(err, post);
            }
            return post;
        }
    });
}
var ValidatePost = function(content, title) {
    //console.log(ValBlogs.ValidateContent(content));
    //console.log(ValBlogs.ValidateTitle(title));
    if (ValBlogs.ValidateContent(content) && ValBlogs.ValidateTitle(title))
        return true;
    return false;
}
var GetFileExtention = function(filename) {
    var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".png"];
    for (var i = 0; i < _validFileExtensions.length; i++) {
        if (path.extname(filename).toLowerCase() == _validFileExtensions[i]) {
            return true;
        }
    }
    return false;
}
var GetFilePath = function(file) {
    var tempPath = file.path;
    var dbPath = './public/uploads/users/' + Date.now() + path.extname(file.originalname).toLowerCase();
    var targetPath = path.resolve(dbPath);
    fs.rename(tempPath, targetPath, function(err) {
        if (err) {
            throw err;
        } else {
            console.log("Upload completed!");
        }
    });
    return dbPath.substring(2);
}
var GetFilePathForBlog = function(file) {
    var tempPath = file.path;
    var dbPath = './public/uploads/blogs/' + Date.now() + path.extname(file.originalname).toLowerCase();
    var targetPath = path.resolve(dbPath);
    fs.rename(tempPath, targetPath, function(err) {
        if (err) {
            throw err;
        } else {
            console.log("Upload completed!");
        }
    });
    return dbPath.substring(2);
}
module.exports = {
    ValidateUser: ValidateUser,
    GetSingleUser: GetSingleUser,
    GetSingleUserOnID: GetSingleUserOnID,
    GetSinglePostOnID: GetSinglePostOnID,
    ValidatePost: ValidatePost,
    GetFileExtention: GetFileExtention,
    GetFilePath: GetFilePath,
    GetFilePathForBlog: GetFilePathForBlog
}