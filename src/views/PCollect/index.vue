<template>
  <div>
    <main>
      <div class="wrapper">
        <div class="topBar">
          <div class="search">
            <span :class="`title ${showSubscription?'subscription':'subscriber'}`">{{
              showSubscription ? "我订阅的人" : "我的订阅者"
            }}</span>
            <input type="text" placeholder="搜索用户名" v-model="keyword" />
          </div>
        </div>
        <div class="body">
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>用户名</th>
                <th>UID</th>
                <th>订阅时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in listShow" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td class="author">{{ item.username }}</td>
                <td class="uid">{{ item.uid }}</td>
                <td>{{ item.subscriptionTime }}</td>
                <td class="op">
                  <router-link
                    class="goToFactory"
                    :to="`/user/pFactory?username=${item.username}`"
                    >创作中心</router-link
                  >
                  <a
                    class="unsubscribe"
                    href="javascript:;"
                    v-if="showSubscription"
                    @click="unsubscribe(item.username)"
                    >取消订阅</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

import { getUserSubscription, getUserSubscriber, delUserSubscription, delUserSubscriber } from '@/api/user'

export default {

  name: 'pcollect-page',

  data () {
    return {
      showSubscription: true,
      list: [],
      keyword: ''
    }
  },

  computed: {
    listShow () {
      const keywordTrim = this.keyword.trim()
      if (!keywordTrim) {
        return this.list
      } else {
        return this.list.filter((item) => item.username.includes(keywordTrim))
      }
    }
  },

  methods: {

    async getList () {
      if (this.$route.query.username) {
      // 显示subscriber
        this.showSubscription = false
        const { data } = await getUserSubscriber(this.$store.state.userInfo.username)
        this.list = data
      } else {
      // 显示subscription
        this.showSubscription = true
        const { data } = await getUserSubscription(this.$store.state.userInfo.username)
        this.list = data
      }
    },

    async  unsubscribe (usernameAuthor) {
      await delUserSubscription(this.$store.state.userInfo.username, usernameAuthor)
      await delUserSubscriber(usernameAuthor, this.$store.state.userInfo.username)

      this.getList()
    }
  },

  async created () {
    this.$emit('changeBgI', 'pCollect')

    this.getList()
  }

}
</script>
<style lang="less" scoped src="@/styles/pCollect.less"></style>
