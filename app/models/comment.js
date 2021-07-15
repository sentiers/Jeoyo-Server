var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    //comment_id: String,
    comment_post_id: String,
    commment_user_img: String,
    comment_user_name: String,
    comment_text: String,
    comment_created_at: Date
});

var Comment = mongoose.model('Comments', CommentSchema);
module.exports = Comment;