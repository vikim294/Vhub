<template>
  <div>
    <main>
      <div class="wrapper">
        <div class="userInfo">
          <div class="top">
            <div class="l">
              <div class="avatar">
                <img :src="userInfo.avatar" alt="" />
              </div>
              <div class="username">
                {{ userInfo.username }}
              </div>
            </div>
            <div class="r">
              <div class="subscriber" @click="goToCollect">
                <div class="num">{{ userSubscriber.length }}</div>
                <div class="tag">{{ isCurUser ? "我的订阅者" : "订阅者" }}</div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="selfIntro">
              {{ userInfo.selfIntro }}
            </div>
          </div>
        </div>

        <div class="tabbar">
          <a
            href="javascript:;"
            :class="`myVideo ${curPanel === 'video' ? 'active' : ''}`"
            @click="togglePanel('video')"
          >
            <i class="bi bi-caret-right-fill"></i>
            我的视频
          </a>
          <a
            href="javascript:;"
            :class="`myArticle ${curPanel === 'article' ? 'active' : ''}`"
            @click="togglePanel('article')"
          >
            <i class="bi bi-caret-right-fill"></i>
            我的文章
          </a>
        </div>
        <div class="container">
          <div class="videoPanel" v-if="curPanel === 'video'">
            <router-link
              :to="`/userDetail/video?username=${userInfo.username}&videoID=${item.videoID}`"
              class="v-item"
              v-for="item in userVideoList"
              :key="item.videoID"
            >
              <div class="t">
                <img :src="item.videoCoverSrc" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    {{ item.videoPlayNum }}
                  </span>
                  <span class="duration">
                    {{ durationFormat_(item.videoDuration) }}
                  </span>
                </div>
              </div>
              <div class="b">
                <div class="title">
                  {{ item.videoTitle }}
                </div>
                <div class="author">{{ item.videoAuthor }}</div>
              </div>
            </router-link>
            <div class="v-item add" @click="videoFormShow = true">
              <i class="bi bi-plus-square-dotted"></i>
            </div>
          </div>
          <div class="articlePanel" v-else>
            <a
              href="javascript:;"
              class="a-item"
              v-for="item in userArticleList"
              :key="item.articleID"
            >
              <div class="t">
                <img :src="item.articleCoverSrc" alt="" />
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-eye"></i>
                    {{ item.articleViewNum }}
                  </span>
                </div>
              </div>
              <div class="b">
                <div class="title">
                  {{ item.articleTitle }}
                </div>
                <div class="author">{{ item.articleAuthor }}</div>
              </div>
            </a>
            <div
              class="a-item add"
              @click="$router.push('/userDetail/articleEdit')"
            >
              <i class="bi bi-pen"></i>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="videoMask" v-show="videoFormShow">
      <div class="container_mask">
        <div class="v-add">
          <form @submit="submit">
            <div class="title">
              <label for="title">视频标题</label>
              <input
                type="text"
                id="title"
                name="title"
                v-model="form.videoTitle"
              />
            </div>
            <div class="intro">
              <label for="intro">视频介绍</label>
              <textarea
                name="intro"
                id="intro"
                v-model="form.videoIntro"
              ></textarea>
            </div>
            <div class="type">
              <label for="type">视频类型</label>
              <select name="type" id="type" v-model="form.videoType">
                <option value="00">请选择</option>
                <option value="01">日常</option>
                <option value="02">游戏</option>
                <option value="03">天文</option>
              </select>
            </div>
            <div class="cover">
              <label for="cover">视频封面</label>
              <input
                type="file"
                name="cover"
                id="cover"
                @change="selectedCoverChange"
              />
            </div>
            <div class="video">
              <label for="video">视频</label>
              <input
                type="file"
                name="video"
                id="video"
                @change="selectedVideoChange"
              />
            </div>
            <div class="submit">
              <button type="submit">上传</button>
            </div>
          </form>
        </div>
        <!-- <div class="a-add"></div> -->
        <div class="close" @click="closeMask">
          <i class="bi bi-x-lg"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getUserInfo,
  getUserSubscriber,
  getUserVideoList,
  getUserArticleList,
  uploadVideo
} from '@/api/user'
import { durationFormat } from '@/utils/tools'

export default {
  name: 'pfactory-page',

  created () {
    this.$emit('changeBgI', 'pFactory')

    // 一进入页面 根据是否具有路径参数username来判断当前是否是本用户的创作中心
    if (this.$route.query.username) {
      // 渲染该作者的创作中心
      this.isCurUser = false
      this.render(this.$route.query.username)
    } else {
      // 渲染本用户的创作中心
      this.isCurUser = true
      this.render(this.$store.state.userInfo.username)
    }
  },

  data () {
    return {
      userInfo: {},
      userSubscriber: [],
      isCurUser: true,
      curPanel: 'video',
      userVideoList: [],
      userArticleList: [],
      videoFormShow: false,
      form: {}
    }
  },

  methods: {
    durationFormat_ (d) {
      return durationFormat(d)
    },

    async render (username) {
      const { data: userInfo } = await getUserInfo(username)
      const { data: userSubscriber } = await getUserSubscriber(username)
      this.userInfo = userInfo
      this.userSubscriber = userSubscriber

      this.getUserVideoList_(username)
    },

    async getUserVideoList_ (username) {
      const { data: userVideoList } = await getUserVideoList(username)
      this.userVideoList = userVideoList
    },

    async getUserArticleList_ (username) {
      const { data: userArticleList } = await getUserArticleList(username)
      this.userArticleList = userArticleList
    },

    goToCollect () {
      if (this.isCurUser) {
        this.$router.push(`/user/pCollect?username=${this.userInfo.username}`)
      }
    },

    togglePanel (panel) {
      this.curPanel = panel
      if (panel === 'video') {
        this.getUserVideoList_(this.userInfo.username)
      } else {
        this.getUserArticleList_(this.userInfo.username)
      }
    },

    closeMask () {
      this.videoFormShow = false
      this.form = {}
    },

    selectedCoverChange (e) {
      if (e.target.files.length === 1) {
        this.form.videoCover = e.target.files[0]
      }
    },

    selectedVideoChange (e) {
      if (e.target.files.length === 1) {
        this.form.videoRes = e.target.files[0]
      }
    },

    async submit (e) {
      e.preventDefault()

      const fd = new FormData()
      fd.append('videoTitle', this.form.videoTitle)
      fd.append('videoIntro', this.form.videoIntro)
      fd.append('videoType', this.form.videoType)
      fd.append('videoCover', this.form.videoCover)
      fd.append('videoRes', this.form.videoRes)

      await uploadVideo(this.userInfo.username, fd)

      // 刷新列表
      this.getUserVideoList_(this.userInfo.username)
      // 关闭遮罩
      this.videoFormShow = false
      // 清空表单
      this.form = {}
    }
  }
}
</script>
<style lang="less" scoped src="@/styles/pFactory.less"></style>
