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
            <div class="header-user position-relative">
                <d-tooltip text="Người dùng" class="tool-tip--left"></d-tooltip>
            </div>
            <div class="header-down position-relative">
                <d-tooltip text="Mở rộng" class="tool-tip--left"></d-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import DTooltip from '../base/DTooltip.vue';
export default {
    components: { DTooltip }
}
</script>

<style scoped>
    @import url('../../css/layout/header.css');
    @import url('../../css/base/tooltip.css');
</style>