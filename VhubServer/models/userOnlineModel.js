const sequelize = require('../controllers/vhubDB')
const { DataTypes } = require('sequelize');
// 在模型中定义的每一列都必须具有数据类型.Sequelize 提供很多内置数据类型.要访问内置数据类型, 必须导入 DataTypes

// 使用 sequelize.define(modelName, attributes, options) 定义一个模型
const UserOnlineTable = sequelize.define('UserOnlineTable', {
    // 在这里定义此模型的属性
    username: {
        type: DataTypes.STRING(20),
        primaryKey:true,
        allowNull: false,
    },
    // isOnline: {
    //     type:DataTypes.BOOLEAN,
    //     allowNull: false,
    // },
    date: {
        type:DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    // 这是其他模型参数
    tableName: 'userOnlineTable',//告诉 Sequelize 在mysql数据库的表的名称：
    timestamps: false
})

// "赋值"导出，非"挂载"导出，因为该文件只需导出User模型即可，无需导出其他"接口"
module.exports = UserOnlineTable



