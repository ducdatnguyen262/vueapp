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
                    <input v-model="asset.fixed_asset_code" :class="{'input--error':!asset.fixed_asset_code && this.isSubmited}" ref="asset_code" class="dialog-input" type="text">
                    <d-tooltip-warning text="Mã tài sản"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Tên tài sản <span style="color: red;">*</span></label>
                    <input v-model="asset.fixed_asset_name" :class="{'input--error':!asset.fixed_asset_name && this.isSubmited}" class="dialog-input dialog-input-big" type="text" placeholder="Nhập tên tài sản">
                    <d-tooltip-warning text="Tên tài sản"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Mã bộ phận sử dụng <span style="color: red;">*</span></label>
                    <d-combobox :vmodelValue="asset.department_code" type="1" main="department_code" @comboboxSelected="comboboxDepartment" :isSubmited="this.isSubmited" tooptipText="Mã bộ phận sử dụng" placeholder="Chọn mã bộ phận sử dụng"></d-combobox>
                </div>
                <div class="dialog-item">
                    <label>Tên bộ phận sử dụng</label>
                    <input v-model="asset.department_name" class="dialog-input dialog-input-big" type="text" disabled>
                </div>
                <div class="dialog-item">
                    <label>Mã loại tài sản <span style="color: red;">*</span></label>
                    <d-combobox :vmodelValue="asset.fixed_asset_category_code"  type="2" main="fixed_asset_category_code" @comboboxSelected="comboboxCategory" :isSubmited="this.isSubmited" tooptipText="Mã loại tài sản" placeholder="Chọn mã loại tài sản"></d-combobox>
                    <d-tooltip-warning text="Mã loại tài sản"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Tên loại tài sản</label>
                    <input v-model="asset.fixed_asset_category_name" class="dialog-input dialog-input-big" type="text" disabled>
                </div>
                <div class="dialog-item">
                    <label>Số lượng <span style="color: red;">*</span></label>
                    <input v-model="asset.quantity" :class="{'input--error':!asset.quantity && asset.quantity!='0' && this.isSubmited}" class="dialog-input" type="number" min="0" oninput="validity.valid||(value='');">
                    <d-tooltip-warning text="Số lượng"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Nguyên giá <span style="color: red;">*</span></label>
                    <input v-model="asset.cost" @focus="focus = true" @blur="focus = false" :class="{'input--error':!asset.cost && asset.cost!='0' && this.isSubmited}" class="dialog-input" type="number" min="0" oninput="validity.valid||(value='');">
                    <d-tooltip-warning text="Nguyên giá"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Tỉ lệ hao mòn (%) <span style="color: red;">*</span></label>
                    <input v-model="asset.depreciation_rate" @focus="focus = true" @blur="focus = false" :class="{'input--error':!asset.depreciation_rate && asset.depreciation_rate!='0' && this.isSubmited}" class="dialog-input" type="number" min="0" max="100" oninput="validity.valid||(value='');">  
                    <d-tooltip-warning text="Tỉ lệ hao mòn"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Ngày mua <span style="color: red;">*</span></label>
                    <el-date-picker v-model="asset.purchase_date" :class="{'datepicker--error':!asset.purchase_date && this.isSubmited}" format="YYYY/MM/DD" type="date" placeholder="Chọn ngày"/>
                    <d-tooltip-warning text="Ngày mua"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Ngày bắt đầu sử dụng <span style="color: red;">*</span></label>
                    <el-date-picker v-model="asset.production_date" :class="{'datepicker--error':!asset.production_date && this.isSubmited}" format="YYYY/MM/DD" type="date" placeholder="Chọn ngày"/>
                    <d-tooltip-warning text="Ngày bắt đầu sử dụng"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Năm theo dõi</label>
                    <input v-model="asset.tracked_year" class="dialog-input" type="number" disabled>
                </div>
                <div class="dialog-item">
                    <label>Số năm sử dụng <span style="color: red;">*</span></label>
                    <input v-model="asset.life_time" :class="{'input--error':!asset.life_time && asset.life_time!='0' && this.isSubmited}" class="dialog-input" type="number" min="0" oninput="validity.valid||(value='');">
                    <d-tooltip-warning text="Số năm sử dụng"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Giá trị hao mòn năm <span style="color: red;">*</span></label>
                    <input v-model="asset.depreciation_year" :class="{'input--error':!asset.depreciation_year && asset.depreciation_year!='0' && this.isSubmited}" class="dialog-input" type="number" min="0" oninput="validity.valid||(value='');">
                    <d-tooltip-warning text="Giá trị hao mòn năm"></d-tooltip-warning>
                </div>
            </div>
            <div class="dialog__footer">
                <DButton @click="btnCloseOnClick" text="Hủy" type="white" class="mr-10"></DButton>
                <DButton @click="btnSaveOnClick" text="Lưu" @keydown.tab="focusBack()"></DButton>
            </div>
        </div>
    </div>
    <d-dialog-1-button v-if="validateShow" @closeNotify="this.validateShow = false" :text="errorMessage"></d-dialog-1-button>
    <d-dialog-3-button v-if="validateProShow" @closeNotify="this.validateProShow = false" @closeNotSaveNotify="confirmNotifyMethod" @confirmNotify="confirmSaveNotify" :text="closeEditedMsg"></d-dialog-3-button>
    <d-dialog v-if="notifyShow" @closeNotify="this.notifyShow = false" @confirmNotify="confirmNotifyMethod" :text="closeMsg" textbtn="Hủy bỏ"></d-dialog>
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
import DTooltipWarning from '@/components/base/DTooltipWarning.vue';
import DDialog3Button from '@/components/base/DDialog3Button.vue';
    
