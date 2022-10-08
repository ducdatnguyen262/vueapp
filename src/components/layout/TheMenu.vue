<template>
    <div class="sidebar">
        <div class="sidebar-title">
            <div class="sidebar-logo"></div>
            <h2 v-show="isOpen" class="logo-title">MISA QLTS</h2>
        </div>
        <router-link to="/tong-quan" 
            @click="selected = 1" 
            :class="{'sidebar-menu--selected':selected == 1}" 
            class="sidebar-menu position-relative"
        >
            <div class="sidebar-menu__icon sidebar-menu__icon--main"></div>
            <div v-show="isOpen" class="mr-10">Tổng quan</div>
            <d-tooltip v-if="!isOpen" text="Tổng quan"></d-tooltip>
        </router-link>
        <router-link to="/tai-san" 
            @click="selected = 2" 
            :class="{'sidebar-menu--selected':selected == 2}" 
            class="sidebar-menu position-relative"
        >
            <div class="sidebar-menu__icon sidebar-menu__icon--asset"></div>
            <div v-show="isOpen" class="mr-10">Tài sản</div>
            <div v-show="isOpen" class="sidebar-icon-dropdown"></div>
            <d-tooltip v-if="!isOpen" text="Tài sản"></d-tooltip>
        </router-link>
        <router-link to="" 
            @click="selected = 3" 
            :class="{'sidebar-menu--selected':selected == 3}" 
            class="sidebar-menu position-relative"
        >
            <div class="sidebar-menu__icon sidebar-menu__icon--asset-htdb"></div>
            <div v-show="isOpen" class="mr-10">
                Tài sản HT-ĐB
                <d-tooltip text="Tài sản hạ tầng đường bộ"></d-tooltip>
            </div>
            <div v-show="isOpen" class="sidebar-icon-dropdown"></div>
            <d-tooltip v-if="!isOpen" text="Tài sản hạ tầng đường bộ"></d-tooltip>
        </router-link>
        <router-link to="" 
            @click="selected = 4" 
            :class="{'sidebar-menu--selected':selected == 4}" 
            class="sidebar-menu position-relative"
        > 
            <div class="sidebar-menu__icon sidebar-menu__icon--tool"></div>
            <div v-show="isOpen" class="mr-10 mr-10">Công cụ dụng cụ</div>
            <div v-show="isOpen" class="sidebar-icon-dropdown"></div>
            <d-tooltip v-if="!isOpen" text="Công cụ dụng cụ"></d-tooltip>
        </router-link>
        <router-link to="" 
            @click="selected = 5" 
            :class="{'sidebar-menu--selected':selected == 5}" 
            class="sidebar-menu position-relative"
        >
            <div class="sidebar-menu__icon sidebar-menu__icon--menu"></div>
            <div v-show="isOpen" class="mr-10">Danh mục</div>
            <d-tooltip v-if="!isOpen" text="Danh mục"></d-tooltip>
        </router-link>
        <router-link to="" 
            @click="selected = 6" 
            :class="{'sidebar-menu--selected':selected == 6}" 
            class="sidebar-menu position-relative"
        >
            <div class="sidebar-menu__icon sidebar-menu__icon--search"></div>
            <div v-show="isOpen" class="mr-10">Tra cứu</div>
            <div v-show="isOpen" class="sidebar-icon-dropdown"></div>
            <d-tooltip v-if="!isOpen" text="Tra cứu"></d-tooltip>
        </router-link>
        <router-link to="/bao-cao" 
            @click="selected = 7" 
            :class="{'sidebar-menu--selected':selected == 7}" 
            class="sidebar-menu position-relative"
        >
            <div class="sidebar-menu__icon sidebar-menu__icon--report"></div>
            <div v-show="isOpen" class="mr-10">Báo cáo</div>
            <div v-show="isOpen" class="sidebar-icon-dropdown"></div>
            <d-tooltip v-if="!isOpen" text="Báo cáo"></d-tooltip>
        </router-link>
        <div class="sidebar-footer">
            <div v-show="isOpen" @click="sidebarClose" class="sidebar-icon-close position-relative">
                <d-tooltip text="Thu gọn" class="tool-tip--top"></d-tooltip>
            </div>
            <div v-show="!isOpen" @click="sidebarOpen" class="sidebar-icon-open position-relative">
                <d-tooltip text="Mở rộng" class="tool-tip--top"></d-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import DTooltip from '../base/DTooltip.vue'

export default {
    components: {DTooltip},
    props: [],
    methods: {
        sidebarClose() {
            this.isOpen = false
        },
        sidebarOpen() {
            this.isOpen = true
        }
    },
    data() {
        return {
            selected: 2,
            isOpen: true,
        }
    }
}
</script>

<style scoped>
    @import url('../../css/layout/sidebar.css');
    a {
        color: #fff;
        text-decoration: none;
    }
</style>