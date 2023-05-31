<template>
  <div class="layout" :style="`background-image: ${bgI}`">
    <div class="topbar">
      <div class="wrapper">
        <nav-bar-static></nav-bar-static>
      </div>
    </div>

    <router-view @changeBgI="changeBgI"></router-view>
  </div>
</template>

<script>
import bgV from '@/assets/bg/bg-play.png'
import bgA from '@/assets/bg/bg-article2.jpg'
import bgAE from '@/assets/bg/bg-article3.jpg'
import bgS from '@/assets/bg/bg-6.png'

export default {
  name: 'layoutDetail-page',
  data () {
    return {
      bgI: ''
    }
  },

  methods: {
    changeBgI (curLoc) {
      if (curLoc === 'video') {
        this.bgI = `url(..${bgV})`
      } else if (curLoc === 'article') {
        this.bgI = `url(..${bgA})`
      } else if (curLoc === 'articleEdit') {
        this.bgI = `url(..${bgAE})`
      } else if (curLoc === 'search') {
        this.bgI = `url(..${bgS})`
      }
    }
  }
}
</script>
<style lang="less" scoped>
.layout {
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;

  .topbar {
    .wrapper {
      width: 1680px;
      margin: 0 auto;
      padding: 30px 0;

      display: flex;
      justify-content: center;

      .user {
        display: flex;
        position: relative;
        padding-right: 0;
        transform: none;

        a {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          margin-left: 10px;

          border-radius: 4px;
          box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);

          .bi {
            font-size: 40px;
            color: #fff;
          }

          &.p-center {
            background-color: green;

            &:hover {
              background-color: rgb(13, 149, 13);
            }
          }

          &.p-factory {
            background-color: rgb(249, 64, 64);

            &:hover {
              background-color: rgb(254, 89, 89);
            }
          }

          &.p-message {
            background-color: pink;

            &:hover {
              background-color: rgb(253, 208, 215);
            }
          }

          &.p-collect {
            background-color: gold;

            &:hover {
              background-color: rgb(255, 222, 34);
            }
          }

          &.p-social {
            background-color: skyblue;

            &:hover {
              background-color: rgb(151, 217, 243);
            }
          }
        }
      }
    }
  }
}
</style>
