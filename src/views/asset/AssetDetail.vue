<template>
    <div class="dialog-container">
        <div class="dialog dialog--form">
            <div class="dialog__header">
                <h2 class="dialog-title">{{title}}</h2>
                <button ref="btnx" class="dialog-x-container">
                    <div @click="btnCloseOnClick" class="dialog-x"></div>
                </button>
            </div>
            <div class="dialog__content">
                <div class="dialog-item">
                    <label>Mã tài sản <span style="color: red;">*</span></label>
                    <input v-model="asset.fixed_asset_code" :class="{'input--error':!asset.fixed_asset_code}" ref="asset_code" class="dialog-input" type="text">
                </div>
                <div class="dialog-item">
                    <label>Tên tài sản <span style="color: red;">*</span></label>
                    <input v-model="asset.fixed_asset_name" :class="{'input--error':!asset.fixed_asset_name}" class="dialog-input dialog-input-big" type="text" placeholder="Nhập tên tài sản">
                </div>
                <div class="dialog-item">
                    <label>Mã bộ phận sử dụng <span style="color: red;">*</span></label>
                    <d-combobox :vmodelValue="asset.department_code" type="1" main="department_code" @comboboxSelected="comboboxDepartment" :class="'combobox--error'" placeholder="Chọn mã bộ phận sử dụng"></d-combobox>
                </div>
                <div class="dialog-item">
                    <label>Tên bộ phận sử dụng</label>
                    <input v-model="asset.department_name" class="dialog-input dialog-input-big" type="text" disabled>
                </div>
                <div class="dialog-item">
                    <label>Mã loại tài sản <span style="color: red;">*</span></label>
                    <d-combobox :vmodelValue="asset.fixed_asset_category_code"  type="2" main="fixed_asset_category_code" @comboboxSelected="comboboxCategory" :class="'combobox--error'" placeholder="Chọn mã loại tài sản"></d-combobox>
                </div>
                <div class="dialog-item">
                    <label>Tên loại tài sản</label>
                    <input v-model="asset.fixed_asset_category_name" class="dialog-input dialog-input-big" type="text" disabled>
                </div>
                <div class="dialog-item">
                    <label>Số lượng <span style="color: red;">*</span></label>
                    <input v-model="asset.quantity" :class="{'input--error':!asset.quantity}" class="dialog-input" type="number" min="0" oninput="validity.valid||(value='');">
                </div>
                <div class="dialog-item">
                    <label>Nguyên giá <span style="color: red;">*</span></label>
                    <input v-model="asset.cost" :class="{'input--error':!asset.cost&&asset.cost!=0}" class="dialog-input" type="number" min="0" oninput="validity.valid||(value='');">
                </div>
                <div class="dialog-item">
                    <label>Tỉ lệ hao mòn (%) <span style="color: red;">*</span></label>
                    <input v-model="asset.depreciation_rate" :class="{'input--error':!asset.depreciation_rate&&asset.depreciation_rate!=0}" class="dialog-input" type="number" min="0" max="100" oninput="validity.valid||(value='');">  
                </div>
                <div class="dialog-item">
                    <label>Ngày mua <span style="color: red;">*</span></label>
                    <el-date-picker v-model="asset.purchase_date" :class="{'datepicker--error':!asset.purchase_date}" format="YYYY/MM/DD" type="date" placeholder="Chọn ngày"/>
                </div>
                <div class="dialog-item">
                    <label>Ngày bắt đầu sử dụng <span style="color: red;">*</span></label>
                    <el-date-picker v-model="asset.production_date" :class="{'datepicker--error':!asset.production_date}" format="YYYY/MM/DD" type="date" placeholder="Chọn ngày"/>
                </div>
                <div class="dialog-item">
                    <label>Năm theo dõi</label>
                    <input v-model="asset.tracked_year" class="dialog-input" type="number" disabled>
                </div>
                <div class="dialog-item">
                    <label>Số năm sử dụng <span style="color: red;">*</span></label>
                    <input v-model="asset.life_time" :class="{'input--error':!asset.life_time}" class="dialog-input" type="number" min="0" oninput="validity.valid||(value='');">
                </div>
                <div class="dialog-item">
                    <label>Giá trị hao mòn năm <span style="color: red;">*</span></label>
                    <input v-model="depreciationYear" :class="{'input--error':!depreciationYear&&depreciationYear!=0}" class="dialog-input" type="number" min="0" oninput="validity.valid||(value='');">
                </div>
            </div>
            <div class="dialog__footer">
                <DButton @click="btnCloseOnClick" text="Hủy" type="white" class="mr-10"></DButton>
                <DButton @click="btnSaveOnClick" text="Lưu" @keydown.tab="focusBack()"></DButton>
            </div>
        </div>
    </div>
    <d-dialog-1-button v-if="validateShow" @closeNotify="closeValidateMethod" :text="errorMessage"></d-dialog-1-button>
    <d-dialog v-if="notifyShow" @closeNotify="closeNotifyMethod" @confirmNotify="confirmNotifyMethod" text="Bạn có muốn hủy bỏ khai báo tài sản này?" textbtn="Hủy bỏ"></d-dialog>
</template>

<script>
import DCombobox from '@/components/base/DCombobox.vue';
import DButton from '@/components/base/DButton.vue';
import useValidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import DDialog from '@/components/base/DDialog.vue';
import DDialog1Button from '../../components/base/DDialog1Button.vue';
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
    
