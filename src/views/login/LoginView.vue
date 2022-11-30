<template>
    <div class="login-background">
        <div class="login">
            <div class="login-img"></div>
            <div class="login-form">
                <div class="login-logo"></div>
                <div class="login-title">Đăng nhập để làm việc với <b>MISA QLTS</b></div>
                <el-input 
                    v-model="user.username" 
                    ref="username" 
                    placeholder="Username, email hoặc số điện thoại" 
                    class="mt-20"
                    :class="{'input--error':this.validateUsername}" 
                />
                <div v-show="validateUsername" style="color:red;height:20px">{{validateUsernameText}}</div>
                <div v-show="!validateUsername" class="mt-20"></div>
                <el-input 
                    v-model="user.password" 
                    ref="password" 
                    placeholder="Mật khẩu" 
                    show-password 
                    :class="{'input--error':this.validatePassword}"
                />
                <div v-show="validatePassword" style="color:red;height:20px">{{validatePasswordText}}</div>
                <div v-show="!validatePassword" class="mt-20"></div>
                <el-button 
                    @click="login" 
                    type="primary" 
                    class="login-btn" 
                    style="margin-top:120px"
                >
                    Đăng nhập
                </el-button>
                <a class="forgot-password">Quên mật khẩu?</a>
            </div>
        </div>
        <div class="copy-right">Copyright © 2020 MISA JSC</div>
    </div>

    <!-- Dialog cảnh cáo lỗi từ backend -->
    <d-dialog-1-button v-on:keydown="keyboardEvent"
        v-if="backendError" 
        :text="backendErrorMsg"
        @closeNotify="closeBackendError"
    />

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
        <div class="loader"></div>
    </div>

    <!-- Toast thông báo thất bại -->
    <transition name="toast">
        <d-toast v-show="toastFailedShow" type="failed"></d-toast>
    </transition>
</template>

<script>
import DToast from '@/components/base/DToast.vue'
import Resource from '../../js/resource.js'
import DDialog1Button from '../../components/base/DDialog1Button.vue';

export default {
    components : {DToast, DDialog1Button},
    data() {
        return {
            user: {
                username: "",
                password: "",
            },
            toastFailedShow: false, // Hiển thị toast thông báo thất bại hay không
            validateUsername: false, // Có nhập thiếu trường username không
            validatePassword: false, // Có nhập thiếu trường password không
            validateUsernameText: Resource.ErrorMsg.ValidateUsername, // Thông báo nhập thiếu trường username
            validatePasswordText: Resource.ErrorMsg.ValidatePassword, // Thông báo nhập thiếu trường password
            isLoading: false, // Có đang loading hay không
            backendError: false, // Có hiển thị dialog cảnh báo lỗi từ backend không
            backendErrorMsg: "", // Thông điệp trong cảnh báo lỗi backend
        }
    },

    created() {
        if(localStorage.getItem('token') != 'null'){
            this.$router.push({name: "VoucherList"})
        }
    },

    methods: {
        /**
         * Đăng nhập
         * NDDAT (29/11/2022)
         */
        login() {
            if(this.checkValidation()) {
                this.isLoading = true
                fetch(Resource.Url.User + '/signin/' + this.user.username+ '/' + this.user.password, {method: "GET", headers:{ 'Content-Type': 'application/json'}})
                .then(res =>{
                    var status = res.status
                    res.json()
                    .then(data => {
                        switch(status) {
                            case 400: 
                                if(Object.values(data)[3]) this.backEndErrorNotify(Object.values(data)[3])
                                else this.backEndErrorNotify(Resource.ErrorCode[400])
                                this.isLoading = false
                                break
                            case 403: 
                                this.backEndErrorNotify(Object.values(data)[2])
                                this.isLoading = false
                                break
                            case 500: 
                                this.backEndErrorNotify(Resource.ErrorCode[500])
                                this.isLoading = false
                                break
                            default: 
                                localStorage.setItem('token', data.token)
                                data.token = ""
                                localStorage.setItem('user', data)
                                localStorage.setItem('username', data.username)
                                this.$router.push({name: "VoucherList"})
                                this.isLoading = false
                        }
                    });
                })
                .catch(res => {
                    console.error(res)
                    this.isLoading = false
                    this.toastFailedShow = true
                    setTimeout(() => this.toastFailedShow = false, 3000)
                })
            }
        },

        /**
         * Kiểm tra nhập thiếu dữ liệu
         * NDDAT (29/11/2022)
         */
        checkValidation() {
            if(!this.user.password) {
                this.$refs.password.focus()
                this.validatePassword = true
                if(!this.user.username) {
                    this.$refs.username.focus()
                    this.validateUsername = true
                }
                else this.validateUsername = false
                return
            }
            else this.validatePassword = false
            if(!this.user.username) {
                this.$refs.username.focus()
                this.validateUsername = true
                if(!this.user.password) {
                    this.$refs.password.focus()
                    this.validatePassword = true
                }
                else this.validatePassword = false
                return
            }
            else this.validateUsername = false
            return true
        },

        /**
         * Hiện thị cảnh báo lỗi truyền từ BackEnd
         * NDDAT (12/10/2022)
         * @param {string} text Thông điệp của cảnh báo lỗi
         */
        backEndErrorNotify(text) {
            this.backendErrorMsg = text
            this.backendError = true;
        },

        /**
         * Xác nhận đóng cảnh báo lỗi từ backend
         * NDDAT (12/10/2022)
         */
        closeBackendError() {
            this.backendError = false
            this.focusFirst()
        },
    }
}
</script>

<style scoped>
    @import url('../../css/base/login.css');
    @import url('../../css/base/input.css');
</style>