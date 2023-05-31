/* eslint-disable brace-style */
/* eslint-disable camelcase */
// console.log(`
// -------------------

// 我是 userApiController.js

// -------------------
// `);

const fs = require('fs')
const path = require('path')
const moment = require('moment')

const ffprobe = require('ffprobe')
const ffprobeStatic = require('ffprobe-static')

//
const { pathProcess } = require('../utils')

// const socketIo = require('socket.io')

// 导入userModel模块
const userModel = require('../models/userModel')

// 导入userOnline模块
const userOnlineModel = require('../models/userOnlineModel')

// 导入nsp模块
const nspModel = require('../models/nspModel')

// 导入getUserVideosModel方法
const getUserVideosModel = require('../models/userVideosModel')
const getUserArticlesModel = require('../models/userArticlesModel')
const getUserMessagesModel = require('../models/userMessagesModel')
const getUserFriendsModel = require('../models/userFriendsModel')
const getUserChattingLogModel = require('../models/userChattingLogModel')
const getUserSubscriptionsModel = require('../models/userSubscriptionsModel')
const getUserSubscribersModel = require('../models/userSubscribersModel')
const getUserVideoRemarksModel = require('../models/userVideoRemarksModel')
// require("./vhubDB");

// 定义一个全局定时器对象
const timer = {}

// 定义一个全局nsp对象
const nsp = {}

// 根据两个用户名，检测是否在nsp表中存在该记录 并返回
const rowInNspTable = async (username1, username2) => {
  // ----- 查找nsp表，看看同时具有这两个用户名的记录是否存在
  let nspResArr_db = await nspModel.findAll({
    where: {
      username1,
      username2
    }
  })

  if (nspResArr_db.length <= 0) {
    nspResArr_db = await nspModel.findAll({
      where: {
        username1: username2,
        username2: username1
      }
    })
  }

  if (nspResArr_db.length <= 0) return null
  return nspResArr_db
}

// ----评论
// 对评论节点列表 按每个数组元素的 id 进行 升序 排序
const sortNodes = (arr_rNode) => {
  let temp

  // i = [1, length-1] 共 length-1 趟
  for (let i = 1; i < arr_rNode.length; i++) {
    // 第一趟: i = 1, j = [1, length -1] 共比较 length-1 次
    for (let j = 1; j <= arr_rNode.length - i; j++) {
      // 注意 id 可能是string，所以比较时，隐式转换为number
      if (+arr_rNode[j].id < +arr_rNode[j - 1].id) {
        temp = arr_rNode[j]
        arr_rNode[j] = arr_rNode[j - 1]
        arr_rNode[j - 1] = temp
      }
    }
  }

  return arr_rNode
}

// 找出 id 结点的子孙节点，如果不空，则添加到?.chidlren属性上
const findChildren = (originList, id) => {
  const tempArr = []

  originList.forEach((rNode) => {
    // 如果 rNode 是 id结点的儿子
    if (rNode.pid === id) {
      const childrenAttr = findChildren(originList, rNode.id)
      if (childrenAttr.length > 0) {
        rNode.children = childrenAttr
      }
      tempArr.push(rNode)
    }
  })

  // 对 tempArr 里每个元素按 id 进行升序排序

  return sortNodes(tempArr)
}

// 将最终的结点t1对象，转换为一个数组
const toFinalRemarkList = (rNode, finalRemarkList) => {
  // 操作
  // console.log('rNode: ', rNode);
  const tempRNode = { ...rNode }
  delete tempRNode.children
  finalRemarkList.push(tempRNode)

  // 递归处理子孙
  if (rNode.children) {
    rNode.children.forEach((item_rNode) => {
      toFinalRemarkList(item_rNode, finalRemarkList)
    })
  }
}

// 根据传入的用户名、搜索内容、搜索类型，进行视频或文章的搜索，返回一个数组
const getSearchResultArr = async (username, searchContent, type) => {
  let resArr = []

  if (type === 'video') {
    // 搜索用户的视频
    const user_videosModel = getUserVideosModel(username)
    const userVideoList_db = await user_videosModel.findAll()
    resArr = userVideoList_db.map((item) => {
      if (item.dataValues.videoTitle.includes(searchContent)) { return item.dataValues }
      return false
    })
  } else if (type === 'article') {
    // 搜索用户的文章
    const user_articlesModel = getUserArticlesModel(username)
    const userArticleList_db = await user_articlesModel.findAll()
    resArr = userArticleList_db.map((item) => {
      if (item.dataValues.articleTitle.includes(searchContent)) { return item.dataValues }
      return false
    })
  }

  return resArr.filter((item) => item !== undefined)
}

// --------------------------------

// 用户注册
exports.user_register = async function (req, res, next) {
  // --- 开发测试用 以后要注释！
  await userModel.sync({
    // 创建一张数据库表，若已存在，则先删除，再创建
    // force: true
  })
  // ---

  // --- 开发测试用 以后要注释！
  await userOnlineModel.sync({
    // 创建一张数据库表，若已存在，则先删除，再创建
    // force: true
  })
  // ---

  // --- 开发测试用 以后要注释！
  await nspModel.sync({
    // 创建一张数据库表，若已存在，则先删除，再创建
    // force: true
  })
  // ---

  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username: username_newUser, password: password_newUser } = req.body

  // console.log('接收到用户注册信息：', req.body);

  // -----检测输入的用户名是否已存在于数据库中-----
  // 思路：以该用户名作为查询条件，若结果数不为0，则说明已有该用户，新增失败
  const amout_user = await userModel.count({
    where: {
      username: username_newUser
    }
  })

  if (amout_user !== 0) {
    const resObj = {
      msg: '用户名已存在！',
      code: 2940
    }

    // console.log(`新增用户 ${username_newUser} 失败！`);
    res.status(400).json(resObj)
    return
  }

  // -----新增用户-----
  // 思路：以uid降序 查询数据库中的整个表，若结果集行数为0，则指定newUid为'001'
  // 否则，指定newUid为结果集第一行的uid+1（注意先将其转为number类型）
  const userTable_db = await userModel.findAll({
    order: [['uid', 'DESC']]
  })

  // console.log("user table in database:", JSON.stringify(userTable_db, null, 2)); //json数据更易观察
  // console.log(userTable_db.length);

  let newUid

  if (userTable_db.length === 0) {
    newUid = '001'
  } else {
    // console.log(JSON.stringify(userTable_db[0]));
    // console.log(userTable_db[0].uid);

    newUid = +userTable_db[0].uid + 1

    // 1~9
    if (newUid < 10) {
      newUid = `00${newUid}`
    }
    // 10~99
    else if (newUid < 100) {
      newUid = `0${newUid}`
    }
    // 100~999
    else if (newUid >= 1000) {
      const resObj = {
        msg: '新建用户失败！uid溢出',
        code: 2940
      }

      console.log('用户数量已经达到999，3位uid已经全部分配完！新建用户失败！')
      res.status(400).json(resObj)
      return
    }
  }

  // -----将用户信息 写入数据库-----
  await userModel.create({
    uid: newUid,
    username: username_newUser,
    password: password_newUser,
    selfIntro: '这个家伙很懒，什么也没有留下...',
    avatar: ''
    // subscriber: 0
  })

  // ------------ 再创建用户对应的username_videos表

  // 使用 sequelize.define(modelName, attributes, options) 定义一个用户的视频表模型
  const user_videosModel = getUserVideosModel(username_newUser)

  // --- 开发测试用 以后要注释！
  await user_videosModel.sync({
    // 创建一张数据库表，若已存在，则先删除，再创建
    // force: true
  })
  // ---

  // 使用 sequelize.define(modelName, attributes, options) 定义一个用户的文章表模型
  const user_articlesModel = getUserArticlesModel(username_newUser)

  // --- 开发测试用 以后要注释！
  await user_articlesModel.sync({
    // 创建一张数据库表，若已存在，则先删除，再创建
    // force: true
  })

  // 使用 sequelize.define(modelName, attributes, options) 定义一个用户的消息表模型
  const user_messagesModel = getUserMessagesModel(username_newUser)

  // --- 开发测试用 以后要注释！
  await user_messagesModel.sync({
    // 创建一张数据库表，若已存在，则先删除，再创建
    // force: true
  })

  // 使用 sequelize.define(modelName, attributes, options) 定义一个用户的消息表模型
  const user_subscriptionsModel = getUserSubscriptionsModel(username_newUser)

  // --- 开发测试用 以后要注释！
  await user_subscriptionsModel.sync({
    // 创建一张数据库表，若已存在，则先删除，再创建
    // force: true
  })

  // 使用 sequelize.define(modelName, attributes, options) 定义一个用户的消息表模型
  const user_subscribersModel = getUserSubscribersModel(username_newUser)

  // --- 开发测试用 以后要注释！
  await user_subscribersModel.sync({
    // 创建一张数据库表，若已存在，则先删除，再创建
    // force: true
  })

  // 使用 sequelize.define(modelName, attributes, options) 定义一个用户的好友表模型
  const user_friendsModel = getUserFriendsModel(username_newUser)

  // --- 开发测试用 以后要注释！
  await user_friendsModel.sync({
    // 创建一张数据库表，若已存在，则先删除，再创建
    // force: true
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '新建用户成功！',
    code: 2941,
    data: req.body
  }

  // console.log(`用户 ${username_newUser} 的信息，已保存到数据库！`);
  res.status(200).json(resObj)
}

