<template>
  <div>
    <nav>
      <div class="wrapper">
        <div class="bin">
          <router-link class="home" to="/">
            <i class="bi bi-house"></i>
          </router-link>
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
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'nav-bar-dynamic',

  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
nav {
  padding: 45px 0 20px 0;

  .wrapper {
    display: flex;
    justify-content: center;

    .bin {
      padding: 10px 60px;
      background-color: #05232f61;
      border-radius: 10px;
      transition: all 1s;

      a {
        display: inline-block;
        width: 80px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        margin: 0 7px;
        background-color: purple;
        transition: transform 0.5s;
        transform-origin: center bottom;
        border-radius: 4px;
        box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);

        &:hover {
          transform: scale(1.3);
          margin: 0 15px;
        }

        .bi {
          font-size: 40px;
          color: #fff;
        }

        &.home {
          background-color: #fff;

          .bi {
            color: #000;
          }
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
</style>
