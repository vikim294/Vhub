<template>
  <div class="root">
    <div class="container">
      <div class="title">用户登录</div>
      <div class="body">
        <form @submit="submit">
          <div class="item">
            <label for="username">用户名</label
            ><input
              type="text"
              name="username"
              id="username"
              v-model="form.username"
            />
          </div>

          <div class="item">
            <label for="password">密码</label
            ><input
              type="text"
              name="password"
              id="password"
              v-model="form.password"
            />
          </div>

          <div class="item" id="navItem_loginPage">
            <button type="submit">登录</button>
            <router-link to="/register">去注册</router-link>
          </div>

          <p></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'login-page',

  data () {
    return {
      form: {}
    }
  },

  methods: {
    async submit (e) {
      e.preventDefault()

      const res = await login(this.form)
      console.log(res)
      // 存储用户信息
      this.$store.commit('setUserInfo', {
        username: this.form.username
      })

      // 登录后，初始化用户在线状态定时器
      this.$initState()

      // 跳转到首页
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less" scoped src="@/styles/login.less"></style>
<style lang="less" scoped>
.root {
  height: 100%;
  background-image: url(@/assets/bg/rl-bg.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