export default {
    name:"AssetDetail",
    components: { DCombobox, DButton, DDialog, DDialog1Button },
    props: {
        assetSelected: Function,
        formMode: {
            type: Number,
            default: Enum.FormMode.Add
        },
        title: String,
    },
    created() {
        // Lấy tài sản là tài sản được truyền vào
        this.asset = this.assetSelected
        this.defaultValue()
    },
    mounted() {
        // Focus vào ô đầu của dialog
        this.focusFirst()
    },
    updated() {
        // Cập nhật hao mòn năm
        this.depreciationYear = this.asset.cost * this.asset.depreciation_rate / 100
    },
    data() {
        return {
            asset: {}, // Lưu dữ liệu tài sản
            notifyShow: false, // Có hiển thị dialog cảnh báo hay không
            v$: useValidate(), // Validate dữ liệu (sử dụng vuelidate)
            errorArray: [], // Dãy chứa các lỗi validate
            errorMessage: "", // Thông điệp hiện trong dialog cảnh báo lỗi validate
            validateShow: false, // Có hiển thị dialog cảnh báo lỗi validate hay không
            api: "https://localhost:7182/api/v1/Assets", // API lấy tài sản
            depreciationYear: 0, // Hao mòn năm
        }
    },
    validations() {
        return {
            // asset: { required },
            asset: { 
                fixed_asset_code: { required },
                fixed_asset_name: { required },
             },
        }
    },
    methods: {
        /**
         * Cập nhật dữ liệu phòng ban khi chọn trong combobox
         * NDDAT (28/09/2022)
         * @param {string} id id phòng ban
         * @param {string} code mã phòng ban
         * @param {string} name tên phòng ban
         */
        comboboxDepartment(id, code, name) {
            this.asset.department_id = id
            this.asset.department_code = code
            this.asset.department_name = name
        },

        /**
         * Cập nhật dữ liệu loại tài sản khi chọn trong combobox
         * NDDAT (28/09/2022)
         * @param {string} id id loại tài sản
         * @param {string} code mã loại tài sản
         * @param {string} name tên loại tài sản
         */
        comboboxCategory(id, code, name) {
            this.asset.fixed_asset_category_id = id
            this.asset.fixed_asset_category_code = code
            this.asset.fixed_asset_category_name = name
        },

        /**
         * Chọn ngày mặc định là ngày hiện tại nếu không có sẵn ngày
         * NDDAT (19/09/2022)
         */        
         defaultValue() {
            if (this.asset.purchase_date == null) this.asset.purchase_date = new Date()
            if (this.asset.production_date == null) this.asset.production_date = new Date()
            if (this.asset.tracked_year == null) this.asset.tracked_year = new Date().getFullYear()
        },

        /**
         * Đóng dialog cảnh báo lỗi validate
         * NDDAT (19/09/2022)
         */
        closeValidateMethod() {
            this.validateShow = false
        },

        /**
         * Tạo thông điệp cho dialog cảnh báo lỗi validate
         * NDDAT (19/09/2022)
         */        
        createValidateMessage() {
            try{
                this.errorMessage = "Cần phải nhập thông tin: "
                for(let i in this.errorArray) {
                    this.errorMessage = this.errorMessage + this.errorArray[i]
                    if(i != this.errorArray.length - 1) this.errorMessage = this.errorMessage +", "
                }
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * Đóng dialog cảnh báo
         * NDDAT (15/09/2022)
         */
        closeNotifyMethod() {
            this.notifyShow = false
        },

        /**
         * Xác nhận hủy bỏ khai báo
         * NDDAT (15/09/2022)
         */
        confirmNotifyMethod() {
            this.closeNotifyMethod()
            this.$emit("hideDialog")
        },

        /**
         * Focus vào phần tử đầu tiên
         * NDDAT (15/09/2022)
         */
        focusFirst() {
            try {
                this.$refs.asset_code.focus()
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * Chuyển focus lên đầu sau khi đến cuối dialog tài sản
         * NDDAT (15/09/2022)
         */
        focusBack() {
            try {
                this.$refs.btnx.focus()
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * Click vào button để đóng dialog tài sản
         * NDDAT (15/09/2022)
         */
        btnCloseOnClick() {
            // Hiện cảnh báo có muốn đóng hay không
            this.notifyShow = true
        },

        /**
         * Click vào button để lưu tài sản
         * NDDAT (15/09/2022)
         */
        btnSaveOnClick() {
            try{
                var method = Resource.Method.Post
                var url = this.api
                // Validate dữ liệu:
                this.v$.$validate()
                if (this.v$.$error) {
                    this.errorArray = []
                    if (this.v$.asset.fixed_asset_code.$error) this.errorArray.push(Resource.IsEmpty.Code);
                    if (this.v$.asset.fixed_asset_name.$error) this.errorArray.push(Resource.IsEmpty.Name);
                    this.createValidateMessage()
                    this.validateShow = true
                } else {
                    // Cất dữ liệu:
                    console.log(1);
                    if(this.formMode == Enum.FormMode.Edit) {
                        method = Resource.Method.Put
                        url = url + `/${this.asset.fixed_asset_id}`
                    }
                    fetch(url, {method: method, headers:{ 'Content-Type': 'application/json'}, body: JSON.stringify(this.asset)})
                    .then(res => res.json())
                    .then(res =>{
                        var status = res.status
                        switch(status) {
                            case 400: 
                                alert("Dữ liệu đầu vào ko hợp lệ") 
                                break
                            case 500: 
                                alert("Lỗi phía Server") 
                                break
                            default: 
                                this.$emit("hideDialogSuccess")
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped>
@import url('../../css/base/input.css');
@import url('../../css/base/datepicker.css');
</style>