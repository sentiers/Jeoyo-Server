var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userScheme = new Schema({
    local: {
        id: String,
        name: String,
        password: String,
    },
    google: {
        id: String,
        token: String,
        name: String
    },
    name: String,
    gender: Number,
    education: String,
    major: String,
    location: String,
    division:[],
    email: String,
    introduction: String,
    history:[],
    selection: [],
    likedPosts: [],
    likedUsers: [],
    evaluation: {
        conv: Number,
        conv: Number,
        conv: Number,
        conv: Number,
        conv: Number
    }
});

userScheme.methods.hasVoted = function (pollid) {
    var check = false;
    for (var i = 0; i < this.votedPolls.length; i++) {
        if (this.votedPolls[i] == pollid) {
            check = true;
            break;
        }
    }
    if (check == false) {
        this.votedPolls.push(pollid);
    }
    return;
}



var User = mongoose.model('User', userScheme);
module.exports = User;