// 用户登录
exports.user_login = async function (req, res, next) {
  // 设置响应数据的类型，响应数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username: username_user, password: password_user } = req.body

  // console.log('接收到用户登录信息：', req.body);

  // 检测输入的用户名查询数据库
  // 思路：以该用户名作为查询条件，若结果数不为0，则说明已有该用户，然后再验证密码
  const res_query = await userModel.findAll({
    where: {
      username: username_user
    }
  })

  // console.log(JSON.stringify(res_query));

  if (res_query.length === 0 || password_user !== res_query[0].password) {
    // 无此用户 或 密码错误

    const resObj = {
      msg: '登陆失败！用户名或密码错误！',
      code: 2940
    }

    console.log(`用户 ${username_user} 登录失败！`)
    res.status(400).json(resObj)
    return
  }

  // 验证密码成功
  // 返回给前端一些信息
  const resObj = {
    msg: '用户登录成功！',
    code: 2941,
    data: req.body
  }

  console.log(`--- 用户 ${username_user} 登录成功 ---`)
  res.status(200).json(resObj)

  // --- 注意：在 res() 给浏览器返回响应之后，且return之前的代码 仍会被执行 ！！！---

  // 一旦有一个用户登录了，则添加一条记录到userOnline表
  userOnlineModel.create({
    username: username_user,
    // isOnline: true,
    date: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  })

  // 创建一个定时器对象
  timer[username_user] = setTimeout(async () => {
    console.log(`
    ------------------------------


    用户 ${username_user} 的65秒时间到了！   user_login


    ------------------------------
    `)

    // 说明用户已经离线(包括点了退出登录按钮、直接关闭页面等)，就清除userOnline表里的相应行
    // 如果userOnline表中存在满足条件的记录，则清除 (如果userOnline表中不存在满足条件的记录，则不会发生任何事)
    await userOnlineModel.destroy({
      where: {
        username: username_user
      }
    })

    // 清除用户的在线定时器
    clearTimeout(timer[username_user])
  }, 65000)

  // console.log('刚开始时 timer大对象:', timer);
}

// 用户退出登录
exports.user_logout = async function (req, res, next) {
  const { username } = req.body

  // 一旦有一个用户退出登录了，则删除userOnline表中相应的记录
  await userOnlineModel.destroy({
    where: {
      username
    }
  })

  // 清除用户的在线定时器
  clearTimeout(timer[username])

  res.end()

  // --- 注意：在 res() 给浏览器返回响应之后，且return之前的代码 仍会被执行 ！！！---

  // // 创建一个定时器对象
  // const timerObj = setTimeout(() => {
  //     console.log(`用户${username_user} 的30秒时间到了！`);
  // }, 30000)

  // timerArr.push(timerObj)
}

// 获取搜索结果
exports.user_search = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { searchContent, type } = req.params

  // 获取用户表，得到所有用户名
  const userList_db = await userModel.findAll()
  const resArr = []

  for (let i = 0; i < userList_db.length; i++) {
    // 根据搜索内容， 查找所有用户的视频表里的视频，如果标题包含搜索内容，则收集起来

    const tempResArr = await getSearchResultArr(
      userList_db[i].dataValues.username,
      searchContent,
      type
    )

    resArr.push(...tempResArr)
  }

  // 返回给前端一些信息
  const resObj = {
    msg: '获取搜索结果成功',
    code: 2941,
    data: resArr
  }

  res.status(200).json(resObj)
}

// 根据用户名 获取用户当前状态
exports.user_state_get = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // console.log(req.params);

  const username_user = req.params.username

  // 思路：以该用户名作为查询条件
  const userStateResArr_db = await userOnlineModel.findAll({
    where: {
      username: username_user
    }
  })

  // console.log('userStateResArr_db: ',userStateResArr_db);
  // console.log('userStateResArr_db: ',userStateResArr_db[0].dataValues.username);
  // console.log('userStateResArr_db: ',userStateResArr_db[0].dataValues.date);

  let resObj = {}

  if (userStateResArr_db.length === 0) {
    // 说明用户未在线
    console.log(`用户 ${username_user} 未在线`)

    resObj = {
      msg: '获取用户在线状态成功！',
      code: 2941,
      data: {
        username: username_user,
        isOnline: false
      }
    }
  } else {
    console.log(`用户 ${username_user} 在线`)

    resObj = {
      msg: '获取用户在线状态成功！',
      code: 2941,
      data: {
        username: userStateResArr_db[0].dataValues.username,
        date: userStateResArr_db[0].dataValues.date,
        isOnline: true
      }
    }
  }

  // console.log(`获取用户在线状态成功！`)
  res.status(200).json(resObj)
}

