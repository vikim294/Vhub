import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

import { updateState } from '@/api/user.js'

Vue.use(VueRouter)

const routes = [
  // 注册
  {
    path: '/register',
    component: () => import('@/views/Register/index.vue')
  },
  // 登录
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue')
  },
  // 首页
  {
    path: '/',
    component: () => import('@/views/Home/index.vue')
  },
  // 布局
  {
    path: '/user',
    component: () => import('@/Layout/index.vue'),
    children: [
      // 个人中心
      {
        path: 'pInfo',
        component: () => import('@/views/PInfo/index.vue')
      },
      // 创作中心
      {
        path: 'pFactory',
        component: () => import('@/views/PFactory/index.vue')
      },
      // 消息中心
      {
        path: 'pMessage',
        component: () => import('@/views/PMessage/index.vue')
      },
      // 收藏中心
      {
        path: 'pCollect',
        component: () => import('@/views/PCollect/index.vue')
      },
      // 社交中心
      {
        path: 'pSocial',
        component: () => import('@/views/PSocial/index.vue')
      }

    ]
  },
  // 布局-详情
  {
    path: '/userDetail',
    component: () => import('@/LayoutDetail/index.vue'),
    children: [
      // 视频详情
      {
        path: 'video',
        component: () => import('@/views/VideoDetail/index.vue')
      },
      // 文章详情
      {
        path: 'article',
        component: () => import('@/views/ArticleDetail/index.vue')
      },
      // 文章编辑
      {
        path: 'articleEdit',
        component: () => import('@/views/ArticleEdit/index.vue')
      },
      // 搜索
      {
        path: 'search',
        component: () => import('@/views/Search/index.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const whiteList = ['/login', '/register']
router.beforeEach((to, from, next) => {
  if (store.state.userInfo.username) {
    // 如果已经登录
    if (whiteList.includes(to.path)) {
      // 访问白名单页面 , 跳转到首页
      next('/')
    } else {
      // 访问非白名单页面 , 放行
      next()
    }
  } else {
    // 如果未登录
    if (whiteList.includes(to.path)) {
      // 访问白名单页面 , 放行
      next()
    } else {
      // 访问非白名单页面 , 跳转登录页
      next('/login')
    }
  }
})

router.afterEach(async (to, from) => {
  // 如果(已登录用户)跳转到了 非白名单页面
  if (!whiteList.includes(to.path)) {
    // 如果用户状态定时器timerID为undefined (即：用户刷新了页面，注意：路由之间的切换不会导致timerID为undefined)
    if (Vue.prototype.$timerID === undefined) {
      // 一个已登录的用户刷新了页面，故其一定在线，故直接更新在线状态
      await updateState()
      // 重开一个定时器
      // Vue 就是任何组件里面的 this
      Vue.prototype.$initState()
    }
  }
})

export default router
