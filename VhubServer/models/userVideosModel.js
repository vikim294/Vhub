const sequelize = require('../controllers/vhubDB')
const { DataTypes } = require('sequelize');

// 根据传入的 用户名 来决定对应的 用户videos详情表
const getUserVideosModel = (username) => {
    return sequelize.define(`${username}_videos`, {
        // 在这里定义此模型的属性
        videoID: {
            type: DataTypes.STRING(3),
            allowNull: false,
            primaryKey: true
        },
        videoAuthor: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        videoTitle: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        videoIntro: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        // 00请选择 01日常 02游戏 03天文
        videoType: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        videoCoverSrc: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        videoResSrc: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        videoDuration: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        videoPlayNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        videoThumbNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        videoReleaseTime: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    }, {
        // 这是其他模型参数
        tableName: `${username}_videos`,//告诉 Sequelize 在mysql数据库的表的名称：
        timestamps: false
    })
}

// 导出
module.exports = getUserVideosModel