const sequelize = require('../controllers/vhubDB')
const { DataTypes } = require('sequelize');

// 根据传入的 用户名 来决定对应的 用户videos详情表
const getUserFriendsModel = (username) => {
    return sequelize.define(`${username}_friends`, {
        // 在这里定义此模型的属性
        uid: {
            type: DataTypes.STRING(3),
            allowNull: false,
            primaryKey: true
        },
        // username: {
        //     type: DataTypes.STRING(255),
        //     allowNull: false,
        // },
        // avatar: {
        //     type: DataTypes.STRING(255),
        //     allowNull: false,
        // },
    }, {
        // 这是其他模型参数
        tableName: `${username}_friends`,//告诉 Sequelize 在mysql数据库的表的名称：
        timestamps: false
    })
}

// 导出
module.exports=getUserFriendsModel