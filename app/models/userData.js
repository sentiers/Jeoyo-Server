var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;

// 유저 데이터 스키마
var userDataSchema = new Schema({
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
    user_evaluation: [{ // 받은 평가
        member_name: String,
        project_title: String,
        evaluation_date: Date,
        q1: String, // 팀원을 한마디로
        q2: String, // 팀원이 기여한부분
        q3: String, // 팀원의 업무스타일
        q4: String, // 팀원에게 배울점
        q5: String // 팀원에게 피드백
    }],
    user_projects: [{ // 진행중인 프로젝트
        _id: ObjectId, // 프로젝트 id
        project_title: String, // 프로젝트 제목
        member_to_eval: [{
            id: ObjectId,
            email: String,
            name: String,
            img: String
        }]
    }],
    user_likedUsers: [], // 관심팀원
    user_likedPosts: [], // 관심 프로젝트
    user_recent_posts: [], // 최근 본 프로젝트
    user_selection: { // 설문조사 결과
        q1: String, // 처음팀원들과 만나는 자리
        q2: String, // 3일전 아이디어엎어짐
        q3: String, // 두 팀원 말다툼
        q4: String // 내 의견에 반대의견
    },
    user_agreement: {
        agreement_m: { // (필수) 이용약관 동의여부 (0:비동의 1:동의)
            type: Number,
            default: 0
        },
        info_m: Number, // (필수) 개인정보
        info_c: Number, // (선택) 개인정보
        marketing_c: Number, // (선택) 마케팅
    },
    user_active: {
        profile: { // 프로필노출 (0:노출하지않음 1:노출함)
            type: Number,
            default: 1
        },
        myType: { // 나의TYPE노출 (0:노출하지않음 1:노출함)
            type: Number,
            default: 1
        },
        teamReview: { // 팀원리뷰노출 (0:노출하지않음 1:노출함)
            type: Number,
            default: 1
        }
    },
    user_alarm: {
        chat: { // 채팅알림 (0:알림끔 1:알림켬)
            type: Number,
            default: 1
        },
        activity: { // 활동알림 (0:알림끔 1:알림켬)
            type: Number,
            default: 1
        },
        marketing: { // 마케팅알림 (0:알림끔 1:알림켬)
            type: Number,
            default: 1
        }
    },
    user_created_at: Date, // 유저데이터 생성시점 YYYY-MM-DD HH:mm:ss
    user_updated_at: Date, // 유저정보 수정시점 YYYY-MM-DD HH:mm:ss
});

var UserData = mongoose.model('UserDatas', userDataSchema);
module.exports = UserData;