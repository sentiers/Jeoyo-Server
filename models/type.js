module.exports = (sequelize, DataTypes) => {
    return sequelize.define('type', {
        user_type1 : {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: false,
        },
        user_type2 : {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: false,
        },
        user_type3 : {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: false,
        },
        user_type4 : {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: false,
        },
        user_type5 : {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: false,
        },
    }, {
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
};