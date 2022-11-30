<template>
  <div class="container">
    <the-menu></the-menu>
    <div class="body">
      <the-header></the-header>
      <the-content></the-content>
    </div>
  </div>
</template>

<script>
import TheMenu from '../../components/layout/TheMenu.vue'
import TheHeader from '../../components/layout/TheHeader.vue'
import TheContent from '../../components/layout/TheContent.vue'

export default {
  name: 'App',
  components: {
    TheMenu, TheHeader, TheContent
  },

  created() {
    // Xem đã đăng nhập chưa
    if(localStorage.getItem('token') == 'null'){
        this.$router.push({name: "LoginView"})
    }
  }
}
</script>

<style>
    @import url('../../css/main.css');
</style>