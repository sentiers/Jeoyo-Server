var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    //post_id: String,
    post_division: String, // 공모전인지 스터디인지 분류
    post_img: String, // 게시물 이미지
    post_title: String, // 게시물 제목
    post_recruit_start: Date, // 모집기간 시작일
    post_recruit_end: Date, // 모집기간 마감일
    post_requirements: { // 희망 팀원 조건
        status: String, // 상태(재학중, 졸업 등)
        field: [],       // 직무
        headcount: Number // 인원
    },
    post_location: [],
    post_meeting: String, // 활동 빈도
    post_user_img: String, // 게시자 이미지
    post_user_name: String, // 게시자 이름
    post_introduction: String, // 게시물 소개
    post_plan: String, // 진행 및 방향성
    post_preference: String, // 우대사항
    post_detailed: String, // 세부 룰
    post_created_at: Date, // 게시물 생성일
    post_updated_at: Date // 게시물 수정일
});


var Post = mongoose.model('Posts', PostSchema);
module.exports = Post;