const sequelize = require('../controllers/vhubDB')
const { DataTypes } = require('sequelize');

// 根据传入的 用户名 来决定对应的 用户videos详情表
const getUserSubscribersModel = (username) => {
    return sequelize.define(`${username}_subscribers`, {
        // 在这里定义此模型的属性
        id: {
            type: DataTypes.STRING(3),
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        uid: {
            type: DataTypes.STRING(3),
            allowNull: false,
        },
        subscriptionTime: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

    }, {
        // 这是其他模型参数
        tableName: `${username}_subscribers`,//告诉 Sequelize 在mysql数据库的表的名称：
        timestamps: false
    })
}

// 导出
module.exports = getUserSubscribersModel