<template>
    <div class="combobox">
        <input type="text" :placeholder="placeholder" v-model=value>
        <button @click="isOpen = !isOpen" @blur="isOpen = false"></button>
        <div v-show="isOpen" class="combobox__data">
            <div v-for="(item, index) in items" :key="item.department_id" @mousedown="selected(item.department_name)" @mouseover="isHover = index" @mouseleave="isHover = -1" class="combobox__item">
                <div style="width: 30px;">
                    <i v-show="isHover == index" class="fa-solid fa-check"></i>
                </div>
                {{item.department_name}}
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props:['placeholder', 'id'],
    data() {
        return {
            isOpen: false, // Combobox có đang mở không
            isHover: -1, // Hover vào 1 phần tử trong combobox
            items: [], // Danh sách các phần tử trong combobox
            value: "", // Tên phần tử đang chọn
            api:"https://localhost:7182/api/v1/Departments", // API lấy dữ liệu
        }
    },
    methods: {
        /**
         * Chọn 1 phần tử trong combobox
         * NDDAT (19/07/2022)
         * @param {string} data tên phần tử đang chọn
         */
        selected(data) {
            this.value = data
            this.isOpen = false
        },

        /**
         * Gọi API lấy dữ liệu
         * NDDAT (19/07/2022)
         */
        loadData() {
            try {
                // Gọi api lấy dữ liệu
                fetch(this.api, {method:"GET"})
                .then(res => res.json())
                .then(data => {
                    this.items = data
                })
                .catch(res => {
                    console.log(res);
                })
            } catch (error) {
                console.log(error);
            }
        },
    },
    created() {
        // Gọi API lấy dữ liệu khi tạo combobox
        this.loadData()
    }
}
</script>

<style scoped>
    @import url('../../assets/font/fontawesome-pro-6.1.1-web/css/all.min.css');
    @import url('../../css/base/combobox.css');
</style>