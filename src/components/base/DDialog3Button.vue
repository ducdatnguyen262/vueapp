<template>
    <div class="dialog-container">
        <div class="dialog dialog--warning">
            <div class="dialog__content">
                <div class="warning-icon"></div>
                <div class="dialog__content-text">{{text}}</div>
            </div>
            <div class="dialog__footer">
                <DButton @click="closeNotify" text="Hủy bỏ" type="outline" class="mr-10"></DButton>
                <DButton @click="closeNotSaveNotify" text="Không lưu" type="sub" class="mr-10"></DButton>
                <DButton @click="confirmNotify" text="Lưu"></DButton>
            </div>
        </div>
    </div>
</template>

<script>
import DButton from './DButton.vue';
export default {
    props: ["text", "textbtn"],
    data() {
        return {
            
        };
    },
    methods: {
        /**
         * Phát ra tín hiệu cho component cha về sự kiện closeNotify
         * NDDAT (19/09/2022)
         */
        closeNotify() {
            this.$emit("closeNotify")
        },

        /**
         * Phát ra tín hiệu cho component cha về sự kiện closeNotSaveNotify
         * NDDAT (19/09/2022)
         */
        closeNotSaveNotify() {
            this.$emit("closeNotSaveNotify")
        },

        /**
         * Phát ra tín hiệu cho component cha về sự kiện confirmNotify
         * NDDAT (19/09/2022)
         */
        confirmNotify() {
            this.$emit("confirmNotify")
        }
    },
    components: { DButton }
}
</script>

<style scoped>
    @import url('../../css/base/dialog.css');
</style>