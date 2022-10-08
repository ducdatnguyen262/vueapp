<template>
    <div class="dialog-container">
        <div class="dialog dialog--warning">
            <div class="dialog__content">
                <div tabindex="201" ref="first" @keyup.enter="focusNext()" @keyup.delete="focusNext()" class="warning-icon"></div>
                <div class="dialog__content-text" v-html="text"></div>
            </div>
            <div class="dialog__footer">
                <DButton @click="closeNotify" tabindex="201" :id="'dialog2btn'" text="Không" type="outline" class="mr-10"></DButton>
                <DButton @click="confirmNotify" tabindex="201" @keydown.tab="focusFirst()" :text="textbtn"></DButton>
            </div>
        </div>
    </div>
</template>

<script>
import DButton from './DButton.vue';
export default {
    props: ["text", "textbtn"],
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
         * Phát ra tín hiệu cho component cha về sự kiện confirmNotify
         * NDDAT (19/09/2022)
         */
        confirmNotify() {
            this.$emit("confirmNotify")
        },

        /**
         * Focus vào phần tử đầu tiên
         * NDDAT (15/09/2022)
         */
        focusFirst() {
            this.$refs.first.focus()
        },

        /**
         * Chuyển focus lên đầu sau khi đến cuối
         * NDDAT (15/09/2022)
         */
        focusNext() {
            document.getElementById('dialog2btn').focus()
        },
    },
}
</script>

<style scoped>
    @import url('../../css/base/dialog.css');
</style>