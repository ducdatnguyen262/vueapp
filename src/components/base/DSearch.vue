<template>
    <div class="search">
        <div class="search__icon"></div>
        <input class="search__input" type="text" :placeholder="placeholder">
    </div>
</template>

<script>
export default {
    props: ["placeholder"]
}
</script>

<style scoped>
    @import url('../../css/base/search.css');
</style>