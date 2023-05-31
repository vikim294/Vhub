const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('myproject-vue', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    //  若在30s内重新连接失败，则抛出错误
    acquire: 30000,
    //  在被释放回池中之前，一个连接可以闲置的最大时间
    idle: 10000
  }
})

// 当只导出一个变量时，要使用 赋值 导出， 且不能省略module.
module.exports = sequelize
