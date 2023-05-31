/* eslint-disable camelcase */
// 模块multer 中间件，专门用于处理 文件上传 或 'multipart/form-data'
const multer = require('multer')

// ---------------------
// 定义一个multer.diskStorage()对象storage
const storage_v = multer.diskStorage({
  // 设置文件上传后，在服务器的存放路径
  destination: function (req, file, cb) {
    // 如果文件
    if (file.fieldname === 'videoCover') {
      // 注意：当前router中间件是在app.js中引用的，故__dirname是app.js所在目录 即根目录
      cb(null, 'public/uploads/vCovers/')
    } else if (file.fieldname === 'videoRes') {
      cb(null, 'public/uploads/videos/')
    }
  },

  // 指定把上传的文件，以什么文件名存储
  // 指定file.originalname 就能帮我保存上传的这些图片、视频等的后缀名不变，我就无需再自己手动写 将二进制数据 转换为 图片 或 视频
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

// 定义一个multer()对象，使用上面定义的storage
const uploadVideo = multer({ storage: storage_v })

// ---------------------
const storage_a = multer.diskStorage({
  // 设置文件上传后，在服务器的存放路径
  destination: function (req, file, cb) {
    // 如果文件
    if (file.fieldname === 'articleCover') {
      // 注意：当前router中间件是在app.js中引用的，故__dirname是app.js所在目录 即根目录
      cb(null, 'public/uploads/aCovers/')
    }
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadArticle = multer({ storage: storage_a })

// -----------------------------
const storage_tempAvatar = multer.diskStorage({
  // 设置文件上传后，在服务器的存放路径
  destination: function (req, file, cb) {
    // 如果文件
    if (file.fieldname === 'tempAvatarSelected') {
      // 注意：当前router中间件是在app.js中引用的，故__dirname是app.js所在目录 即根目录
      cb(null, 'public/uploads/tempAvatar/')
    }
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadTempAvatar = multer({ storage: storage_tempAvatar })

// -----------------------------
exports.uploadVideo = uploadVideo

exports.uploadArticle = uploadArticle

exports.uploadTempAvatar = uploadTempAvatar
