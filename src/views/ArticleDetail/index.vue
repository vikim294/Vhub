<template>
  <div>
  <main>
    <div class="wrapper">
      <div class="article-panel">

        <div class="article-title">
          <!--  -->
          <div class="title">
            我我我我我我
          </div>
          <div class="info">
            <div class="left">
              <div class="author">
                <span>
                  作者 :
                </span>
                <span id="author">
                  vikim
                </span>
              </div>
              <div class="date">
                <span>
                  发布日期 :
                </span>
                <span id="date">
                  2023/4/9
                </span>
              </div>
            </div>
            <div class="right">
              <div class="views">
                <i class="bi bi-eye-fill"></i>
                <span id="views">
                  0
                </span>
              </div>
              <div class="likes">
                <i class="bi bi-hearts"></i>
                <span id="likes">
                  0
                </span>
              </div>
            </div>
          </div>

        </div>
        <div class="article-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus aliquam dolor, eu lacinia lorem placerat
          vulputate. Duis felis orci, pulvinar id metus ut, rutrum luctus orci. Cras porttitor imperdiet nunc, at
          ultricies tellus laoreet sit amet. Sed auctor cursus massa at porta. Integer ligula ipsum, tristique sit amet
        </div>
        <div class="article-footer">
          <div class="author">
            <div class="avatar">
              <img src="" alt="">
            </div>
            <div class="subscribe">
              <button>订阅</button>
            </div>
          </div>
        </div>

        <div class="article-op goBack">
          <i class="bi bi-door-open"></i>
        </div>

        <div class="article-op edit">
          <i class="bi bi-pencil-square"></i>
        </div>

        <div class="article-op ops">
          <!-- <i class="bi bi-heart"></i> -->
          <i class="bi bi-trash3"></i>
        </div>

      </div>
    </div>
  </main>
  </div>
</template>

<script>

export default {
  name: 'articleDetail-page',

  data () {
    return {}
  },

  components: {},

  methods: {},

  created () {
    this.$emit('changeBgI', 'article')
  }
}
</script>
<style lang="less" scoped src="@/styles/article.less"></style>
