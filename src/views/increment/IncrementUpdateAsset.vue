<template>
    <div class="dialog-container" v-on:keydown="keyboardEvent">
        <div class="dialog dialog--form">
            <div class="dialog__header background-white">
                <!-- <h2 class="dialog-title">{{title}}</h2> -->
                <h2 class="dialog-title">Sửa tài sản ...</h2>
                <button class="dialog-x-container">
                    <div 
                        ref="btnx"
                        tabindex="100" 
                        class="dialog-x"
                        @keydown.enter="btnCloseOnClick()" 
                        @click="btnCloseOnClick()" 
                    >
                    </div>
                </button>
            </div>

            <div class="dialog__content dialog-update-asset">
                <div class="dialog-item">
                    <label>Bộ phận sử dụng</label>
                    <input v-model="asset.department_name" class="dialog-input dialog-input-big" type="text" disabled>
                </div>

                <h4 style="margin:0 0 10px">Nguyên giá</h4>
                <p>Nguồn hình thành <span style="margin-left:202px">Giá trị</span></p>
                <div class="dialog-update-asset">
                    <div class="origin-item">
                        <div class="mb-20">
                            <d-combobox 
                                type="3" 
                                main="budget_name" 
                                class="origin-item-cbb mr-11"
                                :tabindex="'103'" 
                                @searchAll="searchAllCategory" 
                                @comboboxSearch="categorySearch" 
                            />
                        </div>
                        <div class="mb-20">
                            <d-input-money 
                                tabindex="105" 
                                class="origin-item-input mr-10"
                                :class="{'input--error':!asset.quantity && asset.quantity!='0' && this.isSubmited}" 
                                :options="{
                                    locale: 'vi-VN',
                                    currency: 'EUR',
                                    currencyDisplay: 'hidden',
                                    valueRange: {min: 0},
                                    hideGroupingSeparatorOnFocus: false,
                                }"
                                @keyup="notNegative('quantity')"
                            />
                        </div>
                        <div class="position-relative mt-10 mb-20">
                            <div class="button-no-border icon-add-border"></div>
                            <d-tooltip text="Thêm"></d-tooltip>
                        </div>
                        <div v-if="firstMinus" class="position-relative mt-10 mb-20">
                            <div class="button-no-border icon-minus-border"></div>
                            <d-tooltip text="Xóa"></d-tooltip>
                        </div>
                    </div>
                </div>
                <div class="origin-item">
                    <div class="mb-20">
                        <input class="input origin-item-cbb mr-10" placeholder="Tổng" disabled>
                    </div>
                    <div class="mb-20">
                        <input type="number" class="input origin-item-input mr-10" placeholder="100.000" disabled>
                    </div>
                </div>
            </div>

            <div class="dialog__footer">
                <d-button 
                    tabindex="114" 
                    text="Hủy" 
                    type="white" 
                    class="mr-10" 
                    :id="'close-asset-detail'"
                    @click="btnCloseOnClick" 
                    @keydown.shift="focusWithShift" 
                    @keydown.tab="focusBack"
                />
                <d-button 
                    tabindex="113" 
                    text="Lưu" 
                    @click="btnSaveOnClick" 
                />
            </div>
        </div>
    </div>
    <d-dialog v-on:keydown="keyboardEvent"
        v-if="notifyShow" 
        textbtn="Hủy bỏ"
        :text="closeMsg" 
        @closeNotify="closeNotify" 
        @confirmNotify="confirmNotifyMethod" 
    />
    <d-dialog-1-button v-on:keydown="keyboardEvent"
        v-if="validateShow" 
        :text="errorMessage"
        @closeNotify="closeValidate" 
    />
    <d-dialog-3-button v-on:keydown="keyboardEvent"
        v-if="validateProShow" 
        :text="closeEditedMsg"
        @closeNotify="closeProValidate" 
        @closeNotSaveNotify="confirmNotifyMethod"
        @confirmNotify="confirmSaveNotify" 
    />
    <d-dialog-1-button v-on:keydown="keyboardEvent"
        v-if="backendError" 
        :text="backendErrorMsg"
        @closeNotify="closeBackendError"
    />
</template>

<script>
import DButton from '@/components/base/DButton.vue';
import useValidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import DDialog from '@/components/base/DDialog.vue';
import DDialog1Button from '../../components/base/DDialog1Button.vue';
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
import DDialog3Button from '@/components/base/DDialog3Button.vue';
import DInputMoney from '@/components/base/DInputMoney.vue';
import DTooltip from '@/components/base/DTooltip.vue';
import DCombobox from '@/components/base/DCombobox.vue';
    
