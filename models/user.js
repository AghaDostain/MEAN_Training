var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    updated_date: Date,
    image_path: String
}, {
    collection: 'Users'
});
userSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_date = currentDate;
    if (!this.created_date)
        this.created_date = currentDate;
    next();
});
var Users = mongoose.model('Users', userSchema);
module.exports = Users;