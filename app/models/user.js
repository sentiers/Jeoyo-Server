var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    //    google: { // 구글 자동로그인 테스트
    //        id: String,
    //        token: String,
    //        name: String
    //    },
    user_email: { // 이메일
        type: String,
        unique: true
    },
    user_password: String // 비밀번호
});

var User = mongoose.model('Users', userSchema);
module.exports = User;