<template>
  <div class="layout" :style="`background-image: ${bgI}`">
    <nav-bar-dynamic></nav-bar-dynamic>
    <router-view @changeBgI="changeBgI"></router-view>
  </div>
</template>

<script>
import bgI from '@/assets/bg/bg-2.png'
import bgF from '@/assets/bg/bg-4.png'
import bgM from '@/assets/bg/bg-pMessage.png'
import bgC from '@/assets/bg/bg-1.png'
import bgS from '@/assets/bg/bg-5.png'

export default {
  name: 'layout-page',
  data () {
    return {
      bgI: ''
    }
  },

  methods: {
    changeBgI (curLoc) {
      if (curLoc === 'pInfo') {
        this.bgI = `url(..${bgI})`
      } else if (curLoc === 'pFactory') {
        this.bgI = `url(..${bgF})`
      } else if (curLoc === 'pMessage') {
        this.bgI = `url(..${bgM})`
      } else if (curLoc === 'pCollect') {
        this.bgI = `url(..${bgC})`
      } else if (curLoc === 'pSocial') {
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
}

input:focus,
textarea:focus {
  outline: 2px solid skyblue;
  border-radius: 4px;
}
</style>
