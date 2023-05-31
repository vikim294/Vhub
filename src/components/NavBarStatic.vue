<template>
  <div class="user">
    <router-link class="p-center" to="/user/pInfo">
        <i class="bi bi-person-gear"></i>
    </router-link>
    <router-link class="p-factory" to="/user/pFactory">
      <i class="bi bi-box-seam"></i>
    </router-link>
    <router-link class="p-message" to="/user/pMessage">
      <i class="bi bi-envelope-at"></i>
    </router-link>
    <router-link class="p-collect" to="/user/pCollect">
      <i class="bi bi-star-half"></i>
    </router-link>
    <router-link class="p-social" to="/user/pSocial">
      <i class="bi bi-globe-americas"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'nav-bar-static',

  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.user {
  display: flex;
  padding-right: 80px;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    margin-left: 10px;

    border-radius: 4px;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);

    transition: background 0.25s;

    .bi {
      font-size: 40px;
      color: #fff;
    }

    &.p-center {
      background-color: #008000f5;

      &:hover {
        background-color: rgb(13, 149, 13);
      }
    }

    &.p-factory {
      background-color: #f94040f0;

      &:hover {
        background-color: rgb(254, 89, 89);
      }
    }

    &.p-message {
      background-color: #ffc0cbf2;

      &:hover {
        background-color: rgb(253, 208, 215);
      }
    }

    &.p-collect {
      background-color: #ffd700f2;

      &:hover {
        background-color: rgb(255, 222, 34);
      }
    }

    &.p-social {
      background-color: #87ceebe8;

      &:hover {
        background-color: rgb(151, 217, 243);
      }
    }
  }
}
</style>
