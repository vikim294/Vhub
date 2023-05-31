const sequelize = require('../controllers/vhubDB')
const { DataTypes } = require('sequelize');

// 根据传入的 用户名 来决定对应的 用户videos详情表
const getUserArticlesModel = (username) => {
    return sequelize.define(`${username}_articles`, {
        // 在这里定义此模型的属性
        articleID: {
            type: DataTypes.STRING(3),
            allowNull: false,
            primaryKey: true
        },
        articleAuthor: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        articleTitle: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        articleCoverSrc: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        articleResSrc: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        articleViewNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        articleLikeNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        articleReleaseTime: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    }, {
        // 这是其他模型参数
        tableName: `${username}_articles`,//告诉 Sequelize 在mysql数据库的表的名称：
        timestamps: false
    })
}

// 导出
module.exports=getUserArticlesModel