export default {
    name:"AssetDetail",
    components: { DButton, DDialog, DDialog1Button, DDialog3Button, DInputMoney, DTooltip, DCombobox },
    props: {
        assetSelected: Function, // Tài sản được chọn
        formMode: {
            type: Number,
            default: Enum.FormMode.Add
        },
        title: String,
        assetCode: String,
    },
    
    data() {
        return {
            asset: { // Lưu dữ liệu 1 tài sản
                fixed_asset_id:"",
                fixed_asset_code:"",
                fixed_asset_name:"",
                organization_id:"",
                organization_code:"",
                organization_name:"",
                department_id:"",
                department_code:"",
                department_name:"",
                fixed_asset_category_id:"",
                fixed_asset_category_code:"",
                fixed_asset_category_name:"",
                quantity:"",
                cost:"",
                depreciation_rate:"",
                purchase_date:"",
                production_year:"",
                production_date:"",
                tracked_year:"",
                life_time:"",
                active:"",
                depreciation_year:"",
                created_by:"",
                created_date:"",
                modified_by:"",
                modified_date:"",
            },
            assetMid: {}, // Lưu dữ liệu tài sản được truyền vào
            notifyShow: false, // Có hiển thị dialog cảnh báo hay không
            v$: useValidate(), // Validate dữ liệu (sử dụng vuelidate)
            errorArray: [], // Dãy chứa các lỗi validate
            errorMessage: "", // Thông điệp hiện trong dialog cảnh báo lỗi validate
            validateShow: false, // Có hiển thị dialog cảnh báo lỗi validate thiếu hay không
            validateProShow: false, // Có hiển thị dialog cảnh báo lỗi validate nghiệp vụ hay không
            isSubmited: false, // Đã submit form hay chưa (sau khi submit thì mới validate)
            focus: false, // Có đang focus vào hay không
            isEdited: false, // Form đã được chỉnh sửa chưa
            firstTimeEdited: true, // Form đã được chỉnh sửa sau khi truyền hết dữ liệu chưa
            closeMsg: Resource.ErrorMsg.CloseMsg, // Văn bản khi đóng form
            closeEditedMsg: Resource.ErrorMsg.CloseEditedMsg, // Văn bản khi đóng form sau khi chỉnh sửa
            shiftPressed: false, // Nút Shift có đang được bấm hay không
            ctrlPressed: false, // Nút Ctrl có đang được bấm hay không
            backendError: false, // Có hiển thị dialog cảnh báo lỗi từ backend không
            backendErrorMsg: "", // Thông điệp trong cảnh báo lỗi backend
            firstMinus: true,
        }
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
        // Cập nhật giá trị mảng asset thành giá trị tài sản truyền vào
        // this.updateAsset()   
        // Truyền vào các giá trị mặc định
        this.defaultValue()
        // Sinh mã tiếp theo nếu là thêm và nhân bản
        if ((this.formMode == Enum.FormMode.Add) || (this.formMode == Enum.FormMode.Duplicate)) {
            this.generateNextCode()
        }

        // Cài đặt keyboard shortcut
        const component = this;
        this.handler = function (e) {
            component.$emit('keydown', e);
        }
        window.addEventListener('keydown', this.handler)
    },

    mounted() {
        // Focus vào ô đầu của dialog
        this.focusFirst()
        // Đặt lại form là chưa sửa
        this.isEdited = false
    },

    updated() {
        // Xử lí để dữ liệu truyền vào form không được tính là đã sửa (isEdited)
        if(this.isEdited && this.firstTimeEdited && this.formMode != Enum.FormMode.Edit){
            this.isEdited = false
            this.firstTimeEdited = false
        }
        // Cập nhật hao mòn năm
        this.updateValue()
    },

    beforeUnmount() {
        window.removeEventListener('keypress', this.handler);
    },

    validations() {
        return {
            // Các trường cần validate thiếu
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
         * Xử lí sự kiện keyboard shortcut
         * NDDAT (12/10/2022)
         */
        keyboardEvent (e) {
            if (e.which == Enum.KeyCode.ESC) {
                if(this.notifyShow == true){
                    this.closeNotify()
                }
                else if (this.validateShow == true) {
                    this.closeValidate()
                }
                else if (this.validateProShow == true) {
                    this.closeProValidate()
                }
            }
            else if(e.which == Enum.KeyCode.Ctrl){
                this.ctrlPressed = true
            }
            else if(e.which == Enum.KeyCode.F8 && this.ctrlPressed == true){
                this.btnSaveOnClick()
                this.ctrlPressed = false
            }
            else if(e.which == Enum.KeyCode.F9 && this.ctrlPressed == true){
                this.btnCloseOnClick()
                this.ctrlPressed = false
            }
        },

        /**
         * Gọi API lấy mã tài sản tiếp theo rồi gán vào mã hiện tại
         * NDDAT (29/09/2022)
         */
        generateNextCode() {
            try{
                // Gọi api lấy dữ liệu
                this.isLoading = true
                fetch(Resource.Url.Asset + `/nextCode`, {method: Resource.Method.Get})
                .then(res => res.json())
                .then(data => {
                    this.asset.fixed_asset_code = Object.values(data)[0]
                    this.isLoading = false
                })
                .catch(res => {
                    console.error(res);
                    this.isLoading = false
                })
            } catch (error) {
                console.error(error);
            }
        },

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
         * Cập nhật dữ liệu liên quan tới mã loại tài sản
         * NDDAT (28/09/2022)
         * @param {float} depreciation_rate 
         * @param {int} life_time 
         */
        updateWithCategoryCode(depreciation_rate, life_time) {
            this.asset.depreciation_rate = depreciation_rate ? depreciation_rate*100 : null
            this.asset.life_time = life_time
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

        /**
         * Cập nhật các giá trị trong form theo các điều kiện
         * NDDAT (28/09/2022)
         */
        updateValue() {
            if(this.focus){
                this.asset.depreciation_year = this.asset.cost * this.asset.depreciation_rate / 100
            }
            if(this.asset.depreciation_rate > 100) this.asset.depreciation_rate = 100
        },

        /**
         * Cập nhật lại các giá trị nếu nó âm 
         * NDDAT (04/10/2022)
         * @param {string} type loại dữ liệu
         */
        notNegative(type) {
            if(this.asset[type] < 0) this.asset[type] = 0
        },

        /**
         * Tạo thông điệp cho dialog cảnh báo lỗi validate
         * NDDAT (19/09/2022)
         */        
        createValidateMessage() {
            this.errorMessage = Resource.ErrorMsg.ValidateEmpty
            for(let i in this.errorArray) {
                this.errorMessage = this.errorMessage + '\n' + ' - ' + this.errorArray[i]
            }
        },

        /**
         * Xác nhận đóng cảnh báo
         * NDDAT (30/09/2022)
         */
        closeNotify() {
            this.notifyShow = false
            this.focusFirst()
        },

        /**
         * Xác nhận đóng cảnh báo validate thiếu dữ liệu
         * NDDAT (30/09/2022)
         */
        closeValidate() {
            this.validateShow = false
            this.focusFirst()
        },

        /**
         * Xác nhận đóng cảnh báo validate nghiệp vụ
         * NDDAT (30/09/2022)
         */
        closeProValidate() {
            this.validateProShow = false
            this.focusFirst()
        },

        /**
         * Xác nhận đóng cảnh báo lỗi từ backend
         * NDDAT (12/10/2022)
         */
        closeBackendError() {
            this.backendError = false
            this.focusFirst()
        },

        /**
         * Xác nhận lưu khai báo
         * NDDAT (30/09/2022)
         */
        confirmSaveNotify() {
            this.closeProValidate()
            this.btnSaveOnClick()
        },

        /**
         * Xác nhận hủy bỏ khai báo
         * NDDAT (15/09/2022)
         */
        confirmNotifyMethod() {
            this.closeNotify()
            this.closeProValidate()
            this.$emit("hideDialog")
        },

        /**
         * Hiện thị cảnh báo lỗi truyền từ BackEnd
         * NDDAT (12/10/2022)
         */
        backEndErrorNotify(text) {
            this.backendErrorMsg = text
            this.backendError = true;
        },

        /**
         * Focus vào phần tử đầu tiên
         * NDDAT (15/09/2022)
         */
        focusFirst() {
            // this.$refs.asset_code.focus()
        },

        /**
         * Chuyển focus lên đầu sau khi đến cuối dialog tài sản
         * NDDAT (15/09/2022)
         */
        focusBack() {
            if(!this.shiftPressed) {
                this.$refs.btnx.focus()
            }
            this.shiftPressed = false
        },

        /**
         * Focus ngược khi dùng Shift+Tab
         * NDDAT (15/09/2022)
         */
        focusWithShift(e) {
            if(e.tab) {
                document.getElementById('close-asset-detail').focus()
            } else {
                this.shiftPressed = true
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
                if(this.validateData()) {
                    this.saveData()
                }         
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Validate dữ liệu truyền vào
         * NDDAT (08/10/2022)
         */
        validateData() {
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
                return false;
            } else if(this.asset.depreciation_year > this.asset.cost) {
                this.errorMessage = "Hao mòn năm phải nhỏ hơn hoặc bằng nguyên giá"
                this.validateShow = true
                return false;
            } else if (this.asset.depreciation_rate != parseFloat(100 / this.asset.life_time).toFixed(2)) {
                this.errorMessage = "Tỉ lệ hao mòn phải bằng 1/Số năm sử dụng"
                this.validateShow = true
                return false;
            } else {
                return true;
            } 
        },

        /**
         * Lưu tài sản
         * NDDAT (08/10/2022)
         */
        saveData() {
            // Cất dữ liệu:
            var method = Resource.Method.Post
            var url = Resource.Url.Asset
            if(this.formMode == Enum.FormMode.Edit) {
                method = Resource.Method.Put
                url = url + `/${this.asset.fixed_asset_id}`
            }
            fetch(url, {method: method, headers:{ 'Content-Type': 'application/json'}, body: JSON.stringify(this.asset)})
            .then(res =>{
                var status = res.status
                res.json()
                .then(data => {
                    switch(status) {
                        case 400: 
                            if(Object.values(data)[3][0]) this.backEndErrorNotify(Object.values(data)[3][0])
                            else this.backEndErrorNotify(Resource.ErrorCode[400])
                            break
                        case 405: 
                            this.backEndErrorNotify(Resource.ErrorCode[405])
                            break
                        case 500: 
                            this.backEndErrorNotify(Resource.ErrorCode[500])
                            break
                        default: 
                            this.$emit("hideDialogSuccess")
                    }
                });
            })
            .catch(res => {
                console.error(res)
            })
        },

        /**
         * Cập nhật giá trị mảng asset thành giá trị tài sản truyền vào
         * NDDAT (06/10/2022)
         */
        // updateAsset() {
        //     this.asset.fixed_asset_id = this.assetSelected.fixed_asset_id
        //     this.asset.fixed_asset_code = this.assetSelected.fixed_asset_code
        //     this.asset.fixed_asset_name = this.assetSelected.fixed_asset_name
        //     this.asset.organization_id = this.assetSelected.organization_id
        //     this.asset.organization_code = this.assetSelected.organization_code
        //     this.asset.organization_name = this.assetSelected.organization_name
        //     this.asset.department_id = this.assetSelected.department_id
        //     this.asset.department_code = this.assetSelected.department_code
        //     this.asset.department_name = this.assetSelected.department_name
        //     this.asset.fixed_asset_category_id = this.assetSelected.fixed_asset_category_id
        //     this.asset.fixed_asset_category_code = this.assetSelected.fixed_asset_category_code
        //     this.asset.fixed_asset_category_name = this.assetSelected.fixed_asset_category_name
        //     this.asset.quantity = this.assetSelected.quantity
        //     this.asset.cost = this.assetSelected.cost
        //     this.asset.depreciation_rate = this.assetSelected.depreciation_rate
        //     this.asset.purchase_date = this.assetSelected.purchase_date
        //     this.asset.production_year = this.assetSelected.production_year
        //     this.asset.production_date = this.assetSelected.production_date
        //     this.asset.tracked_year = this.assetSelected.tracked_year
        //     this.asset.life_time = this.assetSelected.life_time
        //     this.asset.active = this.assetSelected.active
        //     this.asset.depreciation_year = this.assetSelected.depreciation_year
        //     this.asset.created_by = this.assetSelected.created_by
        //     this.asset.created_date = this.assetSelected.created_date
        //     this.asset.modified_by = this.assetSelected.modified_by
        //     this.asset.modified_date = this.assetSelected.modified_date    
        // }
    }
}
</script>

<style scoped>
    @import url('../../css/base/input.css');
    @import url('../../css/base/datepicker.css');
</style>