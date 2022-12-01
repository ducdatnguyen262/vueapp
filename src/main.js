import { createApp } from 'vue'
import App from './App.vue'
import LoginView from './views/login/LoginView.vue'
import MainView from './views/main/MainView.vue'
import HomeList from './views/home/HomeList.vue'
import OverviewList from './views/overview/OverviewList.vue'
import AssetList from './views/asset/AssetList.vue'
import VoucherList from './views/voucher/VoucherList.vue'
import ReportList from './views/report/ReportList.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import vi from 'element-plus/es/locale/lang/vi'
import {createRouter, createWebHistory } from 'vue-router'
import contextmenu from "v-contextmenu";
import "v-contextmenu/dist/themes/default.css";
import VueExcelXlsx from "vue-excel-xlsx";
import axios from 'axios';
import VueAxios from 'vue-axios'

// B2: Định nghĩa các router
const routers = [
    {
        path:"/login",
        name: "LoginView",
        component:LoginView
    },
    {
        path:"/",
        component:MainView,
        children:[
            {path:"", redirect: "login", name:"HomeList", component:HomeList},
            {path:"tong-quan", name:"OverviewList",component:OverviewList},
            {path:"tai-san", name:"AssetList",component:AssetList},
            {path:"ghi-tang", name:"VoucherList",component:VoucherList},
            {path:"bao-cao", name:"ReportList",component:ReportList},
        ]
    },
]

// B3: Khởi tạo router
const router = createRouter({
    history:createWebHistory(),
    routes:routers
})

// ROUTES
// STORE
const app = createApp(App)
app.config.globalProperties.hostname = "http://localhost:8080/"
app.use(VueExcelXlsx)
app.use(contextmenu)
app.use(ElementPlus, {locale:vi})
app.use(ElementPlus)
app.use(router)
app.use(VueAxios, axios)
app.mount('#app')
