<template>
    <div class="combobox">
        <input 
            v-model=value 
            type="text" 
            :id="'input' + tabindex" 
            :tabindex="tabindex" 
            :class="{'input--error': !value && isSubmited}"
            :placeholder="placeholder" 
            @click="toggle()"
            @keydown.esc="close()" 
            @keydown.down="open();focusFirstItem()" 
            @blur="close()" 
            @keyup="searchAll()"
            @keyup.enter="selectWithKey()"
        >
        <d-tooltip-warning :text="tooptipText"></d-tooltip-warning>
        <button tabindex="-1" @click="toggle()" @blur="close()"></button>
        <div v-show="isOpen" class="combobox__data">
            <div v-for="(item, index) in items" :key="item[cb.id]" 
                class="combobox__item"
                :id="tabindex + index" 
                :tabindex="tabindex" 
                :class="{'combobox__item--selected': item[main]==value}" 
                @focus="open();isFocus = index;" 
                @blur="close();isFocus=-1;"
                @keydown.up="prevItem" 
                @keydown.down="nextItem" 
                @keydown.esc="focusInput()" 
                @keydown.enter="selected(item[main], item[cb.id], item[cb.code], item[cb.name], item.depreciation_rate, item.life_time)"
                @mousedown="selected(item[main], item[cb.id], item[cb.code], item[cb.name], item.depreciation_rate, item.life_time)" 
                @mouseover="isHover = index" 
                @mouseleave="isHover = -1"
            >
                <div style="width: 30px; display: inline-block;">
                    <i v-show="(isHover == index) || (isFocus == index) || (item[main]==value)" class="fa-solid fa-check"></i>
                </div>
                <el-tooltip :disabled="item[main].length < 33" :content="item[main]" placement="bottom-start" effect="light">
                    <span>{{item[main]}}</span>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
import DTooltipWarning from './DTooltipWarning.vue'

export default {
    components: { DTooltipWarning },
    props: ["placeholder", "main", "type", "vmodelValue", "isSubmited", "tooptipText", "tabindex"],
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
            justCreateForm: true, // Biến xác định xem form có vừa được tạo hay không
            isFocus: -1,
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
        // Gán giá trị để tránh combobox item hiện lên khi mở form
        if(this.justCreateForm == true){
            this.justCreateForm = false
        }
    },
    watch: {
        value() {
            if((this.value || this.value == 0) && !this.justCreateForm){
                this.keyword = this.value
                this.open()
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
        },
    },
    methods: {
        /**
         * Focus vào input
         * NDDAT (07/10/2022)
         */
        focusInput() {
            document.getElementById(`input${this.tabindex}`).focus()
        },

        /**
         * Focus vào item đầu tiên
         * NDDAT (07/10/2022)
         */
        focusFirstItem() {
            document.getElementById(`${this.tabindex}0`).focus()
        },

        /**
         * Focus vào item trước đó
         * NDDAT (07/10/2022)
         */
        prevItem(e) {
            if(e.target.previousElementSibling){
                e.target.previousElementSibling.focus()
            }
        },

        /**
         * Focus vào item tiếp theo
         * NDDAT (07/10/2022)
         */
        nextItem(e) {
            if(e.target.nextElementSibling){
                e.target.nextElementSibling.focus()
            }
        },

        /**
         * Đóng các item của combobox
         * NDDAT (06/10/2022)
         */
        close() {
            this.isOpen = false
        },

        /**
         * Mở các item của combobox
         * NDDAT (06/10/2022)
         */
        open() {
            this.isOpen = true
        },

        /**
         * Đóng/Mở các item của combobox
         * NDDAT (06/10/2022)
         */
        toggle() {
            this.isOpen = !this.isOpen
        },

        /**
         * Đóng combobox khi chọn bằng phím tắt
         * NDDAT (10/10/2022)
         */
        selectWithKey(){
            if(this.isOpen == true) {
                this.keyword = "-11-";
                this.loadData()
            }
        },

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
         * @param {string} main phần tử chính hiện lên của combobox
         * @param {string} id id phần tử đang chọn
         * @param {string} code mã phần tử đang chọn
         * @param {string} name tên phần tử đang chọn
         * @param {string} depreciation_rate tỉ lệ hao mòn phần tử đang chọn
         * @param {string} life_time năm sử dụng phần tử đang chọn
         */
        selected(main, id, code, name, depreciation_rate, life_time) {
            this.value = main;
            this.close()
            this.focusInput()
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