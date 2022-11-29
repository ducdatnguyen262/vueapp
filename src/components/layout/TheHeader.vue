<template>
    <div class="header">
        <div class="header-left">
            <div class="header-title">Danh sách tài sản</div>
        </div>
        <div class="header-right">
            <div class="header-text">Sở tài chính</div>
            <div class="header-dropdown position-relative">
                Năm 2021
                <div class="header-dropdown__icon"></div>
                <d-tooltip text="Thời gian thống kê"></d-tooltip>
            </div>
            <div class="header-notify mr-20 position-relative">
                <d-tooltip text="Thông báo"></d-tooltip>
            </div>
            <div class="header-menu mr-20 position-relative">
                <d-tooltip text="Menu"></d-tooltip>
            </div>
            <div class="header-help mr-20 position-relative">
                <d-tooltip text="Trợ giúp"></d-tooltip>
            </div>
            <div @click.self="userDetailShow=!userDetailShow" @blur="userDetailShow=false"  class="header-user position-relative">
                <div v-show="userDetailShow" class="user_detail">
                    <div style="font-size:20px;margin:12px 20px"><b>Username: {{text}}</b></div>    
                    <a class="user-detail-warpper user-detail-warpper--disabled">
                        <div class="icon-password"></div>
                        <div class="user-detail-text">Đổi mật khẩu</div>
                    </a>
                    <a class="user-detail-warpper user-detail-warpper--disabled">
                        <div class="icon-user"></div>
                        <div class="user-detail-text">Quản lý tài khoản</div>
                    </a>
                    <a @click="logout" class="user-detail-warpper">
                        <div class="icon-logout"></div>
                        <div class="user-detail-text">Đăng xuất</div>
                    </a>
                </div>
            </div>
            <div @click="userDetailShow=!userDetailShow" class="header-down"></div>
        </div>
    </div>
</template>

<script>
import DTooltip from '../base/DTooltip.vue';
export default {
    components: { DTooltip },
    data() {
        return {
            userDetailShow:false,
            text:`${localStorage.getItem("username")}`
        }
    },
    methods: {
        logout() {
            localStorage.setItem('token', null)
            localStorage.setItem('username', 'Yêu cầu đăng nhập!')
            this.$router.push({name: "LoginView"})
        }
    }
}
</script>

<style scoped>
    @import url('../../css/layout/header.css');
    @import url('../../css/base/tooltip.css');
</style>