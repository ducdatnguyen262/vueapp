<template>
    <button :id="id" class="button" :class="'button--' + type">
        <div :class="'icon-' + icon"></div>
        {{text}}
    </button>
</template>

<script>
export default {
    props:["text", "icon", "type", "id"],
}
</script>

<style scoped>
    @import url('../../css/base/button.css');
</style>