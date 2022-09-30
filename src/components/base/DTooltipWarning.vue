<template>
    <div class="tool-tip-warning" hidden>{{text}} không thể để trống!</div>
</template>

<script>
export default {
    props:["text"]
}
</script>

<style scoped>
    @import url('../../css/base/tooltipwarning.css');
</style>