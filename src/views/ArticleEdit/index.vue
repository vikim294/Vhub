<template>
  <div>
   <main>
    <div class="wrapper">
      <div class="articleEditing-panel">
        <form @submit="submit">
          <div class="article-title">
            <input type="text" name="aTitle" id="aTitle" autocomplete="off" v-model="form.articleTitle">
          </div>
          <div class="article-content">
            <textarea name="aContent" id="aContent" v-model="form.articleContent"></textarea>
          </div>
          <div class="article-op">
            <button type="button" id="reset" @click="reset">重置</button>
            <button type="button" id="continue" @click="goOn">继续</button>
          </div>
          <div class="mask" v-show="maskShow">
            <div class="container">
              <div class="t">
                <label for="aCover">选择文章封面</label>
                <input type="file" id="aCover" name="aCover" @change="selectedCoverChange">
              </div>
              <div class="b">
                <button type="button" id="cancel" @click="cancel">取消</button>
                <button type="submit" id="submit">发布</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
   </main>
  </div>
</template>

<script>

import { uploadArticle } from '@/api/user'

export default {
  name: 'articleEdit-page',

  created () {
    this.$emit('changeBgI', 'articleEdit')
  },

  data () {
    return {
      form: {},
      maskShow: false
    }
  },

  methods: {

    selectedCoverChange (e) {
      if (e.target.files.length === 1) {
        this.form.articleCover = e.target.files[0]
      }
    },

    goOn () {
      this.maskShow = true
    },

    reset () {
      this.form = {}
    },

    cancel () {
      this.maskShow = false
    },

    async submit (e) {
      e.preventDefault()

      const fd = new FormData()
      fd.append('articleTitle', this.form.articleTitle)
      fd.append('articleContent', this.form.articleContent)
      fd.append('articleCover', this.form.articleCover)

      await uploadArticle(this.$store.state.userInfo.username, fd)

      //
      this.$router.push('/user/pFactory')
    }
  }

}
</script>
<style lang="less" scoped src="@/styles/articleEditing.less"></style>
