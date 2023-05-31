<template>
  <div>
    <main>
      <div class="wrapper">
        <form @submit="submit">
          <div class="p-info_t">
            <div class="avatar">
              <!-- hidden元素用于方便表单数据的收集和回显，不可见 -->
              <!-- hidden的input元素指定name属性，则可以将后端返回数据的图片src保存在其value中 -->
              <input
                type="hidden"
                name="avatar"
                id="avatar-hidden"
                :value="form.avatar"
              />
              <!-- img元素只是为了给用户展示头像 -->
              <img id="avatar_Show" :src="imgSrc" alt="" />
              <input
                ref="refAvatarSelector"
                type="file"
                name="avatarSelector"
                id="avatarSelector"
                @change="selectedChange"
              />
              <div class="mask" @click="selectAvatar">上传头像</div>
            </div>

            <div class="identity">
              <div class="uid">
                <label for="uid">uid :</label>
                <!-- disabled的属性不能被serialize()收集起来 -->
                <input
                  type="text"
                  name="uid"
                  id="uid"
                  :value="form.uid"
                  disabled
                />
              </div>
              <!--  -->
              <div class="username">
                <label for="username">用户名 :</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  :value="form.username"
                  disabled
                />
              </div>
            </div>

            <div class="selfIntro">
              <textarea
                name="selfIntro"
                placeholder="个人介绍..."
                v-model="form.selfIntro"
              ></textarea>
            </div>
          </div>

          <div class="submitBox">
            <button type="submit">保存并提交</button>
          </div>
        </form>
        <div class="info-panel">
          <div class="t">
            <div class="data-box">
              <span class="num subscription">{{userData.subscriptionNum}}</span>
              <div class="tag">我订阅的人</div>
            </div>
            <div class="data-box">
              <span class="num subscriber">{{userData.subscriberNum}}</span>
              <div class="tag">我的订阅者</div>
            </div>
            <div class="data-box">
              <span class="num videos">{{userData.videoNum}}</span>
              <div class="tag">我的视频</div>
            </div>
            <div class="data-box">
              <span class="num articles">{{userData.articleNum}}</span>
              <div class="tag">我的文章</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { uploadAvatar, updateUserInfo, getUserVideoList, getUserArticleList, getUserSubscription, getUserSubscriber } from '@/api/user'

export default {
  name: 'pinfo-page',

  async created () {
    // 改变布局页面背景
    this.$emit('changeBgI', 'pInfo')

    const { data: userVideoList } = await getUserVideoList(this.$store.state.userInfo.username)
    const { data: userArticleList } = await getUserArticleList(this.$store.state.userInfo.username)
    const { data: userSubscription } = await getUserSubscription(this.$store.state.userInfo.username)
    const { data: userSubscriber } = await getUserSubscriber(this.$store.state.userInfo.username)
    // 数据回显
    this.form = this.$store.state.userInfo
    this.userData.videoNum = userVideoList.length
    this.userData.articleNum = userArticleList.length
    this.userData.subscriptionNum = userSubscription.length
    this.userData.subscriberNum = userSubscriber.length

    // 显示头像
    if (this.form.avatar) {
      this.imgSrc = this.form.avatar
    }
  },

  data () {
    return {
      form: {},
      imgSrc: '',
      userData: {}
    }
  },

  methods: {
    selectAvatar () {
      this.$refs.refAvatarSelector.click()
    },

    async selectedChange (e) {
      // 如果选中了一张图片
      if (e.target.files.length === 1) {
        // e.target.files[0]
        const fd = new FormData()
        fd.append('tempAvatarSelected', e.target.files[0])
        const res = await uploadAvatar(fd)
        // 显示头像 substring从0开始
        this.imgSrc = res.data.src
        // 收集数据
        this.form.avatar = res.data.src
      } else {
        this.form.avatar = ''
      }
    },

    async submit (e) {
      e.preventDefault()
      await updateUserInfo(this.form)
      this.$store.commit('setUserInfo', this.form)
    }
  }
}
</script>

<style lang="less" scoped src="@/styles/pInfo.less"></style>
