<template>
  <div>
  <main>
    <div class="wrapper">
      <div class="container">

        <div class="search">
          <div class="searchInput">
            <label for="keyword_search">搜索内容 : </label>
            <input type="text" name="keyword_search" id="keyword_search" autocomplete="off">
          </div>
          <div class="searchSelect">
            <label for="type_search">搜索类型 : </label>
            <select name="type_search" id="type_search">
              <option value="video">视频</option>
              <option value="article">文章</option>
            </select>
          </div>
          <div class="searchBtn">
            <button>
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <div class="search-result">
          <div class="op-sort op-sort-v">
            <a href="javascript:;" class="active" data-type="default">默认</a>
            <a href="javascript:;" data-type="play">按最多播放</a>
            <a href="javascript:;" data-type="thumb">按最多点赞</a>
            <a href="javascript:;" data-type="duration">按最长时长</a>
          </div>

          <div class="op-sort op-sort-a">
            <a href="javascript:;" class="active" data-type="default">默认</a>
            <a href="javascript:;" data-type="view">按最多浏览</a>
            <a href="javascript:;" data-type="like">按最多喜欢</a>
          </div>

          <div class="list-area">
            <div class="v-item">
              <div class="t">
                <img src="" alt="">
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-play-btn"></i>
                    3662
                  </span>
                  <span class="duration">
                    03:21
                  </span>
                </div>
              </div>
              <div class="b">
                <div class="title">标题标题标题标题标题标题标题标题标题标标题标题</div>
                <div class="author">作者</div>
              </div>
            </div>

            <!-- <div class="a-item">
              <div class="t">
                <img src="../images/acover/wallhaven-n6621l.png" alt="">
                <div class="mask">
                  <span class="visit">
                    <i class="bi bi-eye"></i>
                    <span id="visit">54</span>
                  </span>
                </div>
              </div>
              <div class="b">
                <div class="title">标题标题标题标题标题标题标题标题标题标标题标题</div>
                <div class="author">作者</div>
              </div>
            </div> -->

          </div>

          <!-- <div class="res-empty">
            这里什么也没有~
          </div> -->
        </div>
      </div>
    </div>
  </main>
  </div>
</template>

<script>

export default {
  name: 'search-page',

  data () {
    return {}
  },

  components: {},

  methods: {},

  created () {
    this.$emit('changeBgI', 'search')
  }
}
</script>
<style lang="less" scoped src="@/styles/search.less"></style>
