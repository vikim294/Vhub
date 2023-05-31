const path = require('path')

// 读取index.html文件，返回，并引发读取相关联的其他文件，返回
exports.index = async function (req, res, next) {
  console.log(__dirname)

  console.log('\n请求：首页html文件')

  const filePath = path.join(__dirname, '../public/html/index.html')

  // 读取并返回html文件
  // 设置响应头：html
  // res.setHeader('Content-Type', 'text/html;charset=utf-8')

  // 读取并返回html文件 无需手动设置响应头？ res.sendFile()会自动处理？
  res.sendFile(filePath, function (err) {
    if (err) {
      console.log('文件发送失败！', err)
    } else {
      // console.log('文件发送成功！');
    }
  })
}
