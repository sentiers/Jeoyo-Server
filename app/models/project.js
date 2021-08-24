var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 프로젝트 스키마
var ProjectSchema = new Schema({
    project_title: String, // 프로젝트 제목
    project_leader: { // 팀장 정보
        email: String,
        name: String
    },
    project_member: [{ // 팀원들 정보
        email: String,
        name: String
    }]
});

var Project = mongoose.model('Projects', ProjectSchema);
module.exports = Project;