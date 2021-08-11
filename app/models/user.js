var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    user_email: { // 이메일
        type: String,
        unique: true
    },
    user_password: String // 비밀번호
});

var User = mongoose.model('Users', userSchema);
module.exports = User;