// 用户更新状态
exports.user_state_update = async function (req, res, next) {
  const { username } = req.body

  console.log(`接收到${username} 请求更新状态`)

  // console.log('clearTimeout清除之前的timer大对象:', timer);  //注：它和刚开始时 timer大对象 一模一样！ 属性_destroyed: false,

  // ----------------
  // 先清除之前的 再续上
  clearTimeout(timer[username])
  // 如果存在，则移除
  await userOnlineModel.destroy({
    where: {
      username
    }
  })
  // 添加一条记录到userOnline表
  userOnlineModel.create({
    username: username,
    date: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  })
  // ----------------

  // console.log('clearTimeout清除之后的timer大对象:', timer); //注：清除之后 属性_destroyed: true,
  timer[username] = setTimeout(async () => {
    console.log(`
    ------------------------------


    用户 ${username} 的65秒时间到了！   user_state_update


    ------------------------------
    `)

    // 说明用户已经离线(包括点了退出登录按钮、直接关闭页面等)，就清除userOnline表里的相应行
    // 如果userOnline表中存在满足条件的记录，则清除 (如果userOnline表中不存在满足条件的记录，则不会发生任何事)
    await userOnlineModel.destroy({
      where: {
        username
      }
    })

    // 清除用户的在线定时器
    clearTimeout(timer[username])
  }, 65000)

  res.end()

  // res.end()

  // --- 注意：在 res() 给浏览器返回响应之后，且return之前的代码 仍会被执行 ！！！---

  // // 创建一个定时器对象
  // const timerObj = setTimeout(() => {
  //     console.log(`用户${username_user} 的30秒时间到了！`);
  // }, 30000)

  // timerArr.push(timerObj)
}

// 获取用户列表
exports.user_userList = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const userList_db = await userModel.findAll()

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户列表成功！',
    code: 2941,
    data: userList_db
  }

  res.status(200).json(resObj)
}

// 根据用户名 获取用户个人信息
exports.user_pInfo = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // console.log(req.params);

  const username_user = req.params.username

  // console.log('用户个人信息获取的 请求参数用户名 为：', username_user);

  // 思路：以该用户名作为查询条件
  const userResArr_db = await userModel.findAll({
    where: {
      username: username_user
    }
  })

  // console.log("user data in database:", JSON.stringify(userResArr_db[0], null, 2)); //json数据更易观察
  // console.log('结果集 userResArr_db 的长度:', userResArr_db.length);

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户个人信息成功！',
    code: 2941,
    data: userResArr_db[0]
  }

  // console.log(`获取用户 ${username_user} 个人信息成功`)
  res.status(200).json(resObj)
}

// 更新 用户信息
exports.user_pInfo_update = async function (req, res, next) {
  // 设置响应数据的类型，响应数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  console.log('接收到用户信息更新信息：', req.body)

  const { username, avatar, selfIntro } = req.body

  // 更新条件 以 旧用户名 查询数据库的那一行
  userModel.update(
    {
      avatar,
      selfIntro
    },
    {
      where: {
        username
      }
    }
  )

  // 返回给前端一些信息

  const resObj = {
    msg: '个人信息保存成功！',
    code: 2941
  }

  console.log(`用户 ${username} 个人信息保存成功`)
  res.status(200).json(resObj)
}

// 根据uid 获取用户个人信息
exports.user_pInfo_byUid = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  console.log(req.query)

  const uid_user = req.query.uid

  console.log('用户个人信息获取的 请求参数uid 为：', uid_user)

  // 思路：以该uid作为查询条件
  const userResArr_db = await userModel.findAll({
    where: {
      uid: uid_user
    }
  })

  if (userResArr_db.length > 0) {
    // console.log("user data in database:", JSON.stringify(userResArr_db[0], null, 2)); //json数据更易观察
    // console.log('结果集 userResArr_db 的长度:', userResArr_db.length);

    // 返回给前端一些信息
    const resObj = {
      msg: '获取用户个人信息成功！',
      code: 2941,
      data: userResArr_db[0]
    }

    console.log('获取用户个人信息成功')
    res.status(200).json(resObj)
  } else {
    // 返回给前端一些信息
    const resObj = {
      msg: 'uid错误！ 不存在此用户！',
      code: 2940
    }

    console.log('uid错误！ 不存在此用户！')
    res.status(400).json(resObj)
  }
}

// 用户选择了临时头像
exports.user_avatarTemp = async function (req, res, next) {
  // 设置响应数据的类型，响应数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // console.log(
  //   "接收到用户选择临时头像的信息：",
  //   req.files.tempAvatarSelected[0]
  // );

  // 返回给前端一些信息
  const resObj = {
    msg: '保存了临时头像！',
    code: 2941,
    data: {
      src: pathProcess(req.files.tempAvatarSelected[0].path)
    }
  }
  console.log('用户 保存了临时头像成功！')
  res.status(200).json(resObj)
}

// 用户视频上传
exports.user_videoUpload = async (req, res, next) => {
  // 此时 标题、封面、视频 等 都可以获取 和 都已经存入服务器文件夹
  // 将信息存入数据库
  const username_user = req.params.username
  // 使用 sequelize.define(modelName, attributes, options) 定义一个模型

  const user_videosModel = getUserVideosModel(username_user)

  // await user_videosModel.sync({   // 创建一张数据库表，若已存在，则先删除，再创建
  //   force: true
  // })

  // console.log(req.body.videoTitle); // Example of accessing first text data
  // console.log(req.files.videoCover[0]); // Example of accessing image file data
  // console.log(req.files.videoRes[0]); // Example of accessing video file data

  // console.log(path.join(__dirname,'../',req.files.videoRes[0].path));

  const vpath = path.join(__dirname, '../', req.files.videoRes[0].path)

  // console.log(vpath);

  // 获取视频文件的时长
  ffprobe(vpath, { path: ffprobeStatic.path }, async function (err, info) {
    if (err) {
      res.status(400).end('获取视频文件的时长err')
      return err
    }
    // console.log(info.streams[0].duration);

    //
    // -----新增-----
    // 思路：以uid降序 查询数据库中的整个表，若结果集行数为0，则指定newUid为'001'
    // 否则，指定newUid为结果集第一行的uid+1（注意先将其转为number类型）
    const userVideosTable_db = await user_videosModel.findAll({
      order: [['videoID', 'DESC']]
    })

    // console.log("user table in database:", JSON.stringify(userTable_db, null, 2)); //json数据更易观察
    // console.log(userTable_db.length);

    let newVideoID

    if (userVideosTable_db.length === 0) {
      newVideoID = '001'
    } else {
      // console.log(JSON.stringify(userTable_db[0]));
      // console.log(userTable_db[0].uid);

      newVideoID = +userVideosTable_db[0].videoID + 1

      // 1~9
      if (newVideoID < 10) {
        newVideoID = `00${newVideoID}`
      }
      // 10~99
      else if (newVideoID < 100) {
        newVideoID = `0${newVideoID}`
      }
      // 100~999
      else if (newVideoID >= 1000) {
        const resObj = {
          msg: '新建视频失败！videoID溢出',
          code: 2940
        }

        console.log(
          '视频数量已经达到999，3位videoID已经全部分配完！新建视频失败！'
        )
        res.status(400).json(resObj)
        return
      }
    }

    // 视频信息写入数据库
    await user_videosModel.create({
      videoID: newVideoID,
      videoAuthor: username_user,
      videoTitle: req.body.videoTitle,
      videoIntro: req.body.videoIntro,
      videoType: req.body.videoType,
      videoCoverSrc: pathProcess(req.files.videoCover[0].path),
      videoResSrc: pathProcess(req.files.videoRes[0].path),
      videoDuration: parseInt(info.streams[0].duration),
      videoPlayNum: 0,
      videoThumbNum: 0,
      videoReleaseTime: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
    })

    // 创建一张视频评论表
    const user_videoRemarksModel = getUserVideoRemarksModel(
      username_user,
      newVideoID
    )

    // --- 开发测试用 以后要注释！
    await user_videoRemarksModel.sync({
      // 创建一张数据库表，若已存在，则先删除，再创建
      // force: true
    })

    res.send('Form data received!')
  })
}

