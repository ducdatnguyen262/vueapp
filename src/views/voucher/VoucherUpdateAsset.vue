<template>
    <div class="dialog-container" v-on:keydown="keyboardEvent">
        <div class="dialog dialog--form">
            <div class="dialog__header background-white">
                <h2 class="dialog-title">Sửa tài sản {{assetSelected.fixed_asset_name}}</h2>
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
                    <input :value="assetSelected.department_name" class="dialog-input dialog-input-big" type="text" disabled>
                </div>

                <h4 style="margin:0 0 10px">Nguyên giá</h4>
                <p>Nguồn hình thành <span style="margin-left:210px">Giá trị</span></p>
                <div class="dialog-update-asset">
                    <div v-for="(source, index) in sources" :key="source.id" class="source-item">
                        <div class="dialog-item">
                            <!-- <d-combobox 
                                type="3" 
                                main="budget_name" 
                                class="source-item-cbb"
                                tooptipText="Nguồn hình thành"
                                :tabindex="`10${index}`" 
                                :isSubmited="this.isSubmited"
                                @comboboxSelected="comboboxBudget"
                                :vmodelValue="source.budget_name"
                                :budgetId="source.id"
                                @budgetSelected="comboboxBudget"
                            /> -->
                            <el-select v-model="source.budget_id" filterable placeholder="Chọn nguồn hình thành" class="source-item-cbb">
                                <el-option
                                    v-for="item in budget_options"
                                    :key="item.budget_id"
                                    :label="item.budget_name"
                                    :value="item.budget_id"
                                />
                            </el-select>
                        </div>
                        <div class="dialog-item">
                            <d-input-money
                                v-model="source.cost"
                                tabindex="105" 
                                class="source-item-input"
                                :class="{'input--error':!source.cost && source.cost!=0 && this.isSubmited}" 
                                :options="{
                                    locale: 'vi-VN',
                                    currency: 'EUR',
                                    currencyDisplay: 'hidden',
                                    valueRange: {min: 0},
                                    hideGroupingSeparatorOnFocus: false,
                                }"
                                @keyup="notNegative('quantity')"
                            />
                            <d-tooltip-warning text="Giá trị"></d-tooltip-warning>
                        </div>
                        <div class="position-relative mt-10 mb-20">
                            <div @click="addField(sources)" class="button-no-border icon-add-border"></div>
                            <d-tooltip text="Thêm"></d-tooltip>
                        </div>
                        <div v-show="sources.length > 1" class="position-relative mt-10 mb-20">
                            <div @click="removeField(index, sources)" class="button-no-border icon-minus-border"></div>
                            <d-tooltip text="Xóa"></d-tooltip>
                        </div>
                    </div>
                </div>
                <div class="source-item">
                    <div class="mb-20">
                        <input class="input source-item-cbb mr-10" placeholder="Tổng" disabled>
                    </div>
                    <div class="mb-20">
                        <d-input-money
                                v-model="sum"
                                class="source-item-input"
                                disabled
                                :options="{
                                    locale: 'vi-VN',
                                    currency: 'EUR',
                                    currencyDisplay: 'hidden',
                                    hideGroupingSeparatorOnFocus: false,
                                }"
                            />
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
import DTooltipWarning from '@/components/base/DTooltipWarning.vue';
    
