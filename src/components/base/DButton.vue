<template>
    <button :id="id" class="button" :class="'button--' + type">
        <div v-if="icon" :class="'icon-' + icon"></div>
        <div :class="{'mr-11':icon2}"></div>
        <div v-if="icon2" :class="'icon-' + icon2"></div>
        {{text}}
    </button>
</template>

<script>
export default {
    props:["text", "icon", "icon2", "type", "id"],
}
</script>

<style scoped>
    @import url('../../css/base/button.css');
</style>