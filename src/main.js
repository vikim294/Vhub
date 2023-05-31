
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//
import { Button } from 'element-ui'
//
import NavBarStatic from '@/components/NavBarStatic.vue'
import NavBarDynamic from '@/components/NavBarDynamic.vue'

//
import '@/styles/common.less'

// 传入一个具有install函数的对象
import { timer } from '@/utils/state'

// 刷新页面后，main.js会重新执行
// console.log('------------------')
// 所以在 login页面，当用户登录后执行过this.$initState()，Vue实例上挂载的$timerID属性会不复存在

// tip: 往Vue实例上挂载属性，也可直接传入一个回调
// Vue.use((Vue) => {
//   Vue.prototype.$timerID = 294
// })

//
Vue.use(Button)
// 使用插件
Vue.use(timer)

Vue.component('NavBarStatic', NavBarStatic)
Vue.component('NavBarDynamic', NavBarDynamic)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
