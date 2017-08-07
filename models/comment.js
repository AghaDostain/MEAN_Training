var mongoose = require('mongoose');
var undot = require('undot');
var Users = undot('models/user');
var ObjectId = require('mongoose').Schema.ObjectId;
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    comment_content: String,
    commenter: ObjectId,
    image_path: String,
    published: Boolean,
    created_date: { type: Date, default: Date.now },
    updated_date: Date
}, {
    collection: "Comments"
});
commentSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_date = currentDate;
    if (!this.created_date)
        this.created_date = currentDate;
    next();
});
commentSchema.methods.new_comment = function() {
    var currentDate = new Date();
    this.comments.updated_date = currentDate;
    if (!this.comments.created_date)
        this.comments.created_date = currentDate
}
var Comments = mongoose.model('Comments', commentSchema);
module.exports = Comments;