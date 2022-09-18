import { createApp } from 'vue'
import App from './App.vue'
import MsCombobox from 'ms-combobox'
import HomeList from './views/home/HomeList.vue'
import OverviewList from './views/overview/OverviewList.vue'
import AssetList from './views/asset/AssetList.vue'
import ReportList from './views/report/ReportList.vue'

import {createRouter, createWebHistory } from 'vue-router'

// B2: Định nghĩa các router
const routers = [
    {path:"/", component:HomeList},
    {path:"/tong-quan", component:OverviewList},
    {path:"/tai-san", component:AssetList},
    {path:"/bao-cao", component:ReportList}
]

// B3: Khởi tạo router
const router = createRouter({
    history:createWebHistory(),
    routes:routers
})

// ROUTES
// STORE
const app = createApp(App)
app.component("MsCombobox", MsCombobox)
app.use(router)
app.mount('#app')