export default {
    name:"AssetDetail",
    components: { DCombobox, DButton, DDialog, DDialog1Button, DTooltipWarning, DDialog3Button },
    props: {
        assetSelected: Function,
        formMode: {
            type: Number,
            default: Enum.FormMode.Add
        },
        title: String,
        assetCode: String,
    },
    watch: {
        asset: {
            deep: true,
            handler() {
                this.isEdited = true
            }
        }
    },
    created() {
        // Lấy tài sản là tài sản được truyền vào
        this.asset = this.assetSelected
        this.defaultValue()
    },
    mounted() {
        // Focus vào ô đầu của dialog
        this.focusFirst()
        this.isEdited = false
    },
    updated() {
        // Cập nhật hao mòn năm
        this.updateValue()
    },
    data() {
        return {
            asset: {}, // Lưu dữ liệu tài sản
            notifyShow: false, // Có hiển thị dialog cảnh báo hay không
            v$: useValidate(), // Validate dữ liệu (sử dụng vuelidate)
            errorArray: [], // Dãy chứa các lỗi validate
            errorMessage: "", // Thông điệp hiện trong dialog cảnh báo lỗi validate
            validateShow: false, // Có hiển thị dialog cảnh báo lỗi validate thiếu hay không
            validateProShow: false, // Có hiển thị dialog cảnh báo lỗi validate nghiệp vụ hay không
            isSubmited: false, // Đã submit form hay chưa (sau khi submit thì mới validate)
            focus: false, // Có đang focus vào hay không
            isEdited: false, // Form đã được chỉnh sửa chưa
            closeMsg: Resource.ErrorMsg.CloseMsg, // Văn bản khi đóng form
            closeEditedMsg: Resource.ErrorMsg.CloseEditedMsg, // Văn bản khi đóng form sau khi chỉnh sửa
        }
    },
    validations() {
        return {
            // asset: { required },
            asset: { 
                fixed_asset_code: { required },
                fixed_asset_name: { required },
                department_code: { required },
                fixed_asset_category_code: { required },
                quantity: { required },
                cost: { required },
                depreciation_rate: { required },
                purchase_date: { required },
                production_date: { required },
                life_time: { required }, 
                depreciation_year: { required },          
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
            if (this.asset.cost == null) this.asset.cost = 0
        },

        updateValue() {
            if(this.focus){
                this.asset.depreciation_year = this.asset.cost * this.asset.depreciation_rate / 100
            }
        },

        /**
         * Tạo thông điệp cho dialog cảnh báo lỗi validate
         * NDDAT (19/09/2022)
         */        
        createValidateMessage() {
            try{
                this.errorMessage = Resource.ErrorMsg.ValidateEmpty
                for(let i in this.errorArray) {
                    this.errorMessage = this.errorMessage + '\n' + ' - ' + this.errorArray[i]
                    // if(i != this.errorArray.length - 1) this.errorMessage = this.errorMessage +", "
                }
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * Xác nhận lưu khai báo
         * NDDAT (30/09/2022)
         */
        confirmSaveNotify() {
            this.validateProShow = false
            this.btnSaveOnClick()
        },

        /**
         * Xác nhận hủy bỏ khai báo
         * NDDAT (15/09/2022)
         */
        confirmNotifyMethod() {
            this.notifyShow = false
            this.validateProShow = false
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
            // Xét xem form đã được sửa chưa
            if(this.isEdited) this.validateProShow = true
            else this.notifyShow = true
        },

        /**
         * Click vào button để lưu tài sản
         * NDDAT (15/09/2022)
         */
        btnSaveOnClick() {
            this.isSubmited = true
            try{
                var method = Resource.Method.Post
                var url = Resource.Url.Main
                // Validate dữ liệu:
                this.v$.$validate()
                if (this.v$.$error) {
                    this.errorArray = []
                    if (this.v$.asset.fixed_asset_code.$error) this.errorArray.push(Resource.IsEmpty.code);
                    if (this.v$.asset.fixed_asset_name.$error) this.errorArray.push(Resource.IsEmpty.name);
                    if (this.v$.asset.department_code.$error) this.errorArray.push(Resource.IsEmpty.department);
                    if (this.v$.asset.fixed_asset_category_code.$error) this.errorArray.push(Resource.IsEmpty.category);
                    if (this.v$.asset.quantity.$error) this.errorArray.push(Resource.IsEmpty.quantity);
                    if (this.v$.asset.cost.$error) this.errorArray.push(Resource.IsEmpty.cost);
                    if (this.v$.asset.depreciation_rate.$error) this.errorArray.push(Resource.IsEmpty.depreciation_rate);
                    if (this.v$.asset.purchase_date.$error) this.errorArray.push(Resource.IsEmpty.purchase_date);
                    if (this.v$.asset.production_date.$error) this.errorArray.push(Resource.IsEmpty.production_date);
                    if (this.v$.asset.life_time.$error) this.errorArray.push(Resource.IsEmpty.life_time);
                    if (this.v$.asset.depreciation_year.$error) this.errorArray.push(Resource.IsEmpty.depreciation_year);
                    this.createValidateMessage()
                    this.validateShow = true
                } else if(this.asset.depreciation_year > this.asset.cost) {
                    this.errorMessage = "Hao mòn năm phải nhỏ hơn hoặc bằng nguyên giá"
                    this.validateShow = true
                } else if (this.asset.depreciation_rate != 1 / this.asset.life_time) {
                    this.errorMessage = "Tỉ lệ hao mòn phải bằng 1/Số năm sử dụng"
                    this.validateShow = true
                } else {
                    // Kiểm tra mã trùng nhau
                    try{
                        // Gọi api lấy dữ liệu
                        fetch(Resource.Url.Main + `/duplicateCode/${this.asset.fixed_asset_code}`, {method: Resource.Method.Get})
                        .then(res => res.json())
                        .then(data => {
                            let dup = Object.values(data)[0]
                            if (this.formMode == Enum.FormMode.Edit ? (this.asset.fixed_asset_code == this.assetCode ? dup>1 : dup>0) : dup>0) {
                                this.errorMessage = Resource.ErrorMsg.ValidateDuplicateCode
                                this.validateShow = true
                            }
                            else {
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
                                            console.log(Resource.ErrorCode[400]);
                                            break
                                        case 500:                               
                                            console.log(Resource.ErrorCode[500]);
                                            break
                                        default: 
                                            this.$emit("hideDialogSuccess")
                                    }
                                })
                                .catch(res => {
                                    console.log(res);
                                })
                            }
                        })
                        .catch(res => {
                            console.log(res);
                        })
                    } catch (error) {
                        console.log(error);
                    }
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