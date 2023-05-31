// 除register和login外的每个网页都会执行

import { updateState } from '@/api/user.js'

// 导出timer对象
export const timer = {
  install (Vue) {
    // 挂载 initState 全局方法
    Vue.prototype.$initState = () => {
      Vue.prototype.$timerID = setInterval(async () => {
        // 每60秒更新一次用户的在线状态
        const RUTC = localStorage.getItem('userTime') || 60
        // 用户登陆跳转到首页后，此时RUTC为60
        if (RUTC <= 1) {
          localStorage.setItem('userTime', 60)
          // 请求重置服务器的用户121s定时器
          await updateState()
        } else {
          localStorage.setItem('userTime', RUTC - 1)
        }
      }, 1000)
    }
    // 挂载 clearState 全局方法
    Vue.prototype.$clearState = () => {
      // 清除定时器
      clearInterval(Vue.prototype.$timerID)
      // 置全局数据 timerID 为undefined
      Vue.prototype.$timerID = undefined
      // 清除本地存储 userTime
      localStorage.removeItem('userTime')
    }
  }
}
