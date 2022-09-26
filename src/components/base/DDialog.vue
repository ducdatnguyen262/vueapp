<template>
    <div class="dialog-container">
        <div class="dialog dialog--warning">
            <div class="dialog__content">
                <div class="warning-icon"></div>
                <div class="dialog__content-text">{{text}}</div>
            </div>
            <div class="dialog__footer">
                <DButton @click="closeNotify" text="Không" type="white-border" class="mr-10"></DButton>
                <DButton @click="confirmNotify" :text="textbtn"></DButton>
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
         * NDDAT (19/07/2022)
         */
        closeNotify() {
            this.$emit("closeNotify")
        },

        /**
         * Phát ra tín hiệu cho component cha về sự kiện confirmNotify
         * NDDAT (19/07/2022)
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