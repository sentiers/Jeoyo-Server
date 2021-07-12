var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    //user_id: String,
    user_img: String, // 프로필이미지
    user_img_back: String, // 프로필배경이미지
    user_name: String, // 이름
    user_gender: Number, // 성별
    user_education: String, // 학교
    user_major: String, // 전공
    user_location: [], // 위치
    user_field: [], // 관심분야
    user_email: String, // 이메일
    user_introduction: String, // 소개
    user_history: [], // 활동 이력
    user_evaluation: { // 받은 평가
        communicative: Number, // 소통이 원활해요
        trusted: Number, // 신뢰할 수 있어요
        kind: Number, // 친절하고 매너가 좋아요
        hardworker: Number, // 성실하고 열정적이에요
        competent: Number // 기대이상의 퍼포먼스를 보여줘요
    },
    user_cmt_posts:[], // 내가 쓴 댓글
    user_posts: [], // 내가 쓴 모집글
    user_projects: [], // 나의 프로젝트
    likedUsers: [], // 관심팀원
    likedPosts: [], // 관심 프로젝트
    selection: [] // 설문조사 결과
});

var User = mongoose.model('Users', userSchema);
module.exports = User;