// 根据用户名 获取用户的视频列表
exports.user_videoList = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  console.log(req.params)

  const username_user = req.params.username

  console.log('用户的视频列表获取的 请求参数用户名 为：', username_user)

  const user_videosModel = getUserVideosModel(username_user)

  const userVideoList_db = await user_videosModel.findAll()

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户的视频列表成功！',
    code: 2941,
    data: userVideoList_db
  }

  console.log(`获取用户的视频列表 ${userVideoList_db} 个人信息成功`)
  res.status(200).json(resObj)

  res.end()
}

// 根据videoID 获取单个视频详情
exports.user_video = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  console.log(req.query)

  const { username, videoID } = req.query

  const user_videosModel = getUserVideosModel(username)

  const userVideo_db = await user_videosModel.findAll({
    where: {
      videoID
    }
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户的视频成功！',
    code: 2941,
    data: userVideo_db[0]
  }

  console.log(`获取用户的视频 ${userVideo_db[0]} 个人信息成功`)
  res.status(200).json(resObj)
}

// 根据username 和 videoID 删除用户的单个视频
exports.user_video_delete = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, videoID } = req.query

  const user_videosModel = getUserVideosModel(username)

  await user_videosModel.destroy({
    where: {
      videoID
    }
  })

  // 删除对应的视频评论表
  const user_videoRemarksModel = getUserVideoRemarksModel(username, videoID)

  await user_videoRemarksModel.drop()

  // 返回给前端一些信息
  const resObj = {
    msg: '视频 删除成功',
    code: 2941
  }

  res.status(200).json(resObj)
}

// 根据username 和 videoID 修改用户的单个视频信息
exports.user_video_modify = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // console.log(req.body)
  // console.log(req.files);
  // console.log(req.files.videoCover[0])

  // 如果没传封面，则 req.body.videoCover 为 undefined，且 req.files 为 {}
  // 如果传了封面，则 req.body 中 没有videoCover字段，且 req.files.videoCover[0] 存在

  const { username, videoID, videoTitle, videoIntro } = req.body

  const user_videosModel = getUserVideosModel(username)

  if (req.files.videoCover) {
    const videoCoverSrc = pathProcess(req.files.videoCover[0].path)

    await user_videosModel.update(
      {
        videoTitle,
        videoIntro,
        videoCoverSrc
      },
      {
        where: {
          videoID
        }
      }
    )
  } else {
    await user_videosModel.update(
      {
        videoTitle,
        videoIntro
      },
      {
        where: {
          videoID
        }
      }
    )
  }

  // 返回给前端一些信息
  const resObj = {
    msg: '视频信息 修改成功',
    code: 2941
  }

  res.status(200).json(resObj)
}

// 根据username 和 videoID ，给用户的该视频的播放量+1
exports.user_video_playNum_inc = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, videoID } = req.query

  const user_videosModel = getUserVideosModel(username)

  await user_videosModel.increment(
    {
      videoPlayNum: 1
    },
    {
      where: {
        videoID
      }
    }
  )

  // 返回给前端一些信息
  const resObj = {
    msg: '此作者的视频播放量 增量成功',
    code: 2941
  }

  res.status(200).json(resObj)
}

// 根据username 和 videoID ，给用户的该视频的点赞量+1
exports.user_video_thumbNum_inc = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, videoID } = req.query

  const user_videosModel = getUserVideosModel(username)

  await user_videosModel.increment(
    {
      videoThumbNum: 1
    },
    {
      where: {
        videoID
      }
    }
  )

  // 返回给前端一些信息
  const resObj = {
    msg: '此作者的视频点赞量 增量成功',
    code: 2941
  }

  res.status(200).json(resObj)
}

// 用户文章上传
exports.user_articleUpload = async (req, res, next) => {
  // 此时 标题、封面 等 都可以获取 和 都已经存入服务器文件夹

  // console.log(req.body.articleTitle) // Example of accessing first text data
  // console.log(req.body.articleContent) // Example of accessing first text data
  // console.log(req.files.articleCover[0]) // Example of accessing image file data

  // 将信息存入数据库

  const username_user = req.params.username
  // 使用 sequelize.define(modelName, attributes, options) 定义一个模型

  const user_articlesModel = getUserArticlesModel(username_user)

  // await user_articlesModel.sync({   // 创建一张数据库表，若已存在，则先删除，再创建
  //   force: true
  // })

  // -----新增-----
  // 思路：以uid降序 查询数据库中的整个表，若结果集行数为0，则指定newUid为'001'
  // 否则，指定newUid为结果集第一行的uid+1（注意先将其转为number类型）
  const userArticlesTable_db = await user_articlesModel.findAll({
    order: [['articleID', 'DESC']]
  })

  // console.log("user table in database:", JSON.stringify(userTable_db, null, 2)); //json数据更易观察
  // console.log(userTable_db.length);

  let newArticleID

  if (userArticlesTable_db.length === 0) {
    newArticleID = '001'
  } else {
    // console.log(JSON.stringify(userTable_db[0]));
    // console.log(userTable_db[0].uid);

    newArticleID = +userArticlesTable_db[0].articleID + 1

    // 1~9
    if (newArticleID < 10) {
      newArticleID = `00${newArticleID}`
    }
    // 10~99
    else if (newArticleID < 100) {
      newArticleID = `0${newArticleID}`
    }
    // 100~999
    else if (newArticleID >= 1000) {
      const resObj = {
        msg: '新建文章失败！videoID溢出',
        code: 2940
      }

      console.log(
        '文章数量已经达到999，3位articleID已经全部分配完！新建文章失败！'
      )
      res.status(400).json(resObj)
      return
    }
  }

  // 将articleContent写入一个文件，然后得到文件的路径名

  console.log('__dirname: ', __dirname)

  const path_articleFile = path.join(
    __dirname,
    `../public/uploads/articles/${newArticleID}.txt`
  )

  fs.writeFile(
    path_articleFile,
    req.body.articleContent,
    'utf8',
    function (error) {
      if (error) {
        console.log('文章写入文件失败！')
        console.log(error.message)
        return
      }

      console.log('文章写入文件成功！')
    }
  )

  await user_articlesModel.create({
    articleID: newArticleID,
    articleAuthor: username_user,
    articleTitle: req.body.articleTitle,
    articleCoverSrc: pathProcess(req.files.articleCover[0].path),
    articleResSrc: path_articleFile,
    articleViewNum: 0,
    articleLikeNum: 0,
    articleReleaseTime: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  })

  res.send('Form data received!')
}

