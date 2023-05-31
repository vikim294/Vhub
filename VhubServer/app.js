const express = require('express')
const cors = require('cors')

// const fs = require('fs')
const path = require('path')

// 导入各路由模块 这些模块用于处理特定的“路由”（URL 路径）
// const indexRouter = require('./routers/indexRouter')
const userApiRouter = require('./routers/userApiRouter')

//
const app = express()

// app.listen(294, function () {
//     console.log("服务器启动！");
// })

app.use(cors())

app.use(express.json()) // 用于解析 数据为 application/json 的请求，如：将一个JSON字符串反序列化（若：解析的数据是application/x-www-form-urlencoded格式的，则req.body为{} )
app.use(
  express.urlencoded({
    // 用于解析 数据为 application/x-www-form-urlencoded 的请求，（若：解析的数据是application/json格式的，则req.body为{} )
    extended: true
  })
)

// // ----------处理 首页路由重定向----------
// app.get('/', function (req, res) {
//   res.redirect('/Vhub')
// })

// 托管静态文件

// app.use('/Vhub', express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '/public')))
// 如此，任何url为 http://192.168.32.99:294/Vhub/... 的请求，都会去public文件夹下查找文件并返回给浏览器
// 注意 下面的代码会把 网站首页index.html 映射到 http://192.168.32.99:294/Vhub/ ，当访问此url时会返回首页给浏览器
// 而index.html下有很多依赖的文件，如axios.js, index.js等等，返回首页给浏览器的同时，这些文件也会按读到的顺序，
// 并根据index.html引入这些文件的相对路径对应的各url向服务器发送请求，如果将index.js的引入src设置为 './js/index.js' 或 'js/index.js'
// 则向服务器请求此文件的url就是http://192.168.32.99:294/Vhub/js/index.js，刚好是public文件夹被托管后 此index.js的查找url，因此会
// 被顺利的返回给浏览器，由此看出，设置好文件内的 【相对路径】 是关键！！！

// 使用各路由模块： app.use(...) 会将中间件库添加进请求处理链
// ----------处理 首页路由----------
// 将 首页index.html 返回给用户
// app.use('/Vhub', indexRouter)

// // ----------处理 用户页面路由----------
// app.get('/Vhub/user/:page', function (req, res) {
//   // console.log('\n请求：html文件');
//   // console.log('请求url: ', req.url);

//   // console.log(req.params.page)

//   const filePath = path.join(__dirname, `/public/html/${req.params.page}.html`)

//   // 读取并返回html文件
//   // fs.readFile(filePath, (err, pageStr) => {

//   //     if (err) {
//   //         return console.log("读html文件错误！", err);
//   //     }

//   //     // 设置响应头：html
//   //     res.setHeader('Content-Type', 'text/html;charset=utf-8')

//   //     res.end(pageStr)

//   // })

//   // 发送文件 指定文件路径即可
//   res.sendFile(filePath, function (err) {
//     if (err) {
//       console.log('文件发送失败！', err)
//     } else {
//       // console.log('文件发送成功！');
//     }
//   })
// })

// ----------处理 用户接口路由----------
app.use('/api/user', userApiRouter)
// 注意不要写成'/api/user/:api'，不然请求url http://192.168.32.99:294/api/user/register最后的
// register就无法传递给userApiRouter了。该路径 '/api/user' 会作为userApiRouter模块里定义的路由的前缀

module.exports = app
