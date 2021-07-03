var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    id: String,
    name: String,
    options: [{
        optionName: String,
        votes: Number
    }],
    chartType: String,
    creator: String
});


var Posts = mongoose.model('Posts', PostSchema);
module.exports = Posts;