// 根据用户名 获取用户的文章列表
exports.user_articleList = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  console.log(req.params)

  const username_user = req.params.username

  console.log('用户的文章列表获取的 请求参数用户名 为：', username_user)

  const user_articlesModel = getUserArticlesModel(username_user)

  const userArticleList_db = await user_articlesModel.findAll()

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户的文章列表成功！',
    code: 2941,
    data: userArticleList_db
  }

  console.log(`获取用户的文章列表 ${userArticleList_db} 个人信息成功`)
  res.status(200).json(resObj)
}

// 根据articleID 获取单个文章详情
exports.user_article = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  console.log(req.query)

  const { username, articleID } = req.query

  const user_articlesModel = getUserArticlesModel(username)

  const userArticle_db = await user_articlesModel.findAll({
    where: {
      articleID
    }
  })

  // 根据文章的src，读取文件内容
  // console.log(userArticle_db[0].articleResSrc);

  fs.readFile(
    userArticle_db[0].articleResSrc,
    'utf8',
    function (error, dataStr_file) {
      if (error) {
        console.log('读取文件失败！')
        console.log(error.message)
        return
      }

      console.log('文件内容：')
      console.log(dataStr_file)

      // 返回给前端一些信息
      const resObj = {
        msg: '获取用户的文章成功！',
        code: 2941,
        data: {
          ...userArticle_db[0].dataValues,
          articleContent: dataStr_file
        }
      }

      res.status(200).json(resObj)
    }
  )
}

// 根据username 和 articleID 删除用户的单个文章
exports.user_article_delete = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, articleID } = req.query

  const user_articlesModel = getUserArticlesModel(username)

  await user_articlesModel.destroy({
    where: {
      articleID
    }
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '文章 删除成功',
    code: 2941
  }

  res.status(200).json(resObj)
}

// 根据username 和 articleID 修改用户的单个文章信息
exports.user_article_modify = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // console.log(req.body)
  // console.log(req.files);
  // console.log(req.files.articleCover[0])

  const { username, articleID, articleTitle, articleContent, articleResSrc } =
    req.body

  // console.log(articleResSrc);

  const user_articlesModel = getUserArticlesModel(username)

  // 传了封面
  if (req.files.articleCover) {
    const articleCoverSrc = req.files.articleCover[0].path

    await user_articlesModel.update(
      {
        articleTitle,
        articleCoverSrc
      },
      {
        where: {
          articleID
        }
      }
    )
  }
  // 没传封面
  else {
    await user_articlesModel.update(
      {
        articleTitle
      },
      {
        where: {
          articleID
        }
      }
    )
  }

  fs.writeFile(articleResSrc, articleContent, 'utf8', function (error) {
    if (error) {
      console.log('文章写入文件失败！')
      console.log(error.message)
      return
    }

    console.log('文章写入文件成功！')
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '文章信息 修改成功',
    code: 2941
  }

  res.status(200).json(resObj)
}

// 根据username 和 articleID ，给用户的该文章的浏览量+1
exports.user_article_viewNum_inc = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, articleID } = req.query

  const user_articlesModel = getUserArticlesModel(username)

  await user_articlesModel.increment(
    {
      articleViewNum: 1
    },
    {
      where: {
        articleID
      }
    }
  )

  // 返回给前端一些信息
  const resObj = {
    msg: '此作者的文章浏览量 增量成功',
    code: 2941
  }

  res.status(200).json(resObj)
}

// 根据username 和 articleID ，给用户的该视频的喜欢量+1
exports.user_article_LikeNum_inc = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, articleID } = req.query

  const user_articlesModel = getUserArticlesModel(username)

  await user_articlesModel.increment(
    {
      articleLikeNum: 1
    },
    {
      where: {
        articleID
      }
    }
  )

  // 返回给前端一些信息
  const resObj = {
    msg: '此作者的文章喜欢量 增量成功',
    code: 2941
  }

  res.status(200).json(resObj)
}

// --- 评论 ---

//  根据 username 和 videoID, 给对应用户的对应视频评论表中新增一个评论
exports.user_videoRemark_add = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, videoID, pid, speaker, remarkContent } = req.body

  const userVideoRemarksModel = getUserVideoRemarksModel(username, videoID)

  // 思路：以该用户名作为查询条件
  const userVideoRemarksList_db = await userVideoRemarksModel.findAll()

  const newID = userVideoRemarksList_db.length + 1

  await userVideoRemarksModel.create({
    id: newID,
    pid: +pid,
    speaker,
    remarkContent,
    postTime: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '新增评论成功！',
    code: 2941
  }

  res.status(200).json(resObj)
}

// 根据 username 和 videoID, 获取 用户的视频评论表 // 或 获取某个t1评论的详情评论
exports.user_videoRemark = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // console.log(req.params);

  const { username, videoID } = req.params

  const { id } = req.body

  const user_videoRemarksModel = getUserVideoRemarksModel(username, videoID)

  let resArr = []

  if (!id) {
    const remarkList_pid0_db = await user_videoRemarksModel.findAll({
      where: {
        pid: 0
      }
    })
    const remarkList_pid0 = remarkList_pid0_db.map((item) => item.dataValues)

    const remarkList_db = await user_videoRemarksModel.findAll()
    const remarkList = remarkList_db.map((item) => item.dataValues)

    resArr = remarkList_pid0.map((item_remarkList_pid0) => {
      if (
        remarkList.some(
          (item_remarkList) => item_remarkList.pid === item_remarkList_pid0.id
        )
      ) {
        return {
          ...item_remarkList_pid0,
          hasReply: true
        }
      } else {
        return {
          ...item_remarkList_pid0,
          hasReply: false
        }
      }
    })

    // 排序，并返回
    resArr = sortNodes(resArr)
  } else {
    // console.log(id);
    const remarkList_db = await user_videoRemarksModel.findAll()

    const remarkList = remarkList_db.map((item) => {
      return item.dataValues
    })

    const curRemark_db = await user_videoRemarksModel.findAll({
      where: {
        id: +id
      }
    })

    const curT1Node = curRemark_db[0].dataValues

    curT1Node.children = findChildren(remarkList, curT1Node.id)

    toFinalRemarkList(curT1Node, resArr)
  }

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户的视频评论表成功！',
    code: 2941,
    data: resArr
  }

  res.status(200).json(resObj)
}

// 根据username 给对应用户的消息表中 新增一个消息
exports.user_message_add = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { mTarget, mSource, mType, mTitle, mContent } = req.body

  console.log('用户消息表新增 获取的 请求参数用户名 为：', mTarget)

  const userMessagesModel = getUserMessagesModel(mTarget)

  // 思路：以该用户名作为查询条件
  const userMessagesResArr_db = await userMessagesModel.findAll({
    order: [['mID', 'DESC']]
  })

  let newMessageID

  if (userMessagesResArr_db.length === 0) {
    newMessageID = '001'
  } else {
    // console.log(JSON.stringify(userTable_db[0]));
    // console.log(userTable_db[0].uid);

    newMessageID = +userMessagesResArr_db[0].mID + 1

    // 1~9
    if (newMessageID < 10) {
      newMessageID = `00${newMessageID}`
    }
    // 10~99
    else if (newMessageID < 100) {
      newMessageID = `0${newMessageID}`
    }
    // 100~999
    else if (newMessageID >= 1000) {
      const resObj = {
        msg: '新建消息失败！mID溢出',
        code: 2940
      }

      console.log('消息数量已经达到999，3位mID已经全部分配完！新建消息失败！')
      res.status(400).json(resObj)
      return
    }
  }

  await userMessagesModel.create({
    mID: newMessageID,
    mType,
    mState: 'pending',
    mStateResult: '',
    mSource,
    mTitle,
    mContent,
    mDate: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '新增好友申请消息成功！',
    code: 2941
  }

  console.log('新增好友申请消息成功')
  res.status(200).json(resObj)
}

