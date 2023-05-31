<template>
  <div>
    <main>
      <div class="wrapper">
        <div class="listArea">
          <div class="head">
            <div class="op op-add" @click="maskShow = true">
              <i class="bi bi-person-plus"></i>
            </div>

            <div class="title">我的好友</div>
          </div>
          <div class="body">
            <div
              :class="`item ${
                item.username === curFriend.username ? 'active' : ''
              }`"
              v-for="item in friendList"
              :key="item.uid"
              @click="chooseFriend(item.username)"
            >
              <div class="avatar">
                <img :src="item.avatar" />
              </div>
              <div class="username">
                <span>{{ item.username }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dialogArea">
          <div class="head">
            <div class="title">
              <span>{{ curFriend.username }}</span>
              <i :class="`bi bi-plugin ${offlineIconShow ? '' : 'hide'}`"></i>
            </div>
            <div
              :class="`op op-userFactory ${curFriend.username ? '' : 'hide'}`"
              @click="
                $router.push(`/user/pFactory?username=${curFriend.username}`)
              "
            >
              <i class="bi bi-box-seam"></i>
            </div>
            <div
              :class="`op op-close ${curFriend.username ? '' : 'hide'}`"
              @click="closeChatting"
            >
              <i class="bi bi-x-lg"></i>
            </div>
          </div>

          <div ref="refShowPanel" class="showPanel">
            <div ref="refContainer" class="container" v-if="curFriend.username">
              <div
                :class="`item ${item.isSelf ? 'item-self' : 'item-other'}`"
                v-for="item in chattingLogList_process"
                :key="item.cmID"
              >
                <div class="avatar">
                  <img
                    :src="
                      item.isSelf
                        ? $store.state.userInfo.avatar
                        : curFriend.avatar
                    "
                  />
                </div>
                <div class="message">
                  {{ item.cmContent }}
                </div>
              </div>
            </div>
          </div>

          <div class="inputPanel">
            <div class="toolbar">
              <a href="javascript:;">
                <i class="bi bi-emoji-smile"></i>
              </a>

              <a href="javascript:;">
                <i class="bi bi-image"></i>
              </a>
            </div>
            <div class="input">
              <textarea
                name=""
                id=""
                placeholder="Say something here..."
                v-if="curFriend.username"
                v-model.trim="msgContent"
                @keyup.enter="sendMsg"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div :class="`mask ${maskShow ? 'show' : 'hide'}`">
      <div class="add-container">
        <div class="title">
          添加好友
          <button type="button" id="close" @click="closeMask">
            <i class="bi bi-x-square-fill"></i>
          </button>
        </div>
        <div class="search">
          <form @submit="searchUserByUid">
            <input
              type="text"
              id="uid"
              name="uid"
              autocomplete="off"
              v-model="uidSearch"
              placeholder="Enter uid here..."
            />
            <button><i class="bi bi-search"></i></button>
          </form>
        </div>
        <div class="res-container" v-show="resultShow">
          <div :class="`result found ${hasResult ? 'active' : ''}`">
            <div class="avatar">
              <img id="avatar_add" :src="resultSearch.avatar" alt="" />
            </div>
            <div class="username" id="username_add">
              {{ resultSearch.username }}
            </div>
            <button
              type="button"
              class="send"
              @click="sendFriendRequest(resultSearch.username)"
            >
              <i class="bi bi-send-plus"></i>
            </button>
          </div>
          <div :class="`result not-found ${hasResult ? '' : 'active'}`">
            <i class="bi bi-question-square"></i>
            并没有找到此用户...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseURL } from '@/utils/request'

import { io } from 'socket.io-client'

import {
  getUserFriends,
  getUserInfoByUid,
  getUserInfoByUsername,
  addMessage,
  getUserState,
  addChattingLog,
  getUsersChattingLog,
  addNsp,
  delNsp,
  getNsp
} from '@/api/user'

export default {
  name: 'psocial-page',

  created () {
    this.$emit('changeBgI', 'pSocial')

    this.getUserFriends_()
  },

  data () {
    return {
      // 好友列表
      friendList: [],
      curFriend: {},

      // 添加好友
      maskShow: false,
      uidSearch: '',
      resultSearch: {},
      resultShow: false,
      hasResult: false,

      //
      chattingLogList: [],

      //
      msgContent: '',
      socket: null
    }
  },

  computed: {
    // 是否显示 离线标识
    offlineIconShow () {
      if (this.curFriend.isOnline) {
        return false
      } else {
        if (this.curFriend.username) {
          return true
        } else return false
      }
    },

    //
    chattingLogList_process () {
      return this.chattingLogList.map((item) => {
        if (item.cmSender === this.$store.state.userInfo.username) {
          return {
            ...item,
            isSelf: true
          }
        } else {
          return {
            ...item,
            isSelf: false
          }
        }
      })
    }
  },

  methods: {
    // 获取用户好友列表
    async getUserFriends_ () {
      const { data } = await getUserFriends(
        this.$store.state.userInfo.username
      )
      this.friendList = data
    },

    async getUserChattingLog () {
      const { data: chattingLog } = await getUsersChattingLog(
        this.$store.state.userInfo.username,
        this.curFriend.username
      )
      this.chattingLogList = chattingLog

      this.$nextTick(() => {
        this.$refs.refShowPanel.scrollTo(
          0,
          this.$refs.refContainer.clientHeight
        )
      })
    },

    // 当用户选择一个好友
    async chooseFriend (usernameCurFriend) {
      const { data: friendInfo } = await getUserInfoByUsername(
        usernameCurFriend
      )
      const { data: friendState } = await getUserState(usernameCurFriend)
      this.curFriend = {
        ...friendInfo,
        ...friendState
      }

      // 获取聊天记录
      this.getUserChattingLog()

      // --- 如果该好友在线，则建立nsp ---
      if (this.curFriend.isOnline) {
        const { data: nspData } = await addNsp({
          username1: this.$store.state.userInfo.username,
          username2: this.curFriend.username
        })

        // 官网例子 "https://server-domain.com/admin"
        // 即，如果服务器和客户端的url不同，则在客户端创建命名空间时，要写成 服务器基地址/命名空间名 的形式
        // 并且在服务器端创建io时，或许需要配置CORS (看socket.io官网)
        this.socket = io(`${baseURL}/${nspData.nspID}`)

        this.socket.on('newMsg', () => {
          console.log('接收到服务器的newMsg事件')
          // 获取聊天记录
          this.getUserChattingLog()
        })
      }
    },

    // 输入uid，点击搜索按钮后
    async searchUserByUid (e) {
      e.preventDefault()
      try {
        const { data } = await getUserInfoByUid(this.uidSearch.trim())
        this.resultSearch = data
        this.hasResult = true
      } catch (error) {
        this.resultSearch = {}
        this.hasResult = false
      } finally {
        this.resultShow = true
      }
    },

    // 点击好友申请按钮
    async sendFriendRequest (usernameOther) {
      await addMessage({
        mType: 'friend-request',
        mSource: this.$store.state.userInfo.username,
        mTarget: usernameOther,
        mTitle: '好友申请',
        mContent: `${this.$store.state.userInfo.username} 请求添加您为好友`
      })
    },

    // 关闭添加好友遮罩
    closeMask () {
      this.maskShow = false
      this.resultShow = false
      this.uidSearch = ''
    },

    // 发送聊天消息
    async sendMsg () {
      // 如果是空消息，则返回
      if (!this.msgContent) return

      // 将该条消息存入数据库
      await addChattingLog({
        cmSender: this.$store.state.userInfo.username,
        cmReceiver: this.curFriend.username,
        cmContent: this.msgContent
      })

      // 清空文本域
      this.msgContent = ''

      // 如果当前好友在线
      if (this.curFriend.isOnline) {
        // 判断该好友是否关闭了聊天窗口
        const { data: nspData } = await getNsp({
          username1: this.$store.state.userInfo.username,
          username2: this.curFriend.username
        })

        // 如果好友没有关闭聊天窗口
        if (nspData) {
          // 则使用.emit向socket.io服务器发射事件 (然后上面的.on会接收服务器发射的事件，并获取聊天记录)
          this.socket.emit('newMsg')
          return
        }

        // 否则获取聊天记录
      }

      // 获取聊天记录
      this.getUserChattingLog()
    },

    // 关闭聊天
    async  closeChatting () {
      // 如果好友在线
      if (this.curFriend.isOnline) {
        // 删除它们对应的nsp
        await delNsp({
          username1: this.$store.state.userInfo.username,
          username2: this.curFriend.username
        })

        // 移除 this.socket 的所有事件监听 即 this.socket.on('newMsg',...)
        this.socket.off('newMsg')

        // 断开该socket与服务器上某命名空间的连接，此后 this.socket.emit('newMsg') 不再会给服务器上的该命名空间发射事件
        this.socket.disconnect()

        this.socket = null
      }

      // 关闭聊天窗口
      this.curFriend = {}
    }
  }
}
</script>
<style lang="less" scoped src="@/styles/pSocial.less"></style>
