const socketIo = require('socket.io')
const http = require('http')
// 引入app
const app = require('./app')
//
const { port } = require('./utils')
// 使用app
const server = http.createServer(app)

server.listen(port, function () {
  console.log('--- 服务器启动 ---')
})

const io = socketIo(server, {
  // 跨域资源共享
  cors: {
    origin: 'http://localhost:2940'
  }
})

// ------
// 给io对象挂载一个VIKIM属性，任何去app的任何中间件函数中测试console.log(req.app.get('io').VIKIM),看看是否 都可以访问到io对象的VIKIM属性
// io.VIKIM='vikim294'

// 将io对象作为app的属性，这样在app的任何中间件函数中(使用req.app.get('io'))都可以访问io对象
app.set('io', io)

// ------

// io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on('disconnect', () => {
//     console.log('a user disconnected');
//   })

//   // socket.io服务器 监听(on)客户端为'msg'的emit，并做出响应
//   socket.on('msg', (msg) => {
//     console.log('from client: ' + msg);

//     // socket.io服务器 向客户端emit一个'msg'
//     socket.emit('msg', 'Hello! I am a server!')
//   })

// })