// 根据用户名 获取用户的消息列表
exports.user_messageList = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // console.log(req.params);

  const username_user = req.params.username

  // console.log('用户的消息列表获取的 请求参数用户名 为：', username_user);

  const user_messagesModel = getUserMessagesModel(username_user)

  const userMessageList_db = await user_messagesModel.findAll()

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户的消息列表成功！',
    code: 2941,
    data: userMessageList_db
  }

  // console.log(`获取用户的消息列表 ${userMessageList_db} 个人信息成功`)
  res.status(200).json(resObj)
}

// 根据mID 获取用户的单个消息详情
exports.user_message = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // console.log(req.query);

  const { username, mID } = req.query

  const user_messagesModel = getUserMessagesModel(username)

  // 思路：以该uid作为查询条件
  const userMessagesResArr_db = await user_messagesModel.findAll({
    where: {
      mID
    }
  })

  if (userMessagesResArr_db.length > 0) {
    // 返回给前端一些信息
    const resObj = {
      msg: '获取用户消息成功！',
      code: 2941,
      data: userMessagesResArr_db[0]
    }

    // console.log(`获取用户消息成功`)
    res.status(200).json(resObj)
  } else {
    // 返回给前端一些信息
    const resObj = {
      msg: 'mID错误！ 不存在此消息！',
      code: 2940
    }

    console.log('mID错误！ 不存在此消息！')
    res.status(400).json(resObj)
  }
}

// 根据mID 更新用户的单个消息
exports.user_message_update = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  // console.log(req.body);
  const { username, mID, mState, mStateResult } = req.body

  const user_messagesModel = getUserMessagesModel(username)

  // 思路：以该mID作为查询条件
  const userMessagesResArr_db = await user_messagesModel.findAll({
    where: {
      mID
    }
  })

  if (userMessagesResArr_db.length > 0) {
    userMessagesResArr_db[0].update({
      mState,
      mStateResult
    })

    // 返回给前端一些信息
    const resObj = {
      msg: '更新用户消息成功！',
      code: 2941
    }

    // console.log(`更新用户消息成功`)
    res.status(200).json(resObj)
  } else {
    // 返回给前端一些信息
    const resObj = {
      msg: 'mID错误！ 不存在此消息！',
      code: 2940
    }

    console.log('mID错误！ 不存在此消息！')
    res.status(400).json(resObj)
  }
}

// 根据username 给对应用户的订阅表中新增一个记录
exports.user_subscription_add = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username_user, username_author, uid_author } = req.body

  const user_subscriptionsModel = getUserSubscriptionsModel(username_user)

  const userSubscriptionsResArr_db = await user_subscriptionsModel.findAll({
    order: [['id', 'DESC']]
  })

  let id

  if (userSubscriptionsResArr_db.length === 0) {
    id = '001'
  } else {
    id = +userSubscriptionsResArr_db[0].id + 1

    // 1~9
    if (id < 10) {
      id = `00${id}`
    }
    // 10~99
    else if (id < 100) {
      id = `0${id}`
    }
    // 100~999
    else if (id >= 1000) {
      const resObj = {
        msg: '新建订阅失败！id溢出',
        code: 2940
      }

      res.status(400).json(resObj)
      return
    }
  }

  await user_subscriptionsModel.create({
    id,
    username: username_author,
    uid: uid_author,
    subscriptionTime: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  })

  // // 给 被订阅者 的subscriber +1
  // await userModel.increment({
  //     'subscriber': 1
  // }, {
  //     where: {
  //         uid: uid_author
  //     }
  // })

  res.status(200).end()
}

// 根据用户名 获取用户的订阅列表
exports.user_subscription = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const username_user = req.params.username

  const user_subscriptionsModel = getUserSubscriptionsModel(username_user)

  const userSubscriptionsList_db = await user_subscriptionsModel.findAll()

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户的订阅列表成功！',
    code: 2941,
    data: userSubscriptionsList_db
  }

  res.status(200).json(resObj)
}

// 根据username 和 username_author 删除用户订阅表中的一条记录
exports.user_subscription_delete = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, username_author } = req.params

  const user_subscriptionsModel = getUserSubscriptionsModel(username)

  await user_subscriptionsModel.destroy({
    where: {
      username: username_author
    }
  })

  // // 给 被订阅者 的subscriber -1
  // await userModel.decrement({
  //     'subscriber': 1
  // }, {
  //     where: {
  //         username: username_author
  //     }
  // })

  // 返回给前端一些信息
  const resObj = {
    msg: '取消订阅成功！',
    code: 2941
  }

  res.status(200).json(resObj)
}

// ----------
// 根据username 给对应用户的订阅者表中新增一个记录
exports.user_subscriber_add = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username_user, username_mySubscriber, uid_mySubscriber } = req.body

  const user_subscribersModel = getUserSubscribersModel(username_user)

  const userSubscribersResArr_db = await user_subscribersModel.findAll({
    order: [['id', 'DESC']]
  })

  let id

  if (userSubscribersResArr_db.length === 0) {
    id = '001'
  } else {
    id = +userSubscribersResArr_db[0].id + 1

    // 1~9
    if (id < 10) {
      id = `00${id}`
    }
    // 10~99
    else if (id < 100) {
      id = `0${id}`
    }
    // 100~999
    else if (id >= 1000) {
      const resObj = {
        msg: '新建订阅者失败！id溢出',
        code: 2940
      }

      res.status(400).json(resObj)
      return
    }
  }

  await user_subscribersModel.create({
    id,
    username: username_mySubscriber,
    uid: uid_mySubscriber,
    subscriptionTime: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  })

  res.status(200).end()
}

// 根据用户名 获取用户的订阅者列表
exports.user_subscriber = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const username_user = req.params.username

  const user_subscribersModel = getUserSubscribersModel(username_user)

  const userSubscribersList_db = await user_subscribersModel.findAll()

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户的订阅者列表成功！',
    code: 2941,
    data: userSubscribersList_db
  }

  res.status(200).json(resObj)
}

// 根据username 和 username_author 删除用户订阅者表中的一条记录
exports.user_subscriber_delete = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, username_subscriber } = req.params

  const user_subscribersModel = getUserSubscribersModel(username)

  await user_subscribersModel.destroy({
    where: {
      username: username_subscriber
    }
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '订阅者取消订阅成功！',
    code: 2941
  }

  res.status(200).json(resObj)
}
// ----------

// 根据username 给对应用户的好友表中 新增一个好友 并且 给对应用户新建一张与此好友的聊天记录表
exports.user_friend_add = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username_self, uid_friend, username_friend } = req.body

  // console.log('--------------------------------\n', req.body);

  // console.log('用户好友表新增 获取的 请求参数用户名 为：', username_self);

  const user_friendsModel = getUserFriendsModel(username_self)

  await user_friendsModel.create({
    uid: uid_friend
  })

  // 给对应用户新建一张与此好友的聊天记录表
  const userChattingLogModel = getUserChattingLogModel(
    username_self,
    username_friend
  )

  userChattingLogModel.sync()

  // ----- 注意：此处是新创建一张表，而不是给一张表里面新创建一条记录！

  // 返回给前端一些信息
  const resObj = {
    msg: '新增好友成功！',
    code: 2941
  }

  res.status(200).json(resObj)
}

