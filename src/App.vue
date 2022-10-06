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
import TheMenu from './components/layout/TheMenu.vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheContent from './components/layout/TheContent.vue'

export default {
  name: 'App',
  components: {
    TheMenu, TheHeader, TheContent
  }
}
</script>

<style>
#app {
  font-family: Roboto !important;
  font-size: 13px;
}

body {
    margin: 0;
}

input::placeholder {
    font-family: Roboto Italic;  
}

@font-face {
    font-family: MISA Fonts;
    src: url(./assets/font/GoogleSans-Regular.otf);
}

@font-face {
    font-family: MISA Fonts Bold;
    src: url(./assets/font/GoogleSans-Bold.otf);
}

@font-face {
    font-family: Roboto;
    src: url(./assets/font/Roboto-Regular.ttf);
}

@font-face {
    font-family: Roboto Italic;
    src: url(./assets/font/Roboto-Italic.ttf);
}

label {
    display: block;
}

.row {
    padding: 10px;
}

.label {
    font-weight: 700;
    margin-bottom: 8px;
}

.mr-10 {
  margin-right: 10px;
}

.mr-11 {
    margin-right: 11px;
}

.mr-20 {
    margin-right: 20px;
}

.position-relative {
    position: relative;
}

.body {
    flex: 1; 
    background-color: #f4f7ff;
}

/* Chặn trang web tự động tăng chiều cao*/
html, body {
    height: 100%; 
    overflow-y: hidden
}

/* Scrollbar */
/* Kích thước */
::-webkit-scrollbar {
    width: 10px;
    height: 12px;
}

/* Đường chạy */
::-webkit-scrollbar-track {
    border-radius: 4px;
    background: #d1dae9; 
}
    
/* Tay cầm */
::-webkit-scrollbar-thumb {
    background: #abb6c8; 
    border-radius: 4px;
}

/* Sửa tooltip của Elemental Plus */
.el-popper.is-light {
    box-shadow: 2px 4px 10px 4px rgb(0 0 0 / 16%) !important;
    font-size: 13px;
}
</style>
