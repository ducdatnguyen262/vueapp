<template>
    <div class="dialog-container" v-on:keydown="keyboardEvent">
        <div class="dialog dialog--form">
            <div class="dialog__header background-white">
                <h2 class="dialog-title">Sửa tài sản {{assetSelected.fixed_asset_name}}</h2>
                <button class="dialog-x-container">
                    <div
                        tabindex="200" 
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
                            <el-select 
                                v-model="source.budget_id" 
                                filterable 
                                placeholder="Chọn nguồn hình thành" 
                                class="source-item-cbb"
                                :tabindex="`20${index*2}`"
                                :class="{'input--error':!source.budget_id && this.isSubmited, 'duplicate-source-input--error':duplicateValidate[index] == 1 && this.isSubmited,}"
                            >
                                <el-option
                                    v-for="item in budget_options"
                                    :key="item.budget_id"
                                    :label="item.budget_name"
                                    :value="item.budget_id"
                                />
                            </el-select>
                            <d-tooltip-warning text="Nguồn hình thành"></d-tooltip-warning>
                        </div>
                        <div class="dialog-item">
                            <input 
                                v-model="sourceCost[index]"
                                type="text"
                                class="dialog-input source-item-input"
                                style="text-align: right;"
                                onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                                :tabindex="`20${index*2+1}`"
                                :class="{'input--error':!source.cost && source.cost!=0 && this.isSubmited}"
                                @input="inputMoneySourceCost(index)"
                            >
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
                                locale: localeCode,
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
                    tabindex="310" 
                    text="Hủy" 
                    type="white" 
                    class="mr-10" 
                    @click="btnCloseOnClick"
                />
                <d-button 
                    tabindex="311" 
                    text="Lưu" 
                    @click="btnSaveOnClick" 
                />
            </div>
        </div>
    </div>

    <!-- Dialog validate dữ liệu -->
    <d-dialog-1-button v-on:keydown="keyboardEvent"
        v-if="validateShow" 
        :text="errorMessage"
        @closeNotify="closeValidate" 
    />

    <!-- Dialog cảnh báo lỗi từ backend -->
    <d-dialog-1-button v-on:keydown="keyboardEvent"
        v-if="backendError" 
        :text="backendErrorMsg"
        @closeNotify="closeBackendError"
    />

    <!-- Toast thông báo thất bại -->
    <transition name="toast">
        <d-toast v-show="toastFailedShow" type="failed"></d-toast>
    </transition>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
        <div class="loader"></div>
    </div>
</template>

<script>
import DButton from '@/components/base/DButton.vue';
import DDialog1Button from '../../components/base/DDialog1Button.vue';
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
import DInputMoney from '@/components/base/DInputMoney.vue';
import DTooltip from '@/components/base/DTooltip.vue';
import DTooltipWarning from '@/components/base/DTooltipWarning.vue';
    
