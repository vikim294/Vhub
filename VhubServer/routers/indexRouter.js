const express = require('express')

const router = express.Router()

// 导入控制器模块
const indexController = require('../controllers/indexController')

// 即：浏览器访问 /Vhub，则：
router.get('/', indexController.index)

module.exports = router
