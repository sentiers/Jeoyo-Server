var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userAccountScheme = new Schema({
    local: {
        id: String,
        name: String,
        password: String,
    },
    google: { // 구글 자동로그인 테스트
        id: String,
        token: String,
        name: String
    },
    user_email: String, // 이메일
    user_password: String // 비밀번호
});

var UserAccount = mongoose.model('UserAccounts', userAccountScheme);
module.exports = UserAccount;