export default {
    name:"AssetDetail",
    components: { DButton, DDialog1Button, DInputMoney, DTooltip, DTooltipWarning },
    props: {
        assetSelected: Function, // Tài sản được chọn
        assets: [], // Danh sách tài sản của cùng chứng từ
        formMode: {
            type: Number,
            default: Enum.FormMode.Add
        },
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
            errorArray: [], // Dãy chứa các lỗi validate
            errorMessage: "", // Thông điệp hiện trong dialog cảnh báo lỗi validate
            validateShow: false, // Có hiển thị dialog cảnh báo lỗi validate thiếu hay không
            isSubmited: false, // Đã submit form hay chưa (sau khi submit thì mới validate)
            focus: false, // Có đang focus vào hay không
            isLoading: false, // Có đang loading hay không
            backendError: false, // Có hiển thị dialog cảnh báo lỗi từ backend không
            backendErrorMsg: "", // Thông điệp trong cảnh báo lỗi backend
            toastFailedShow: false, // Hiển thị toast thông báo thất bại hay không
            sources: [{budget_id: "", budget_name: "", cost: 0}], // Mảng lưu nguồn ngân sách truyền vào
            budget_options: [], // Mảng lưu các tên nguồn ngân sách
            duplicateValidate: [], // Mảng có giá trị 1 tại vị trí trùng
            sourceCost:[], // Lưu số tiền của nguồn ngân sách dưới dạng string có đấu '.'
            localeCode: Resource.LanguageCode.VN, // Mã ngôn ngữ hiện tại
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
        // Truyền vào nguồn ngân sách
        for(let i in this.sources) {
            this.sourceCost[i] = this.formatMoney(this.sources[i].cost)
        }
    },

    methods: {
        /**
         * Kiểm tra trùng nguồn ngân sách
         * NDDAT (25/11/2022)
         */
        checkDuplicate() {
            this.duplicateValidate = []
            let check = true
            for(let i in this.sources) {
                for(let j in this.sources) {
                    if(this.sources[i].budget_id == this.sources[j].budget_id && i<j) {
                        this.duplicateValidate[j] = 1
                        check = false
                    }
                }
            }
            return check
        },

        /**
         * Xử lí nhập số tiền của ô giá nguồn ngân sách
         * NDDAT (09/11/2022)
         * @param {number} index số thứ tự dãy nguồn ngân sách 
         */
        inputMoneySourceCost(index) {
            if(this.localeCode == Resource.LanguageCode.VN) this.sourceCost[index] = this.sourceCost[index].replaceAll('.','')
            if(this.localeCode == Resource.LanguageCode.US) this.sourceCost[index] = this.sourceCost[index].replaceAll(',','')
            this.sources[index].cost = parseFloat(this.sourceCost[index])
            this.sourceCost[index] = this.formatMoney(this.sourceCost[index])
            if(this.sourceCost[index] == "0") this.sources[index].cost = 0
        },

        /**
         * Thêm một nguồn hình thành
         * NDDAT (09/11/2022)
         * @param {array} list mảng lưu các nguồn ngân sách
         */
        addField(list) {
            list.push({budget_id: "", budget_name: "", cost: null});
            this.inputMoneySourceCost(0)
        },

        /**
         * Xóa một nguồn hình thành
         * NDDAT (09/11/2022)
         * @param {number} index số thứ tự dãy nguồn ngân sách
         * @param {array} list mảng lưu các nguồn ngân sách
         */
        removeField(index, list) {
            list.splice(index, 1)
            this.sourceCost.splice(index, 1)
        },

        /**
         * Xử lí sự kiện keyboard shortcut
         * NDDAT (12/10/2022)
         * @param {Event} e sư kiện khi tương tác bàn phím
         */
        keyboardEvent(e) {
            if (e.which == Enum.KeyCode.ESC) {
                if (this.validateShow == true) {
                    this.closeValidate()
                }
            }
            else if(e.which == Enum.KeyCode.F8 && e.ctrlKey == true){
                this.btnSaveOnClick()
            }
            else if(e.which == Enum.KeyCode.F9 && e.ctrlKey == true){
                this.btnCloseOnClick()
            }
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
         * Xác nhận đóng cảnh báo validate thiếu dữ liệu
         * NDDAT (30/09/2022)
         */
        closeValidate() {
            this.validateShow = false
        },

        /**
         * Xác nhận đóng cảnh báo lỗi từ backend
         * NDDAT (12/10/2022)
         */
        closeBackendError() {
            this.backendError = false
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
            this.btnCloseOnClick()
        },

        /**
         * Hiện thị cảnh báo lỗi truyền từ BackEnd
         * NDDAT (12/10/2022)
         * @param {string} text Thông điệp của cảnh báo lỗi 
         */
        backEndErrorNotify(text) {
            this.backendErrorMsg = text
            this.backendError = true;
        },

        /**
         * Định dạng tiền tệ
         * NDDAT (18/09/2022)
         * @param {double} money số tiền
         */
        formatMoney(money) {
            money = new Intl.NumberFormat(this.localeCode, {}).format(money)
            return money
        },

        /**
         * Click vào button để đóng dialog tài sản
         * NDDAT (15/09/2022)
         */
        btnCloseOnClick() {
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
                this.saveData()
            }
        },

        /**
         * Validate dữ liệu truyền vào
         * NDDAT (08/10/2022)
         */
        validateData() {
            this.errorArray = []
            let sourceIdRequred = false // Có thiếu Nguồn ngân sách không
            let sourceCostRequired = false // Có thiếu giá trị không
            for(let i in this.sources) {
                if (!this.sources[i].budget_id && !sourceIdRequred){
                    sourceIdRequred = true
                    this.errorArray.push(Resource.IsEmpty.source_name);
                } 
                if (!this.sources[i].cost && this.sources[i].cost != 0 && !sourceCostRequired){
                    sourceCostRequired = true
                    this.errorArray.push(Resource.IsEmpty.source_cost);
                } 
            }
            if (sourceIdRequred || sourceCostRequired) {
                this.createValidateMessage()
                this.validateShow = true
                return false
            } else if(!this.checkDuplicate()) {
                this.errorMessage = Resource.ErrorMsg.ValidateDuplicateSource
                this.validateShow = true
                return false
            } else {
                return true
            } 
        },

        /**
         * Lưu tài sản
         * NDDAT (08/10/2022)
         */
        saveData() {
            // Cất dữ liệu:
            var method = Resource.Method.Put
            var url = Resource.Url.Asset + `/${this.asset.fixed_asset_id}`
            this.isLoading = true
            fetch(url, {method: method, headers:{ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}`}, body: JSON.stringify(this.asset)})
            .then(res =>{
                var status = res.status
                res.json()
                .then(data => {
                    switch(status) {
                        case 400: 
                            if(Object.values(data)[3][0]) this.backEndErrorNotify(Object.values(data)[3][0])
                            else this.backEndErrorNotify(Resource.ErrorCode[400])
                            this.isLoading = false
                            break
                        case 405: 
                            this.backEndErrorNotify(Resource.ErrorCode[405])
                            this.isLoading = false
                            break
                        case 500: 
                            this.backEndErrorNotify(Resource.ErrorCode[500])
                            this.isLoading = false
                            break
                        default: 
                            for(let asset of this.assets) {
                                if(asset.fixed_asset_id == this.asset.fixed_asset_id) {
                                    asset.cost = this.asset.cost
                                    asset.budget = this.asset.budget
                                }
                            }
                            this.$emit("updateAssets", this.assets)
                            this.btnCloseOnClick()
                            this.isLoading = false
                    }
                });
            })
            .catch(res => {
                console.error(res)
                this.isLoading = false
                this.toastFailedShow = true
                setTimeout(() => this.toastFailedShow = false, 3000)
            })
        },

        /**
         * Gọi API lấy dữ liệu combobox
         * NDDAT (21/11/2022)
         */
        loadDataCbb() {
            try {
                // Gọi api lấy dữ liệu
                this.isLoading = false
                fetch(Resource.Url.Budget, { method: "GET", headers:{'Authorization': `Bearer ${localStorage.getItem("token")}`}})
                .then(res => res.json())
                .then(data => {
                    this.budget_options = Object.values(data);
                    this.isLoading = false
                })
                .catch(res => {
                    console.error(res);
                    this.isLoading = false
                    this.toastFailedShow = true
                    setTimeout(() => this.toastFailedShow = false, 3000)
                });
            }
            catch (error) {
                console.error(error);
                this.isLoading = false
                this.toastFailedShow = true
                setTimeout(() => this.toastFailedShow = false, 3000)
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
    @import url('../../css/base/combobox.css');
</style>