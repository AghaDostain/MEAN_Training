var mongoose = require('mongoose');
var undot = require('undot');
var Comments = undot('models/comment');
var ObjectId = require('mongoose').Schema.ObjectId;
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    content: { type: String, require: true },
    created_date: { type: Date, default: Date.now },
    updated_date: Date,
    author: ObjectId,
    title: String,
    image_path: String,
    published: Boolean,
    comments: [Comments]
}, {
    collection: "Blogs"
});
blogSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_date = currentDate;
    if (!this.created_date)
        this.created_date = currentDate;
    next();
});
blogSchema.methods.new_comment = function() {
    var currentDate = new Date();
    this.comments.updated_date = currentDate;
    if (!this.comments.created_date)
        this.comments.created_date = currentDate
}
var Blogs = mongoose.model('Blogs', blogSchema);
module.exports = Blogs;