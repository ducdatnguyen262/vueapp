<template>
    <div class="combobox">
        <input type="text" :placeholder="placeholder" v-model=value>
        <button @click="isOpen = !isOpen" @blur="isOpen = false"></button>
        <div v-show="isOpen" class="combobox__data">
            <div v-for="(item, index) in items" :key="item.DepartmentId" @click="selected(item.DepartmentName)" @mouseover="isHover = index" @mouseleave="isHover = -1" class="combobox__item">
                <div style="width: 30px;">
                    <i v-show="isHover == index" class="fa-solid fa-check"></i>  
                </div>
                {{item.DepartmentName}}
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props:['placeholder', 'id'],
    data() {
        return {
            isOpen: false,
            isHover: -1,
            items: [],
            value: "",
            api:"",
        }
    },
    methods: {
        selected(data) {
            this.value = data
            this.isOpen = false
        },
        loadData() {
            // Gọi api lấy dữ liệu
            fetch("https://cukcuk.manhnv.net/api/v1/Departments", {method:"GET"})
            .then(res => res.json())
            .then(data => {
                this.items = data
                // console.log(data);
            })
            .catch(res => {
                console.log(res);
            })
        },
    },
    created() {
        this.loadData()
    }
}
</script>

<style scoped>
    @import url('../../assets/font/fontawesome-pro-6.1.1-web/css/all.min.css');
    @import url('../../css/base/combobox.css');
</style>