// 根据用户名 获取用户的好友列表
exports.user_friendList = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const username_user = req.params.username

  // console.log('用户的好友列表获取的 请求参数用户名 为：', username_user);

  const user_friendsModel = getUserFriendsModel(username_user)

  const userFriendList_db = await user_friendsModel.findAll()

  const userList_db = await userModel.findAll()

  const resList = userList_db.filter((item) => {
    for (let i = 0; i < userFriendList_db.length; i++) {
      if (userFriendList_db[i].uid === item.uid) {
        return true
      }
    }
    return false
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户的好友列表成功！',
    code: 2941,
    data: resList
  }

  // console.log(`获取用户的文章列表 ${userFriendList_db} 个人信息成功`)
  res.status(200).json(resObj)
}

// 根据username和username_friend，给username用户的username_username_friend_chattingLog表中新增一条聊天记录
exports.user_chattingLog_add = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { cmSender, cmReceiver, cmContent } = req.body

  // console.log(`用户聊天记录表新增 获取的 请求参数用户名 为 ${cmSender} 和 ${cmReceiver}`);

  // --给username_username_friend_chattingLog表中新增一条聊天记录--
  const userChattingLogModel_cmSender = getUserChattingLogModel(
    cmSender,
    cmReceiver
  )

  // 思路：以cmID作为查询条件
  const userChattingLogResArr_db_cmSender =
    await userChattingLogModel_cmSender.findAll({
      order: [['cmID', 'DESC']]
    })

  let cmID_cmSender

  if (userChattingLogResArr_db_cmSender.length === 0) {
    cmID_cmSender = '001'
  } else {
    // 注意表的属性cmID是固定的，而不是自己定义的临时变量名cmID_cmSender或cmID_cmReceiver
    cmID_cmSender = +userChattingLogResArr_db_cmSender[0].cmID + 1

    // 1~9
    if (cmID_cmSender < 10) {
      cmID_cmSender = `00${cmID_cmSender}`
    }
    // 10~99
    else if (cmID_cmSender < 100) {
      cmID_cmSender = `0${cmID_cmSender}`
    }
    // 100~999
    else if (cmID_cmSender >= 1000) {
      const resObj = {
        msg: '新建聊天消息失败！cmID溢出',
        code: 2940
      }

      console.log(
        '聊天消息数量已经达到999，3位cmID已经全部分配完！新建聊天消息失败！'
      )
      res.status(400).json(resObj)
      return
    }
  }

  await userChattingLogModel_cmSender.create({
    cmID: cmID_cmSender,
    cmType: 'text',
    cmSender,
    cmReceiver,
    cmContent,
    cmDate: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  })

  // --给username_friend_username_chattingLog表中新增一条相同的聊天记录--
  const userChattingLogModel_cmReceiver = getUserChattingLogModel(
    cmReceiver,
    cmSender
  )

  // 思路：以cmID作为查询条件
  const userChattingLogResArr_db_cmReceiver =
    await userChattingLogModel_cmReceiver.findAll({
      order: [['cmID', 'DESC']]
    })

  let cmID_cmReceiver

  if (userChattingLogResArr_db_cmReceiver.length === 0) {
    cmID_cmReceiver = '001'
  } else {
    // 注意表的属性cmID是固定的，而不是自己定义的临时变量名cmID_cmSender或cmID_cmReceiver
    cmID_cmReceiver = +userChattingLogResArr_db_cmReceiver[0].cmID + 1

    // 1~9
    if (cmID_cmReceiver < 10) {
      cmID_cmReceiver = `00${cmID_cmReceiver}`
    }
    // 10~99
    else if (cmID_cmReceiver < 100) {
      cmID_cmReceiver = `0${cmID_cmReceiver}`
    }
    // 100~999
    else if (cmID_cmReceiver >= 1000) {
      const resObj = {
        msg: '新建聊天消息失败！cmID溢出',
        code: 2940
      }

      console.log(
        '聊天消息数量已经达到999，3位cmID已经全部分配完！新建聊天消息失败！'
      )
      res.status(400).json(resObj)
      return
    }
  }

  await userChattingLogModel_cmReceiver.create({
    cmID: cmID_cmReceiver,
    cmType: 'text',
    cmSender,
    cmReceiver,
    cmContent,
    cmDate: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '新增聊天消息成功！',
    code: 2941
  }

  // console.log(`新增聊天消息成功`)
  res.status(200).json(resObj)
}

// 获取 用户与好友的聊天记录表
exports.user_chattingLog = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username, username_friend } = req.params

  // console.log(`获取用户与好友的聊天记录表的 请求参数用户名 为: ${username} 和 ${username_friend}`);

  const userChattingLogModel = getUserChattingLogModel(
    username,
    username_friend
  )

  const userChattingLogList_db = await userChattingLogModel.findAll()

  // 返回给前端一些信息
  const resObj = {
    msg: '获取用户与好友的聊天记录表成功！',
    code: 2941,
    data: userChattingLogList_db
  }

  // console.log(`获取用户与好友的聊天记录表成功`)
  res.status(200).json(resObj)
}

