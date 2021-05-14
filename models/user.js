module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        name : {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: false,
        },
        email : {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password : {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: false,
        },
        //인증여부
        email_verified: {
            type: DataTypes.TINYINT(2),
            default : false,
            required: true,
        },
        //인증코드
        key_for_verify: {
            type: DataTypes.STRING(150),
            required: true,
        },
    }, {
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
};