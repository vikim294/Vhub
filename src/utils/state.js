// 除register和login外的每个网页都会执行

import { updateState } from '@/api/user.js'

// 导出一个对象(timer)，对象里需要有个install方法，形参为 Vue
export const timer = {
  install (Vue) {
    // 挂载 initState 全局方法
    Vue.prototype.$initState = () => {
      Vue.prototype.$timerID = setInterval(async () => {
        await updateState()
      }, 60000)
    }
    // 挂载 clearState 全局方法
    Vue.prototype.$clearState = () => {
      // 清除定时器
      clearInterval(Vue.prototype.$timerID)
      // 置全局数据 timerID 为undefined
      Vue.prototype.$timerID = undefined
    }
  }
}
