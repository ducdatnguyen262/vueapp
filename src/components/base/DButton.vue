<template>
    <button class="button" :class="'button--' + type">
        <div :id="id" :class="'icon-' + icon"></div>
        {{text}}
    </button>
</template>

<script>
export default {
    props:["text", "icon", "type", "id"],
    methods: {

    },
    data() {
        return {
            
        }
    }
}
</script>

<style scoped>
    @import url('../../css/base/button.css');
</style>