// 新增一条nsp表的记录 保存 用户 与 好友 的username ， 再创建一个nsp，
exports.user_nsp_add = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username1, username2 } = req.body

  // ---- 测试 是否可以访问到io对象的VIKIM属性
  // console.log(req.app.get('io').VIKIM);
  // ---- 测试

  // ----- 先查找nsp表，看看同时具有这两个用户名的记录是否存在

  const nspResArr_db = await rowInNspTable(username1, username2)

  // let nspResArr_db = await nspModel.findAll({
  //     where: {
  //         username1,
  //         username2
  //     }
  // })

  // if (nspResArr_db.length <= 0) {
  //     nspResArr_db = await nspModel.findAll({
  //         where: {
  //             username1: username2,
  //             username2: username1
  //         }
  //     })
  // }

  // 若存在，表示服务器已经建立了这两个用户之间的nsp，故直接返回数据库的对应记录，然后return
  if (nspResArr_db) {
    // 返回给前端一些信息
    const resObj = {
      msg: '获取nsp成功！',
      code: 2941,
      data: nspResArr_db[0]
    }

    console.log('---获取nsp成功---')
    res.status(200).json(resObj)

    return
  }

  // 若不存在，则新增记录，并创建一个nsp，然后返回 -----
  const nspTable_db = await nspModel.findAll({
    order: [['nspID', 'DESC']]
  })

  let newNspID

  if (nspTable_db.length === 0) {
    newNspID = '001'
  } else {
    newNspID = +nspTable_db[0].nspID + 1

    // 1~9
    if (newNspID < 10) {
      newNspID = `00${newNspID}`
    }
    // 10~99
    else if (newNspID < 100) {
      newNspID = `0${newNspID}`
    }
    // 100~999
    else if (newNspID >= 1000) {
      const resObj = {
        msg: '新建nsp失败！nspID溢出',
        code: 2940
      }

      console.log('nsp数量已经达到999，3位nspID已经全部分配完！新建nsp失败！')
      res.status(400).json(resObj)
      return
    }
  }

  // -----将用户信息 写入数据库-----
  await nspModel.create({
    nspID: newNspID,
    username1,
    username2
  })

  // 创建一个nsp (是否需要用到全局对象的属性?)
  nsp[newNspID] = req.app.get('io').of(newNspID)

  // 每当有一个客户端 连接到了该nsp(即 this.socket = io(`${baseURL}/${nspData.nspID}`))，就会监听到connection事件！
  nsp[newNspID].on('connection', (socket) => {
    console.log('--- A user connected ---')

    // socket.io服务器 监听(on)客户端为'msg'的emit，并做出响应
    //  -----  注意  -----
    // 无论 该user_nsp_add接口会不会被前端调用，只要前端 emit 一个消息，,该socket就会收到，接着就会执行里面的方法
    // 所以，当用户A和B建立nsp后，如果某刻A关闭了会话(会 删除它们建立的nsp 和 数据库表对应的记录)，
    // 此时B再发送消息时，服务器中该nsp的socket还没有删除，还会监听到 newMsg ，故还会使用 nsp[newNspID].emit('newMsg') 把它广播出去
    // 所以在广播之前，先判断 nsp[newNspID] 是否存在
    socket.on('newMsg', async (msg) => {
      // io或nsp.emit()是 广播

      if (nsp[newNspID]) {
        nsp[newNspID].emit('newMsg')
      }
    })
  })

  // 返回给前端一些信息
  const resObj = {
    msg: '新增nsp成功！',
    code: 2941,
    data: {
      nspID: newNspID,
      username1,
      username2
    }
  }

  // console.log('新增nsp成功！')
  res.status(200).json(resObj)
}

// 获取 用户 与 好友 的username 对应nsp表的那一条记录
exports.user_nsp = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username1, username2 } = req.query

  // ----- 先查找nsp表，看看同时具有这两个用户名的记录是否存在

  const nspResArr_db = await rowInNspTable(username1, username2)

  const resObj = {
    msg: '查询nsp记录成功！',
    code: 2941,
    data: nspResArr_db
  }

  res.status(200).json(resObj)
}

// 清除 用户 与 好友 的username 对应nsp表的那一条记录 并根据记录的nspID 清除对应的nsp
exports.user_nsp_delete = async function (req, res, next) {
  // 设置响应数据的类型，响应的数据应是一个对象，包含状态码code和信息msg
  res.setHeader('Content-Type', 'application/json;charset=utf-8')

  const { username1, username2 } = req.query

  // ---- 测试 是否可以访问到io对象的VIKIM属性
  // console.log(req.app.get('io').VIKIM);
  // ---- 测试

  // ----- 先查找nsp表，看看同时具有这两个用户名的记录是否存在

  const nspResArr_db = await rowInNspTable(username1, username2)

  let nspID

  // console.log('nsp: ', nsp);

  // 若存在，表示服务器已经建立了这两个用户之间的nsp，故直接删除此 nsp 和 数据库的对应记录
  if (nspResArr_db) {
    nspID = nspResArr_db[0].dataValues.nspID

    // console.log(nsp[nspID].sockets)
    // nsp[newNspID].sockets 是该命名空间上的所有sockets组成的一个Map

    // 遍历 nsp[nspID].sockets 里的 socket
    // for (const [socketID, socket] of nsp[nspID].sockets) {
    // console.log('socketID', socketID)

    // --- 移除该 socket 的所有的newMsg监听 --- (不恰当)
    // socket.removeAllListeners()
    // 注意：用户A可能会关闭聊天窗口，导致该接口被调用，但用户B可能并不会关闭聊天窗口，所以在此处遍历所有用户socket，然后清除对应的newMsg监听 是不恰当的

    // --- 关闭该 socket --- (不恰当)
    // socket.disconnect()
    // 注意：用户A可能会关闭聊天窗口，导致执行 this.socket.disconnect()，并且该接口被调用，但用户B可能并不会关闭聊天窗口，所以不会执行 this.socket.disconnect()
    // 所以，不应该在服务器端，将A和B的 socket 都执行socket.disconnect()，应该由用户自己来决定什么时候执行 this.socket.disconnect()
    // }

    // 为了清除 nsp[nspID].on('connection',...) 事件监听
    nsp[nspID].removeAllListeners()

    // 删除此 nsp
    nsp[nspID] = null

    // 删除 数据库的对应记录
    await nspModel.destroy({
      where: {
        nspID
      }
    })

    res.status(200).end('删除nsp成功')
    return
  }

  res.status(200).end()
}

// ---------------完全多此一举！ 只需指定好上传文件的后缀名就行了
// 将服务器接收的用户上传的图片(二进制数据)，转换为图图片数据格式，然后存放在uploads/images文件夹下
// exports.user_uploadImg = async function (req, res, next) {

//     // req.file contains information about the uploaded file
//     // req.body contains any form data that was submitted with the request(如果有的话)

//     // console.log(req.file); //上传的二进制文件的信息，具有path属性等

//     // 读/写文件 必须使用 同步方法readFileSync ！  不要在这里使用await修饰符 ， 无效！
//     const binaryData_img = fs.readFileSync(req.file.path) //省略了encoding参数: 'binary'

//     // ----
//     // tip：在node.js 16.0.0版本之后，读/写文件时不再使用encoding参数，而是使用 buffer
//     // 使用buffer更加简便，读文件只需指定文件路径，写文件只需指定输出的文件路径和所要写入文件的数据
//     // 通过文件路径末尾的文件扩展名，就知道输出文件的类型了，因此无需再写encoding参数
//     // ----

//     // 分配一个新的Buffer
//     const decodedImage = Buffer.from(binaryData_img, 'binary')
//     // 虽然不写此行代码仍能运行，但无法保证在其他情况下不会出错

//     // 构造文件的写入目录路径
//     // 注意：以后尽量使用绝对路径，且写入目录路径中的所有文件夹必须存在，而末尾的文件名若不存在，会自动创建
//     const filepath = path.join(__dirname, `../uploads/images/${req.file.originalname}`)

//     // 写文件
//     fs.writeFileSync(filepath, decodedImage) //省略了encoding参数: 'binary'

//     res.send('image file upload and saved successfully!')

// }

// exports.user_uploadVideo = async function (req, res, next) {

//     // console.log(req.file); //上传的二进制文件的信息，具有path属性等

//     // 读/写文件 必须使用 同步方法readFileSync ！  不要在这里使用await修饰符 ， 无效！
//     const binaryData_video = fs.readFileSync(req.file.path)

//     // 分配一个新的Buffer
//     const decodedVideo = Buffer.from(binaryData_video, 'binary')

//     // // 构造文件的写入目录路径
//     // // 注意：以后尽量使用绝对路径，且写入目录路径中的所有文件夹必须存在，而末尾的文件名若不存在，会自动创建
//     const filepath = path.join(__dirname, `../uploads/videos/${req.file.originalname}`)

//     // // 写文件
//     fs.writeFileSync(filepath, decodedVideo)

//     res.send('video file upload and saved successfully!')

// }
