<template>
    <div v-if="isShow" class="dialog-container">
        <div class="dialog dialog--warning">
            <div class="dialog__content">
                <div class="warning-icon"></div>
                <div class="dialog__content-text">Bạn có muốn hủy bỏ khai báo tài sản này?</div>
            </div>
            <div class="dialog__footer">
                <button @click="isShow = false" class="dialog-close button">Đóng</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isShow: false
        }
    }
}
</script>

<style scoped>
    @import url('../../css/base/dialog.css');
</style>