<template>
    <div class="toast-wrapper">
        <div class="toast toast--primary">
            <div :class="type+'-icon'"></div>
            <div class="toast__text">{{text}}</div>
        </div>
    </div>
</template>

<script>
import Resource from '../../js/resource.js'

export default {
    props:["type"],
    data() {
        return {
            text: Resource.Toast[this.type]
        }
    }
}
</script>

<style scoped>
    @import url('../../css/base/toast.css');
</style>