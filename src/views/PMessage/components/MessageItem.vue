<template>
  <div>
    <div class="messageItem" v-if="messageData.mType === 'friend-request'">
      <div class="t">{{ messageData.mTitle }}</div>
      <div class="b">
        <div class="message-content friend-request">
          <div class="info">
            <div class="user">
              <div class="avatar">
                <img :src="userInfoMessage.avatar" alt="" />
              </div>
              <div class="username">{{ messageData.mSource }}</div>
            </div>
            <div class="content">
              <div class="date">{{ messageData.mDate }}</div>
              <div class="message">{{ messageData.mContent }}</div>
            </div>
          </div>
          <div
            :class="`op op-pending ${
              messageData.mState === 'pending' ? 'active' : ''
            }`"
          >
            <div class="confirm" @click="agree">
              <i class="bi bi-check-square-fill"></i>
            </div>
            <div class="deny" @click="deny">
              <i class="bi bi-x-square-fill"></i>
            </div>
          </div>
          <div
            :class="`op op-done ${
              messageData.mState === 'done' ? 'active' : ''
            }`"
          >
            <div :class="`confirmed ${messageData.mStateResult==='confirmed'?'active':''}`">
              <i class="bi bi-check-lg"></i>
            </div>
            <div :class="`denied ${messageData.mStateResult==='denied'?'active':''}`">
              <i class="bi bi-x-lg"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="messageItem"
      v-if="messageData.mType === 'system-friend-request'"
    >
      <div class="t">{{messageData.mTitle}}</div>
      <div class="b">
        <div class="message-content system-friend-request">
          <div class="avatar">
            <i class="bi bi-cpu"></i>
          </div>
          <div class="info">
            <div class="date">{{messageData.mDate}}</div>
            <div class="message">{{messageData.mContent}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfoByUsername, addFriend, addMessage, updateUserMessage } from '@/api/user'

export default {
  props: {
    messageData: {
      type: Object,
      default: () => {}
    }
  },

  watch: {
    messageData: {
      deep: true,
      async handler (newVal) {
        if (newVal.mType === 'friend-request') {
          const { data } = await getUserInfoByUsername(newVal.mSource)
          this.userInfoMessage = data
        }
      }
    }
  },

  data () {
    return {
      userInfoMessage: {}
    }
  },

  methods: {

    async agree () {
      await updateUserMessage({
        username: this.$store.state.userInfo.username,
        mID: this.messageData.mID,
        mState: 'done',
        mStateResult: 'confirmed'
      })

      await addMessage({
        mType: 'system-friend-request',
        mSource: 'system',
        mTarget: this.messageData.mSource,
        mTitle: '系统提示',
        mContent: `${this.$store.state.userInfo.username} 已同意您的好友申请`
      })

      // 为本用户新增一个好友
      await addFriend({
        username_self: this.$store.state.userInfo.username,
        uid_friend: this.userInfoMessage.uid,
        username_friend: this.userInfoMessage.username
      })

      await addFriend({
        username_self: this.userInfoMessage.username,
        uid_friend: this.$store.state.userInfo.uid,
        username_friend: this.$store.state.userInfo.username
      })

      this.$emit('refreshList')
    },

    async deny () {
      await updateUserMessage({
        username: this.$store.state.userInfo.username,
        mID: this.messageData.mID,
        mState: 'done',
        mStateResult: 'denied'
      })

      await addMessage({
        mType: 'system-friend-request',
        mSource: 'system',
        mTarget: this.messageData.mSource,
        mTitle: '系统提示',
        mContent: `${this.$store.state.userInfo.username} 拒绝了您的好友申请`
      })

      this.$emit('refreshList')
    }
  }
}
</script>
<style lang="less" scoped src="@/styles/pMessage.less"></style>
