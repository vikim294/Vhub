<template>
  <div class="root">
    <div class="container">
      <div class="title">用户注册</div>
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

          <div class="item" id="navItem_registerPage">
            <button type="submit">注册</button>
            <router-link to="/login">去登录</router-link>
          </div>

          <p></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/user'

export default {
  name: 'register-page',

  data () {
    return {
      form: {}
    }
  },

  methods: {
    async submit (e) {
      e.preventDefault()

      const res = await register(this.form)
      console.log(res)
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped src="@/styles/register.less"></style>
<style lang="less" scoped>
.root {
  height: 100%;
  background-image: url(@/assets/bg/rl-bg.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
