<template>
  <div>
    <div class="header">
      <div class="wrapper">
        <div class="nav">
          <div class="wrapper">
            <div class="logoBox"></div>

            <div class="logout">
              <div class="l">
                <div class="avatar">
                  <img :src="userInfo.imgSrc" alt="" />
                </div>
                <div class="username">{{userInfo.username}}</div>
              </div>
              <div class="r">
                <button type="button" @click="logout_">退出登录</button>
              </div>
            </div>

            <div class="search">
              <input type="text" id="search-input" />
              <button id="search-btn">
                <i class="bi bi-search"></i>
              </button>
            </div>

            <!--  -->
            <nav-bar-static></nav-bar-static>
          </div>
        </div>
      </div>
    </div>

    <main>
      <div class="wrapper">
        <div class="video-panel space-video-panel">
          <div class="p-head">
            <div class="title">
              <i class="bi bi-moon-stars"></i>
              <span>天文</span>
            </div>
            <div class="op">
              <button type="button" class="change">
                <i class="bi bi-arrow-repeat"></i>
                <span>换一批</span>
              </button>
            </div>
          </div>
          <div class="p-body">
            <div class="v-item">
              <div class="t">
                <img src="" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    3662
                  </span>
                  <span class="duration"> 03:21 </span>
                </div>
              </div>
              <!--  -->
              <div class="b">
                <div class="title">
                  标题标题标题标题标题标题标题标题标题标标题标题
                </div>
                <div class="author">作者</div>
              </div>
            </div>
            <div class="v-item">
              <div class="t">
                <img src="" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    3662
                  </span>
                  <span class="duration"> 03:21 </span>
                </div>
              </div>
              <!--  -->
              <div class="b">
                <div class="title">
                  标题标题标题标题标题标题标题标题标题标标题标题
                </div>
                <div class="author">作者</div>
              </div>
            </div>
            <div class="v-item">
              <div class="t">
                <img src="" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    3662
                  </span>
                  <span class="duration"> 03:21 </span>
                </div>
              </div>
              <!--  -->
              <div class="b">
                <div class="title">
                  标题标题标题标题标题标题标题标题标题标标题标题
                </div>
                <div class="author">作者</div>
              </div>
            </div>
            <div class="v-item">
              <div class="t">
                <img src="" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    3662
                  </span>
                  <span class="duration"> 03:21 </span>
                </div>
              </div>
              <!--  -->
              <div class="b">
                <div class="title">
                  标题标题标题标题标题标题标题标题标题标标题标题
                </div>
                <div class="author">作者</div>
              </div>
            </div>
            <div class="v-item">
              <div class="t">
                <img src="" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    3662
                  </span>
                  <span class="duration"> 03:21 </span>
                </div>
              </div>
              <!--  -->
              <div class="b">
                <div class="title">
                  标题标题标题标题标题标题标题标题标题标标题标题
                </div>
                <div class="author">作者</div>
              </div>
            </div>
            <div class="v-item">
              <div class="t">
                <img src="" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    3662
                  </span>
                  <span class="duration"> 03:21 </span>
                </div>
              </div>
              <!--  -->
              <div class="b">
                <div class="title">
                  标题标题标题标题标题标题标题标题标题标标题标题
                </div>
                <div class="author">作者</div>
              </div>
            </div>
            <div class="v-item">
              <div class="t">
                <img src="" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    3662
                  </span>
                  <span class="duration"> 03:21 </span>
                </div>
              </div>
              <!--  -->
              <div class="b">
                <div class="title">
                  标题标题标题标题标题标题标题标题标题标标题标题
                </div>
                <div class="author">作者</div>
              </div>
            </div>
            <div class="v-item">
              <div class="t">
                <img src="" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    3662
                  </span>
                  <span class="duration"> 03:21 </span>
                </div>
              </div>
              <!--  -->
              <div class="b">
                <div class="title">
                  标题标题标题标题标题标题标题标题标题标标题标题
                </div>
                <div class="author">作者</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getUserInfo, logout } from '@/api/user'

export default {
  name: 'home-page',

  created () {
    // 根据store里userInfo的username，调接口，获取用户信息
    this.getUserInfo_()
  },

  data () {
    return {
      userInfo: {
        imgSrc: '',
        username: ''
      }
    }
  },

  methods: {
    async getUserInfo_ () {
      // 根据用户名 获取用户信息
      const res = await getUserInfo(this.$store.state.userInfo.username)
      console.log(res)
      // 保存用户信息到全局数据
      this.$store.commit('setUserInfo', res.data)
      // 渲染用户信息
      this.userInfo.username = res.data.username
      this.userInfo.imgSrc = res.data.avatar
    },

    // 退出登录
    async logout_ () {
      await logout()
      this.$store.commit('delUserInfo')
      // 清除用户在线状态定时器
      this.$clearState()
      // 跳转
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less">
body {
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: #ffffff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d36e80;
  }
}
</style>

<style lang="less" scoped src="@/styles/index.less"></style>