export default {
    name:"AssetDetail",
    components: { DButton, DDialog, DDialog1Button, DDialog3Button, DInputMoney, DTooltip, DTooltipWarning },
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
                budget:"",
                increment_status:"",
                created_by:"",
                created_date:"",
                modified_by:"",
                modified_date:"",
            },
            notifyShow: false, // Có hiển thị dialog cảnh báo hay không
            v$: useValidate(), // Validate dữ liệu (sử dụng vuelidate)
            errorArray: [], // Dãy chứa các lỗi validate
            errorMessage: "", // Thông điệp hiện trong dialog cảnh báo lỗi validate
            validateShow: false, // Có hiển thị dialog cảnh báo lỗi validate thiếu hay không
            validateProShow: false, // Có hiển thị dialog cảnh báo lỗi validate nghiệp vụ hay không
            temp: "", // Lưu giá trị tạm
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
            sources: [{budget_id: "", budget_name: "", cost: 0}],
            costs: [{ cost: ""}],
            sumCost:0,
            textCost:"",
            budget_options: [],
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

    computed: {
        sum: function() {
            return this.sources.reduce((acc, item) => acc + item.cost, 0)
        }
    },

    created() {
        // Cập nhật giá trị mảng asset thành giá trị tài sản truyền vào
        this.updateAsset()   
        // Truyền vào các giá trị mặc định
        this.defaultValue()
        // Lấy dữ liệu combobox
        this.loadDataCbb()

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
    },

    beforeUnmount() {
        window.removeEventListener('keypress', this.handler);
    },

    validations() {
        return {
            // Các trường cần validate thiếu
            // asset: { 
            //     fixed_asset_code: { required },
            //     fixed_asset_name: { required },
            //     department_code: { required },
            //     fixed_asset_category_code: { required },
            //     quantity: { required },
            //     cost: { required },
            //     depreciation_rate: { required },
            //     purchase_date: { required },
            //     production_date: { required },
            //     life_time: { required }, 
            //     depreciation_year: { required },          
            // },
            sources: {
                source : {
                    budget_name: { required },
                    cost: { required }
                }
            }
        }
    },

    methods: {
        /**
         * Thêm một nguồn hình thành
         * NDDAT (09/11/2022)
         */
        addField(list) {
            list.push({budget_id: "", budget_name: "", cost: 0});
        },

        /**
         * Xóa một nguồn hình thành
         * NDDAT (09/11/2022)
         */
        removeField(index, list) {
            list.splice(index, 1)
        },

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
         * Cập nhật combobox nguồn ngân sách
         */
        comboboxBudget(main, id) {
            this.sources[id-1].budget_name = main
        },
        // comboboxBudget(id, code, name) {
        //     this.sources[id-1].budget_name = main
        // },

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
            this.sources = JSON.parse(this.assetSelected.budget)
            if (this.asset.purchase_date == null) this.asset.purchase_date = new Date()
            if (this.asset.production_date == null) this.asset.production_date = new Date()
            if (this.asset.tracked_year == null) this.asset.tracked_year = new Date().getFullYear()
            if (this.asset.cost == null) this.asset.cost = 0
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
            // if(this.isEdited) this.validateProShow = true
            // else this.notifyShow = true
            this.$emit("hideDialog")
        },

        /**
         * Click vào button để lưu tài sản
         * NDDAT (15/09/2022)
         */
        btnSaveOnClick() {
            this.isSubmited = true
            if(this.validateData()) {
                this.asset.cost = this.sum
                for(let source of this.sources) {
                    for(let option in this.budget_options) {
                        if(source.budget_id == option.budget_id) source.budget_name = option.budget_name
                    }
                }
                this.asset.budget = JSON.stringify(this.sources)
                // this.$emit('updateAsset', this.sumCost, this.textCost)
                this.saveData()
            }
        },

        /**
         * Validate dữ liệu truyền vào
         * NDDAT (08/10/2022)
         */
        validateData() {
            // this.v$.$validate()
            // if (this.v$.$error) {
            //     this.errorArray = []
            //     let sourceNamevalidated = false
            //     let sourceCostvalidated = false
            //     for(let i in this.sources) {
            //         if (!this.sources[i].budget_name && !sourceNamevalidated){
            //             sourceNamevalidated = true
            //             this.errorArray.push(Resource.IsEmpty.source_name);
            //         } 
            //         if (!this.sources[i].cost && this.sources[i].cost != 0 && !sourceCostvalidated){
            //             sourceCostvalidated = true
            //             this.errorArray.push(Resource.IsEmpty.source_cost);
            //         } 
            //     }
            //     if(!sourceNamevalidated && !sourceCostvalidated) return true
            //     this.createValidateMessage()
            //     this.validateShow = true
            //     return false
            // } else {
                return true
            // } 
        },

        /**
         * Lưu tài sản
         * NDDAT (08/10/2022)
         */
        saveData() {
            // Cất dữ liệu:
            var method = Resource.Method.Put
            var url = Resource.Url.Asset + `/${this.asset.fixed_asset_id}`
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
                            this.$emit("loadDetailData")
                            this.btnCloseOnClick()
                    }
                });
            })
            .catch(res => {
                console.error(res)
            })
        },

        /**
         * Gọi API lấy dữ liệu combobox
         * NDDAT (21/11/2022)
         */
        loadDataCbb() {
            try {
                // Gọi api lấy dữ liệu
                fetch(Resource.Url.Budget, { method: "GET" })
                    .then(res => res.json())
                    .then(data => {
                    this.budget_options = Object.values(data);
                })
                    .catch(res => {
                    console.error(res);
                });
            }
            catch (error) {
                console.error(error);
            }        
        },

        /**
         * Cập nhật giá trị mảng asset thành giá trị tài sản truyền vào
         * NDDAT (06/10/2022)
         */
        updateAsset() {
            this.asset.fixed_asset_id = this.assetSelected.fixed_asset_id
            this.asset.fixed_asset_code = this.assetSelected.fixed_asset_code
            this.asset.fixed_asset_name = this.assetSelected.fixed_asset_name
            this.asset.organization_id = this.assetSelected.organization_id
            this.asset.organization_code = this.assetSelected.organization_code
            this.asset.organization_name = this.assetSelected.organization_name
            this.asset.department_id = this.assetSelected.department_id
            this.asset.department_code = this.assetSelected.department_code
            this.asset.department_name = this.assetSelected.department_name
            this.asset.fixed_asset_category_id = this.assetSelected.fixed_asset_category_id
            this.asset.fixed_asset_category_code = this.assetSelected.fixed_asset_category_code
            this.asset.fixed_asset_category_name = this.assetSelected.fixed_asset_category_name
            this.asset.quantity = this.assetSelected.quantity
            this.asset.cost = this.assetSelected.cost
            this.asset.depreciation_rate = this.assetSelected.depreciation_rate
            this.asset.purchase_date = this.assetSelected.purchase_date
            this.asset.production_year = this.assetSelected.production_year
            this.asset.production_date = this.assetSelected.production_date
            this.asset.tracked_year = this.assetSelected.tracked_year
            this.asset.life_time = this.assetSelected.life_time
            this.asset.active = this.assetSelected.active
            this.asset.depreciation_year = this.assetSelected.depreciation_year
            this.asset.budget = this.assetSelected.budget
            this.asset.increment_status = this.assetSelected.increment_status
            this.asset.created_by = this.assetSelected.created_by
            this.asset.created_date = this.assetSelected.created_date
            this.asset.modified_by = this.assetSelected.modified_by
            this.asset.modified_date = this.assetSelected.modified_date    
        }
    }
}
</script>

<style scoped>
    @import url('../../css/base/input.css');
    @import url('../../css/base/datepicker.css');
</style>