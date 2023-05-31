const sequelize = require('../controllers/vhubDB')
const { DataTypes } = require('sequelize');

// 根据传入的 用户名 + videoID 来决定对应的 用户视频评论表
const getUserVideoRemarksModel = (username, videoID) => {
    return sequelize.define(`${username}_${videoID}_remarks`, {
        // 在这里定义此模型的属性
        id: {
            type: DataTypes.STRING(3),
            allowNull: false,
            primaryKey: true
        },
        pid: {
            type: DataTypes.STRING(3),
            allowNull: false,
        },
        speaker: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        remarkContent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        postTime: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    }, {
        // 这是其他模型参数
        tableName: `${username}_${videoID}_remarks`,//告诉 Sequelize 在mysql数据库的表的名称：
        timestamps: false
    })
}

// 导出
module.exports = getUserVideoRemarksModel