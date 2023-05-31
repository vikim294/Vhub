<template>
  <div>
    <main>
      <div class="wrapper">
        <div class="show-panel">
          <MessageItem :messageData="curMessage" @refreshList="getUserMessageList_"></MessageItem>
        </div>
        <div class="list-panel">
          <div :class="`message-item ${item.mID===mIDCurMessage?'active':''}`" v-for="item in list" :key="item.mID" @click="checkMessage(item.mID)">
            <div class="iconBox">
              <i class="bi bi-clipboard-check"></i>
            </div>
            <div class="infoBox">
              <div class="title">{{item.mTitle}}</div>
              <div class="content">{{item.mContent}}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

import MessageItem from '@/views/PMessage/components/MessageItem.vue'

import { getUserMessageList, getUserMessageDetail } from '@/api/user'

export default {
  name: 'pmessage-page',

  components: {
    MessageItem
  },

  data () {
    return {
      list: [],
      mIDCurMessage: '',
      curMessage: {},
      otherInfo: {}
    }
  },

  methods: {

    async getUserMessageList_ () {
      const { data } = await getUserMessageList(this.$store.state.userInfo.username)
      this.list = data
      // 重置
      this.mIDCurMessage = ''
      this.curMessage = {}
      this.otherInfo = {}
    },

    async checkMessage (mID) {
      this.mIDCurMessage = mID

      const { data: messageData } = await getUserMessageDetail(this.$store.state.userInfo.username, mID)
      this.curMessage = messageData
    }
  },

  created () {
    this.$emit('changeBgI', 'pMessage')

    this.getUserMessageList_()
  }
}
</script>
<style lang="less" scoped src="@/styles/pMessage.less"></style>
