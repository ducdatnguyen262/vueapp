<template>
    <div class="combobox">
        <input 
            v-model="value"
            type="text" 
            :id="'input' + tabindex" 
            :tabindex="tabindex" 
            :class="{'input--error': !value && isSubmited}"
            :placeholder="placeholder" 
            :disabled="disabled"
            @click="toggle()"
            @keydown.esc="close()" 
            @keydown.down="open();focusFirstItem()" 
            @blur="close()" 
            @keyup="searchAll()"
            @keyup.enter="selectWithKey()"
        >
        <d-tooltip-warning :text="tooptipText"></d-tooltip-warning>
        <button tabindex="-1" 
            :disabled="disabled"
            @click="toggle()" 
            @blur="close()" 
        />
        <div v-show="isOpen" class="combobox__data">
            <div v-for="(item, index) in items" :key="item[cb.id]" 
                class="combobox__item"
                :id="tabindex + index" 
                :tabindex="tabindex" 
                :class="{'combobox__item--selected': item[main]==value || item[main]==vmodelValue}" 
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
    props: ["placeholder", "main", "type", "vmodelValue", "isSubmited", "tooptipText", "tabindex", "disabled", "budgetId"],
    data() {
        return {
            isOpen: false,
            isHover: -1,
            items: [],
            value: "",
            cb: {
                id: "", // L??u bi???n id
                code: "", // L??u bi???n m??
                name: "" // L??u bi???n t??n
            },
            keyword: "",
            justCreateForm: true, // Bi???n x??c ?????nh xem form c?? v???a ???????c t???o hay kh??ng
            isFocus: -1,
        };
    },
    created() {
        // G???i API l???y d??? li???u khi t???o combobox
        this.loadData();
        // ?????nh h??nh combobox theo prop 'type'
        this.comboboxType();
    },
    mounted() {
        // G??n gi?? tr??? cho value ????? truy???n v??o v-model
        this.value = this.vmodelValue;
    },
    updated() {
        // G??n gi?? tr??? ????? tr??nh combobox item hi???n l??n khi m??? form
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
        // T???o API l???y d??? li???u
        api: function () {
            if (this.type == Enum.ComboboxType.Department)
                return Resource.Url.Department+"/filter?keyword="+this.keyword+"&type="+this.main;
            else if (this.type == Enum.ComboboxType.Category)
                return Resource.Url.Category+"/filter?keyword="+this.keyword+"&type="+this.main;
            else if(this.type == Enum.ComboboxType.Budget)
                return Resource.Url.Budget;
            else return "";
        },
    },
    methods: {
        /**
         * Focus v??o input
         * NDDAT (07/10/2022)
         */
        focusInput() {
            document.getElementById(`input${this.tabindex}`).focus()
        },

        /**
         * Focus v??o item ?????u ti??n
         * NDDAT (07/10/2022)
         */
        focusFirstItem() {
            document.getElementById(`${this.tabindex}0`).focus()
        },

        /**
         * Focus v??o item tr?????c ????
         * NDDAT (07/10/2022)
         */
        prevItem(e) {
            if(e.target.previousElementSibling){
                e.target.previousElementSibling.focus()
            }
        },

        /**
         * Focus v??o item ti???p theo
         * NDDAT (07/10/2022)
         */
        nextItem(e) {
            if(e.target.nextElementSibling){
                e.target.nextElementSibling.focus()
            }
        },

        /**
         * ????ng c??c item c???a combobox
         * NDDAT (06/10/2022)
         */
        close() {
            this.isOpen = false
        },

        /**
         * M??? c??c item c???a combobox
         * NDDAT (06/10/2022)
         */
        open() {
            this.isOpen = true
        },

        /**
         * ????ng/M??? c??c item c???a combobox
         * NDDAT (06/10/2022)
         */
        toggle() {
            this.isOpen = !this.isOpen
        },

        /**
         * ????ng combobox khi ch???n b???ng ph??m t???t
         * NDDAT (10/10/2022)
         */
        selectWithKey(){
            if(this.isOpen == true) {
                this.keyword = "-11-";
                this.loadData()
            }
        },

        /**
         * G???i h??m t??m ki???m t???t c??? khi value l?? r???ng
         * NDDAT (30/09/2022)
         */
        searchAll() {
            if (!this.value) {
                this.$emit("searchAll");
            }
        },

        /**
         * Truy???n c??c bi???n v??o combobox theo ki???u c???a prop 'type'
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
            else if (this.type == Enum.ComboboxType.Budget) {
                this.cb.id = Resource.Budget.Id;
                this.cb.code = "";
                this.cb.name = Resource.Budget.Name;
            }
        },

        /**
         * Ch???n 1 ph???n t??? trong combobox
         * NDDAT (19/09/2022)
         * @param {string} main ph???n t??? ch??nh hi???n l??n c???a combobox
         * @param {string} id id ph???n t??? ??ang ch???n
         * @param {string} code m?? ph???n t??? ??ang ch???n
         * @param {string} name t??n ph???n t??? ??ang ch???n
         * @param {string} depreciation_rate t??? l??? hao m??n ph???n t??? ??ang ch???n
         * @param {string} life_time n??m s??? d???ng ph???n t??? ??ang ch???n
         */
        selected(main, id, code, name, depreciation_rate, life_time) {
            this.value = main;
            this.close()
            this.focusInput()
            this.$emit("comboboxSelected", id, code, name);
            this.$emit("comboboxSearch", id);
            if(this.main == 'fixed_asset_category_code') this.$emit('updateWithCategoryCode', depreciation_rate, life_time)
            if(this.main == 'budget_name'){              
                this.$emit('budgetSelected', main, this.budgetId)
            } 
        },

        /**
         * G???i API l???y d??? li???u
         * NDDAT (19/09/2022)
         */
        loadData() {
            try {
                // G???i api l???y d??? li???u
                fetch(this.api, { method: "GET" })
                    .then(res => res.json())
                    .then(data => {
                    if(this.type == Enum.ComboboxType.Budget) this.items = Object.values(data);
                    else this.items = Object.values(data)[0];
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