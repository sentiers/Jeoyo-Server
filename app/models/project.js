var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;

// 프로젝트 스키마
var ProjectSchema = new Schema({
    project_title: String, // 프로젝트 제목
    project_img: String, // 프로젝트 이미지
    project_leader: { // 팀장 정보
        _id: ObjectId,
        email: String,
        name: String,
        img: String
    },
    project_member: [{ // 팀원들 정보
        _id: ObjectId,
        email: String,
        name: String,
        img: String
    }],
    project_active: { // (1: 진행중, 2: 평가중, 3: 종료)
        type: Number,
        default: 1
    },
    project_created_at: Date, // 프로젝트 생성시점 YYYY-MM-DD HH:mm:ss
    project_updated_at: Date // 프로젝트 수정시점 YYYY-MM-DD HH:mm:ss
});

var Project = mongoose.model('Projects', ProjectSchema);
module.exports = Project;