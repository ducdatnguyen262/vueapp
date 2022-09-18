<template>
    <div class="tool-tip" hidden>{{text}}</div>
</template>

<script>
export default {
    props:["text"]
}
</script>

<style scoped>
    @import url('../../css/base/tooltip.css');
</style>