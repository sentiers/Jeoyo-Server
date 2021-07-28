var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    //post_id: String,
    post_division: String, // 공모전인지 스터디인지 분류
    post_field: String, // 게시물 분야 (광고냐 프로그래밍이냐 등)
    post_img: String, // 게시물 이미지
    post_title: String, // 게시물 제목
    post_recruit_start: String, // 모집기간 시작일 YYYY-MM-DD
    post_recruit_end: String, // 모집기간 마감일 YYYY-MM-DD
    post_requirements: { // 희망 팀원 조건
        status: String, // 상태(재학중, 졸업 등)
        field: [],       // 직무
        headcount: Number // 인원
    },
    post_location: [],
    post_meeting: String, // 활동 빈도
    post_user_id: String, // 게시자 아이디
    post_user_img: String, // 게시자 이미지
    post_user_name: String, // 게시자 이름
    post_introduction: String, // 게시물 소개
    post_plan: String, // 진행 및 방향성
    post_preference: String, // 우대사항
    post_detailed: String, // 세부 룰
    post_created_at: String, // 게시물 생성시점 YYYY-MM-DD HH:mm:ss
    post_updated_at: String // 게시물 수정시점 YYYY-MM-DD HH:mm:ss
});

var Post = mongoose.model('Posts', PostSchema);
module.exports = Post;