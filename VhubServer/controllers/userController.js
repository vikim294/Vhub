const fs = require('fs')
const path = require('path')




// 控制器全是函数，所以应该 多次导出 函数
// 采用 "挂载"导出，而不是 "赋值"导出，因为此文件不止导出一个这样的接口

// 用户注册页面
// 读取register.html文件，返回，并引发读取相关联的其他文件，返回
exports.page_user_register = async function (req, res, next) {

    // console.log(req.url);
    // console.log(__dirname);

    filePath = path.join(__dirname, `../public/html/index.html`)

    // 读取并返回html文件
    fs.readFile(filePath, (err, pageStr) => {

        if (err) {
            return console.log("读html文件错误！", err);
        }

        // 设置响应头：html
        res.setHeader('Content-Type', 'text/html;charset=utf-8')

        res.end(pageStr)

    })
}




exports.page_user_login = async function (req, res, next) {

    // console.log(req.url);
    // console.log(__dirname);

    filePath = path.join(__dirname, `../public/html/index.html`)

    // 读取并返回html文件
    fs.readFile(filePath, (err, pageStr) => {

        if (err) {
            return console.log("读html文件错误！", err);
        }

        // 设置响应头：html
        res.setHeader('Content-Type', 'text/html;charset=utf-8')

        res.end(pageStr)

    })
}


