// ; (async function () {
//     // 模型是代表数据库中表的抽象
//     const { Sequelize, DataTypes } = require('sequelize');
//     // 在模型中定义的每一列都必须具有数据类型.Sequelize 提供很多内置数据类型.要访问内置数据类型, 必须导入 DataTypes

//     const sequelize = new Sequelize('myproject', 'root', '', {
//         host: 'localhost',
//         dialect: 'mysql',
//         pool: {
//             max: 5,
//             min: 0,
//             //  若在30s内重新连接失败，则抛出错误
//             acquire: 30000,
//             //  在被释放回池中之前，一个连接可以闲置的最大时间
//             idle: 10000
//           }
//     });

const sequelize = require('../controllers/vhubDB')
const { DataTypes } = require('sequelize');
// 在模型中定义的每一列都必须具有数据类型.Sequelize 提供很多内置数据类型.要访问内置数据类型, 必须导入 DataTypes


// 使用 sequelize.define(modelName, attributes, options) 定义一个模型
const User = sequelize.define('User', {
    // 在这里定义此模型的属性

    uid: {
        type: DataTypes.STRING(3),
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    selfIntro: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    // subscriber: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // }
}, {
    // 这是其他模型参数
    tableName: 'user',//告诉 Sequelize 在mysql数据库的表的名称：
    timestamps: false
})

// "赋值"导出，非"挂载"导出，因为该文件只需导出User模型即可，无需导出其他"接口"
module.exports = User

// })();

