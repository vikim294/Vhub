const sequelize = require('../controllers/vhubDB')
const { DataTypes } = require('sequelize')

// 需要传入两个参数，第一个表示本用户的用户名，第二个表示该用户的某个好友的用户名
const getUserChattingLogModel = (username, username_friend) => {
  return sequelize.define(`${username}_${username_friend}_chattingLog`, {
    // 在这里定义此模型的属性
    cmID: {
      type: DataTypes.STRING(3),
      allowNull: false,
      primaryKey: true
    },
    cmType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cmSender: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cmReceiver: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    // 状态(待定)

    cmContent: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    cmDate: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    // 这是其他模型参数
    tableName: `${username}_${username_friend}_chattingLog`, // 告诉 Sequelize 在mysql数据库的表的名称：
    timestamps: false
  })
}

// 导出
module.exports = getUserChattingLogModel
