const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, { host: config.host, dialect: config.dialect });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.Type = require('./type')(sequelize, Sequelize);

//작성자와 게시글
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
//게시글과 댓글
db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);
//대댓글 
db.Comment.hasMany(db.Comment, {as: 'sub_comment'});

//작성자와 댓글
db.User.hasMany(db.Comment);
db.Comment.belongsTo(db.User);
//팔로잉과 팔로워(작성자-작성자)
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow',
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});
//작성자와 좋아요글 
db.User.belongsToMany(db.Post, { foreignKey: 'likePost', through: 'Like_Post'}); 
db.Post.belongsToMany(db.User, { foreignKey: 'likerId', through: 'Like_Post'});
//사용자와 타입답변
db.User.hasMany(db.Type);
db.Type.belongsTo(db.User);

module.exports = db;
