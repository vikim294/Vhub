const express = require('express')

const router = express.Router()

// 导入各种控制器模块
const userController = require('../controllers/userController')
// ...
// ...
// 此后，所有路由的回调，只用控制器





// ----------处理文件请求----------
// // 处理请求 html文件
// router.get('/:fileName', function (req, res, next) {

//     // 
//     const fileSuffix = path.extname(req.params.fileName)

//     if (fileSuffix === '.html') {
//         console.log('收到请求：html文件');
//         console.log(req.params);

//         filePath = path.join(__dirname, `../pages/${req.params.fileName}`)

//         // 读取并返回html文件
//         fs.readFile(filePath, (err, pageStr) => {

//             if (err) {
//                 return console.log("读html文件错误！", err);
//             }

//             // 设置响应头：html
//             res.setHeader('Content-Type', 'text/html;charset=utf-8')

//             res.end(pageStr)

//         })


//     }
//     // 定位到public文件夹
//     else {
//         // console.log('收到请求：非html文件');
//         // console.log(req.params);
//         next('route')
//     }


// })

// 处理请求 其他资源文件css,js...
// router.get('/public/:folder/:fileName', (req, res) => {
// router.get('*', (req, res, next) => {

//     const url = req.url

//     const fileSuffix = path.extname(url)

//     if (fileSuffix) {
//         console.log('收到请求：其他资源文件');
//         console.log('请求url: ', url);

//         filePath = path.join(__dirname, `../${url}`)

//         const fileType = {
//             '.ico': 'image/x-icon',
//             '.png': 'image/png',
//             '.jpg': 'image/jpeg',
//             '.svg': 'image/svg+xml',
//             '.gif': 'image/gif',
//             '.html': 'text/html',
//             '.css': 'text/css',
//             '.js': 'application/javascript'
//         }

//         // 读取并返回其他资源文件
//         fs.readFile(filePath, (err, pageStr) => {

//             if (err) {
//                 return console.log("读其他资源文件错误！", err);
//             }

//             res.setHeader('Content-Type', `${fileType[fileSuffix]};charset=utf-8"`)

//             res.end(pageStr)

//         })

//     }
//     else {
//         console.log('收到请求：非文件请求');
//         next('route')
//     }

// })



// /Vhub/user/:page
// 用户注册页面路由
router.get('/register', userController.page_user_register)
// 用户登录页面路由
router.get('/login', userController.page_user_login)




module.exports = router