<template>
    <div class="combobox">
        <input type="text" :placeholder="placeholder" v-model=value @keyup="searchAll()" :class="{'input--error': !value && isSubmited}">
        <button tabindex="-1" @click="isOpen = !isOpen" @blur="isOpen = false"></button>
        <div v-show="isOpen" class="combobox__data">
            <div v-for="(item, index) in items" :key="item[cb.id]" @mousedown="selected(item[main], item[cb.id], item[cb.code], item[cb.name])" @mouseover="isHover = index" @mouseleave="isHover = -1" class="combobox__item">
                <div style="width: 30px;">
                    <i v-show="isHover == index" class="fa-solid fa-check"></i>
                </div>
                {{item[main]}}
            </div>
        </div>
    </div>
</template>

<script>
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
export default {
    props:['placeholder', 'main', 'type', 'vmodelValue', 'isSubmited'],
    created() {
        // Gọi API lấy dữ liệu khi tạo combobox
        this.loadData()
        // Định hình combobox theo prop 'type'
        this.comboboxType()
    },
    mounted() {
        // Lấy giá trị value để truyền vào v-model
        this.value=this.vmodelValue
    },
    data() {
        return {
            isOpen: false, // Combobox có đang mở không
            isHover: -1, // Hover vào 1 phần tử trong combobox
            items: [], // Danh sách các phần tử trong combobox
            value: "", // Tên phần tử đang chọn
            cb: {
                id: "", // Lưu biến id
                code: "", // Lưu biến mã
                name: "" // Lưu biến tên
            },
        }
    },
    computed: {
        // Tạo API lấy dữ liệu
        api : function() {
            if(this.type == Enum.ComboboxType.Department)
                return "https://localhost:7182/api/v1/" + Resource.ComboboxType.Department + "s"
            if(this.type == Enum.ComboboxType.Category)
                return "https://localhost:7182/api/v1/" + Resource.ComboboxType.Category + "s"
            else 
                return "https://localhost:7182/api/v1/Departments"
        }
    },
    methods: {
        searchAll() {
            if (!this.value) {
                this.$emit("searchAll")
            }
        },

        /**
         * Truyền các biến vào combobox theo kiểu của prop 'type'
         * NDDAT (28/09/2022)
         */
        comboboxType() {
            if(this.type == Enum.ComboboxType.Department){
                this.cb.id = Resource.Department.Id
                this.cb.code = Resource.Department.Code
                this.cb.name = Resource.Department.Name
            }
            else if(this.type == Enum.ComboboxType.Category){
                this.cb.id = Resource.Category.Id
                this.cb.code = Resource.Category.Code
                this.cb.name = Resource.Category.Name
            }
        },

        /**
         * Chọn 1 phần tử trong combobox
         * NDDAT (19/09/2022)
         * @param {string} data tên phần tử đang chọn
         */
        selected(main, id, code, name) {
            this.value = main
            this.isOpen = false
            this.$emit("comboboxSelected", id, code, name)
            this.$emit("comboboxSearch", id)
        },

        /**
         * Gọi API lấy dữ liệu
         * NDDAT (19/09/2022)
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
}
</script>

<style scoped>
    @import url('../../assets/font/fontawesome-pro-6.1.1-web/css/all.min.css');
    @import url('../../css/base/combobox.css');
</style>