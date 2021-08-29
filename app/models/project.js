var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;

// 프로젝트 스키마
var ProjectSchema = new Schema({
    project_title: String, // 프로젝트 제목
    project_leader: { // 팀장 정보
        id: ObjectId,
        email: String,
        name: String,
        img: String
    },
    project_member: [{ // 팀원들 정보
        id: ObjectId,
        email: String,
        name: String,
        img: String
    }],
    project_active: { // (1: 진행중, 2: 평가중, 3: 종료)
        type: Number,
        default: 1
    }
});

var Project = mongoose.model('Projects', ProjectSchema);
module.exports = Project;