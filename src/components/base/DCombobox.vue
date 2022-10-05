<template>
    <div class="combobox">
        <input @keydown.esc="isOpen = false" type="text" :placeholder="placeholder" v-model=value @keyup="searchAll()" @focus="focusInput()" @click="isOpen = !isOpen" @blur="isOpen = false" :class="{'input--error': !value && isSubmited}">
        <d-tooltip-warning :text="tooptipText"></d-tooltip-warning>
        <button tabindex="-1" @click="isOpen = !isOpen" @blur="isOpen = false"></button>
        <div v-show="isOpen" class="combobox__data">
            <div v-for="(item, index) in items" :key="item[cb.id]" @mousedown="selected(item[main], item[cb.id], item[cb.code], item[cb.name], item.depreciation_rate, item.life_time)" @mouseover="isHover = index" @mouseleave="isHover = -1" :class="{'combobox__item--selected': item[main]==value}" class="combobox__item">
                <div style="width: 30px;">
                    <i v-show="(isHover == index) || (item[main]==value)" class="fa-solid fa-check"></i>
                </div>
                {{item[main]}}
            </div>
        </div>
    </div>
    <!-- <d-tooltip-warning :text="tooptipText"></d-tooltip-warning> -->
</template>

<script>
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
import DTooltipWarning from './DTooltipWarning.vue'
export default {
    components: { DTooltipWarning },
    props: ["placeholder", "main", "type", "vmodelValue", "isSubmited", "tooptipText"],
    data() {
        return {
            isOpen: false,
            isHover: -1,
            items: [],
            value: "",
            cb: {
                id: "", // Lưu biến id
                code: "", // Lưu biến mã
                name: "" // Lưu biến tên
            },
            keyword: "",
            justCreateForm: true // Biến xác định xem form có vừa được tạo hay không
        };
    },
    created() {
        // Gọi API lấy dữ liệu khi tạo combobox
        this.loadData();
        // Định hình combobox theo prop 'type'
        this.comboboxType();
    },
    mounted() {
        // Gán giá trị cho value để truyền vào v-model
        this.value = this.vmodelValue;
    },
    updated() {
        // 
        if(this.justCreateForm == true){
            this.justCreateForm = false
        }
    },
    watch: {
        value() {
            if((this.value || this.value == 0) && !this.justCreateForm){
                this.keyword = this.value
                this.isOpen = true
                this.loadData()
            }
        }
    },
    computed: {
        // Tạo API lấy dữ liệu
        api: function () {
            if (this.type == Enum.ComboboxType.Department)
                return Resource.Url.Department+"/filter?keyword="+this.keyword+"&type="+this.main;
            else
                return Resource.Url.Category+"/filter?keyword="+this.keyword+"&type="+this.main;
        }
    },
    methods: {
        // nextMove(e) {
        //     if(e.target.nextElementSibling) {
        //         console.log(1);
        //         this.isOpen = true
        //         this.$nextTick(() => e.target.nextElementSibling.focus());
        //     }
        // },

        // nextMove() {
        //     console.log(1);
        //     this.$nextTick(() => this.$refs.ab.focus());
        // },

        // nextMove() {
        //     console.log(1);
        //     this.$nextTick(() => document.getElementById('ab').focus());
        // },

        /**
         * Gọi hàm tìm kiếm tất cả khi value là rỗng
         * NDDAT (30/09/2022)
         */
        searchAll() {
            if (!this.value) {
                this.$emit("searchAll");
            }
        },

        /**
         * Truyền các biến vào combobox theo kiểu của prop 'type'
         * NDDAT (28/09/2022)
         */
        comboboxType() {
            if (this.type == Enum.ComboboxType.Department) {
                this.cb.id = Resource.Department.Id;
                this.cb.code = Resource.Department.Code;
                this.cb.name = Resource.Department.Name;
            }
            else if (this.type == Enum.ComboboxType.Category) {
                this.cb.id = Resource.Category.Id;
                this.cb.code = Resource.Category.Code;
                this.cb.name = Resource.Category.Name;
            }
        },

        /**
         * Chọn 1 phần tử trong combobox
         * NDDAT (19/09/2022)
         * @param {string} data tên phần tử đang chọn
         */
        selected(main, id, code, name, depreciation_rate, life_time) {
            this.value = main;
            this.isOpen = false;
            this.$emit("comboboxSelected", id, code, name);
            this.$emit("comboboxSearch", id);
            if(this.main == 'fixed_asset_category_code') this.$emit('updateWithCategoryCode', depreciation_rate, life_time)
        },

        /**
         * Gọi API lấy dữ liệu
         * NDDAT (19/09/2022)
         */
        loadData() {
            try {
                // Gọi api lấy dữ liệu
                fetch(this.api, { method: "GET" })
                    .then(res => res.json())
                    .then(data => {
                    this.items = Object.values(data)[0];
                })
                    .catch(res => {
                    console.error(res);
                });
            }
            catch (error) {
                console.error(error);
            }
        },
    },
}
</script>

<style scoped>
    @import url('../../assets/font/fontawesome-pro-6.1.1-web/css/all.min.css');
    @import url('../../css/base/combobox.css');
</style>