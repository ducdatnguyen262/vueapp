<template>
    <div class="login-background">
        <div class="login">
            <div class="login-img"></div>
            <div class="login-form">
                <div class="login-logo"></div>
                <div class="login-title">Đăng nhập để làm việc với <b>MISA QLTS</b></div>
                <el-input v-model="city" placeholder="Tỉnh/thành phố" class="mt-20"/>
                <el-input v-model="unit" placeholder="Đơn vị" class="mt-20"/>
                <el-input v-model="username" placeholder="Username, email hoặc số điện thoại" class="mt-20"/>
                <el-input v-model="password" placeholder="Mật khẩu" show-password class="mt-20"/>
                <el-button type="primary" class="login-btn mt-20">Đăng nhập</el-button>
                <a class="forgot-password">Quên mật khẩu?</a>
            </div>
        </div>
        <div class="copy-right">Copyright © 2020 MISA JSC</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            city: "",
            unit: "",
            username: "",
            password: "",
        }
    }
}
</script>

<style scoped>
    @import url('../../css/base/login.css');
</style>