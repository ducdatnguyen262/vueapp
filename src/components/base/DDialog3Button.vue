<template>
    <div class="dialog-container">
        <div class="dialog dialog--warning">
            <div class="dialog__content">
                <div 
                    tabindex="201" 
                    ref="first" 
                    class="warning-icon"
                    @keyup="focusNext()" 
                />
                <div class="dialog__content-text">{{text}}</div>
            </div>
            <div class="dialog__footer">
                <DButton 
                    tabindex="201" 
                    text="Hủy bỏ" 
                    type="outline" 
                    class="mr-10"
                    :id="'dialog3btn'" 
                    @click="closeNotify" 
                />
                <DButton 
                    tabindex="201" 
                    text="Không lưu" 
                    type="sub" 
                    class="mr-10"
                    @click="closeNotSaveNotify" 
                />
                <DButton 
                    tabindex="201" 
                    text="Lưu"
                    @click="confirmNotify" 
                    @keydown.tab="focusFirst()" 
                />
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
            document.getElementById('dialog3btn').focus()
        },
    },
}
</script>

<style scoped>
    @import url('../../css/base/dialog.css');
</style>