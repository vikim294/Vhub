const sequelize = require('../controllers/vhubDB')
const { DataTypes } = require('sequelize');

// 根据传入的 用户名 来决定对应的 用户videos详情表
const getUserMessagesModel = (username) => {
    return sequelize.define(`${username}_messages`, {
        // 在这里定义此模型的属性
        mID: {
            type: DataTypes.STRING(3),
            allowNull: false,
            primaryKey: true
        },
        mType: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mState: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mStateResult: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mSource: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mTitle: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mContent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        mDate: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        // 这是其他模型参数
        tableName: `${username}_messages`,//告诉 Sequelize 在mysql数据库的表的名称：
        timestamps: false
    })
}

// 导出
module.exports = getUserMessagesModel