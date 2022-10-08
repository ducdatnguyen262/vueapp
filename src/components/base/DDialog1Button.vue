<template>
    <div class="dialog-container">
        <div class="dialog dialog--warning">
            <div class="dialog__content">
                <div tabindex="201" ref="first" @keyup.enter="focusNext()" class="warning-icon"></div>
                <div class="dialog__content-text">{{text}}</div>
            </div>
            <div class="dialog__footer">
                <DButton @click="closeNotify" tabindex="201" :id="'dialog1btn'" @keydown.tab="focusFirst()" text="Đóng"></DButton>
            </div>
        </div>
    </div>
</template>

<script>
import DButton from './DButton.vue';
export default {
    props: ["text"],
    components: { DButton },
    mounted() {
        this.focusFirst()
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
         * Focus vào phần tử đầu tiên
         * NDDAT (15/09/2022)
         */
        focusFirst() {
            this.$refs.first.focus()
        },

        /**
         * Chuyển focus đến phần tử thứ 2
         * NDDAT (15/09/2022)
         */
        focusNext() {
            document.getElementById('dialog1btn').focus()
        },
    },
}
</script>

<style scoped>
    @import url('../../css/base/dialog.css');
</style>