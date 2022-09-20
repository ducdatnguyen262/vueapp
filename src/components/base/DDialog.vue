<template>
    <div class="dialog-container">
        <div class="dialog dialog--warning">
            <div class="dialog__content">
                <div class="warning-icon"></div>
                <div class="dialog__content-text">{{text}}</div>
            </div>
            <div class="dialog__footer">
                <!-- <button @click="isShow = false" class="dialog-close button">Đóng</button> -->
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
        closeNotify() {
            this.$emit("closeNotify")
        },
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