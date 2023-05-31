/* eslint-disable camelcase */
const express = require('express')
const router = express.Router()

// 导入各种控制器模块
const { uploadVideo, uploadArticle, uploadTempAvatar } = require('../controllers/userUpload')
const {
  user_register, user_login, user_logout,
  user_search,
  user_pInfo, user_pInfo_byUid, user_avatarTemp, user_pInfo_update,
  user_state_update, user_state_get,
  user_userList,
  user_videoUpload, user_videoList, user_video, user_video_delete, user_video_modify, user_video_playNum_inc, user_video_thumbNum_inc,
  user_articleUpload, user_articleList, user_article, user_article_delete, user_article_modify, user_article_viewNum_inc, user_article_LikeNum_inc,
  user_videoRemark_add, user_videoRemark,
  user_message_add, user_messageList, user_message, user_message_update,
  user_subscription_add, user_subscription, user_subscription_delete,
  user_subscriber_add, user_subscriber, user_subscriber_delete,
  user_friend_add, user_friendList,
  user_chattingLog_add, user_chattingLog,
  user_nsp_add, user_nsp, user_nsp_delete
} = require('../controllers/userApiController')

// ----------处理其他请求----------
// 用户注册路由
router.post('/register', user_register)

// 用户登录路由
router.post('/login', user_login)

// 用户退出登录路由
router.post('/logout', user_logout)

// 获取 搜索结果 路由
router.get('/search/:searchContent/:type', user_search)

// 获取 用户状态 通过用户名 路由
router.get('/state/:username', user_state_get)

// 用户更新状态路由
router.post('/state', user_state_update)

router.get('/userList', user_userList)

// 获取 用户个人信息 通过用户名 路由
router.get('/pInfo/:username', user_pInfo)

// 获取 用户个人信息 通过uid 路由
router.get('/pInfo', user_pInfo_byUid)

// 更新 用户信息 路由
router.put('/pInfo', user_pInfo_update)

// 用户选择了临时头像 路由
router.post('/avatarTemp', uploadTempAvatar.fields([{ name: 'tempAvatarSelected', maxCount: 1 }]), user_avatarTemp)

// 获取 用户的视频列表 路由
router.get('/videoList/:username', user_videoList)

// 根据username 和 videoID 获取用户的单个视频详情 路由
router.get('/video', user_video)

// 根据username 和 videoID 删除用户的单个视频 路由
router.delete('/video', user_video_delete)

// 根据username 和 videoID 修改用户的单个视频信息 路由
router.put('/video', uploadVideo.fields([
  { name: 'videoCover', maxCount: 1 }
]), user_video_modify)

// 根据username 和 videoID ，给用户的该视频的播放量+1 路由
router.get('/videoPlayNum/inc', user_video_playNum_inc)

// 根据username 和 videoID ，给用户的该视频的点赞量+1 路由
router.get('/videoThumbNum/inc', user_video_thumbNum_inc)

// 获取 用户的文章列表 路由
router.get('/articleList/:username', user_articleList)

// 根据videoID 获取单个文章详情 路由
router.get('/article', user_article)

// 根据username 和 articleID 删除用户的单个文章 路由
router.delete('/article', user_article_delete)

// 根据username 和 articleID 修改用户的单个文章信息 路由
router.put('/article', uploadArticle.fields([
  { name: 'articleCover', maxCount: 1 }
]), user_article_modify)

// 根据username 和 articleID ，给用户的该文章的浏览量+1 路由
router.get('/articleViewNum/inc', user_article_viewNum_inc)

// 根据username 和 articleID ，给用户的该文章的喜欢量+1 路由
router.get('/articleLikeNum/inc', user_article_LikeNum_inc)

// --- 评论 ---

// 根据 username 和 videoID, 给对应用户的对应视频评论表中新增一个评论 路由
router.post('/remark', user_videoRemark_add)

// 根据 username 和 videoID, 获取 用户的视频评论表
// 或 获取某个t1评论的详情评论 路由
router.post('/remark/:username/:videoID', user_videoRemark)

// 根据username 给对应用户的消息表中新增一个消息 路由
router.post('/message', user_message_add)

// 获取 用户的消息列表 路由
router.get('/messageList/:username', user_messageList)

// 根据mID 获取单个消息详情 路由
router.get('/message', user_message)

// 根据mID 更新单个消息 路由
router.put('/message', user_message_update)

// 根据username 给对应用户的订阅表中新增一个记录 路由
router.post('/subscription', user_subscription_add)

// 根据username 获取用户的订阅表 路由
router.get('/subscription/:username', user_subscription)

// 根据username 和 username_author 删除用户订阅表中的一条记录 路由
router.delete('/subscription/:username/:username_author', user_subscription_delete)

// 根据username 给对应用户的订阅者表中新增一个记录 路由
router.post('/subscriber', user_subscriber_add)

// 根据username 获取用户的订阅者表 路由
router.get('/subscriber/:username', user_subscriber)

// 根据username 和 username_subscriber 删除用户订阅者表中的一条记录 路由
router.delete('/subscriber/:username/:username_subscriber', user_subscriber_delete)

// 根据username 给对应用户的好友表中新增一个好友 路由
router.post('/friend', user_friend_add)

// 获取 用户的好友列表 路由
router.get('/friendList/:username', user_friendList)

// 根据username和username_friend，给username用户的username_username_friend_chattingLog表中新增一条聊天记录 路由
router.post('/chattingLog', user_chattingLog_add)

// 获取 用户与好友的聊天记录表 路由
router.get('/chattingLog/:username/:username_friend', user_chattingLog)

// 新增一个nsp，新增一条nsp表的记录 并存入 用户 与 好友 的username 路由
router.post('/nsp', user_nsp_add)

// 获取 用户 与 好友 的username 对应nsp表的那一条记录 路由
router.get('/nsp', user_nsp)

// 清除 用户 与 好友 的username 对应nsp表的那一条记录 并根据记录的nspID 清除对应的nsp  路由
router.delete('/nsp', user_nsp_delete)

// 视频上传
router.post('/upVideo/:username', uploadVideo.fields([
  { name: 'videoCover', maxCount: 1 },
  { name: 'videoRes', maxCount: 1 }
]), user_videoUpload)

// 文章上传
router.post('/upArticle/:username', uploadArticle.fields([
  { name: 'articleCover', maxCount: 1 }
]), user_articleUpload)

module.exports = router

// -----------------图片、视频上传 测试
//  用户图片上传
// 使用 upload.single() 中间件
// 注意：upload.single()的参数需要与 文件选择器的name属性 或者 FormData实例.append()的第一个参数 保持一致！
// router.post('/img', upload_img.single('uploadImage'), userApiController.user_uploadImg)

// //  用户视频上传
// router.post('/video', upload_video.single('uploadVideo'), userApiController.user_uploadVideo)

// //单文件上传
// router.post('/mimg', upload_img.single('uploadImage'),(req,res,next)=> {
//   console.log(req.body.textData); // Example of accessing text data
//   console.log(req.file); // Example of accessing file data
//   res.send('Form data received!');
// })

// -----------------图片、视频上传 测试

// 多文件 多类型上传
// router.post('/upVideo', uploadVideo.fields([
//   { name: 'videoCover', maxCount: 1 },
//   { name: 'videoRes', maxCount: 1 }
// ]), (req, res, next) => {
//   console.log(req.body.videoTitle); // Example of accessing first text data
//   console.log(req.files.videoCover[0]); // Example of accessing image file data
//   console.log(req.files.videoRes[0]); // Example of accessing video file data
//   res.send('Form data received!');})
