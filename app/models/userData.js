var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
    //user_id: String,
    user_img: String, // 프로필이미지
    user_img_back: String, // 프로필배경이미지
    user_name: String, // 이름
    user_gender: { // 성별 (0:선택사항없음 1:남자 2:여자)
        type: Number,
        default: 0
    },
    user_education: String, // 학교
    user_major: String, // 전공
    user_location: [], // 위치
    user_field: [], // 관심직무
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
    user_cmt_posts: [], // 내가 쓴 댓글
    user_projects: [], // 나의 프로젝트
    user_likedUsers: [], // 관심팀원
    user_likedPosts: [], // 관심 프로젝트
    user_selection: { // 설문조사 결과
        q1: String, // 처음팀원들과 만나는 자리
        q2: String, // 애인질문
        q3: String, // 3일전 아이디어엎어짐
        q4: String, // 두 팀원 말다툼
        q5: String // 내 의견에 반대의견
    },
    user_agreement: {
        agreement_m: { // (필수) 이용약관 동의여부 (0:비동의 1:동의)
            type: Number,
            default: 0
        },
        info_m: Number, // (필수) 개인정보
        info_c: Number, // (선택) 개인정보
        marketing_c: Number, // (선택) 마케팅
    }
});

var UserData = mongoose.model('UserDatas', userDataSchema);
module.exports = UserData;