<template>
    <div class="dialog-container" v-on:keydown="keyboardEvent" v-show="thisShow">
        <div class="dialog dialog-voucher">
            <div class="dialog__header background-white">
                <!-- <h2 class="dialog-title">{{title}}</h2> -->
                <h2 class="dialog-title">Thêm chứng từ ghi tăng</h2>
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
            
            <h3 class="dialog-title--small">Thông tin chứng từ</h3>
            <div class="dialog__content dialog-voucher-info">
                <div class="dialog-item">
                    <label>Mã chứng từ <span style="color: red;">*</span></label>
                    <input 
                        v-model="voucher.voucher_code" 
                        tabindex="101" 
                        maxlength="20"
                        ref="asset_code" 
                        class="dialog-input" 
                        type="text"
                        :class="{'input--error':!voucher.voucher_code && this.isSubmited}" 
                    >
                    <d-tooltip-warning text="Mã tài sản"></d-tooltip-warning>
                </div>
                <div class="dialog-item date-picker">
                    <label>Ngày bắt đầu sử dụng <span style="color: red;">*</span></label>
                    <el-date-picker 
                        v-model="voucher.voucher_date" 
                        tabindex="108" 
                        format="DD/MM/YYYY" 
                        value-format="YYYY-MM-DDTHH:mm:ss"
                        type="date" 
                        placeholder="Chọn ngày"
                        :class="{'datepicker--error':!voucher.voucher_date && this.isSubmited}" 
                    />
                    <d-tooltip-warning text="Ngày mua"></d-tooltip-warning>
                </div>
                <div class="dialog-item date-picker">
                    <label>Ngày ghi tăng <span style="color: red;">*</span></label>
                    <el-date-picker 
                        v-model="voucher.increment_date" 
                        tabindex="108" 
                        format="DD/MM/YYYY" 
                        value-format="YYYY-MM-DDTHH:mm:ss"
                        type="date" 
                        placeholder="Chọn ngày"
                        :class="{'datepicker--error':!voucher.increment_date && this.isSubmited}" 
                    />
                    <d-tooltip-warning text="Ngày mua"></d-tooltip-warning>
                </div>
                <div class="dialog-item">
                    <label>Nội dung</label>
                    <input 
                        v-model="voucher.description" 
                        tabindex="102" 
                        maxlength="255"
                        class="dialog-input dialog-input-bigger"
                        type="text"
                    >
                </div>
            </div>

            <h3 class="dialog-title--small">Thông tin chi tiết</h3>
            <div class="content-menu content-menu--white">
                <div class="content-search">
                    <div class="search">
                        <div class="search__icon"></div>
                        <input 
                            v-model="search" 
                            tabindex="1" 
                            id="searchInput"
                            class="search__input search__input--long mr-11" 
                            type="text" 
                            placeholder="Tìm kiếm theo mã, tên tài sản"
                            @keypress.enter="searchMethod(search)"
                        >
                    </div>
                </div>
                <div class="content-btns">
                    <d-button 
                        tabindex="114" 
                        text="Chọn tài sản" 
                        type="outline"
                        @click="selectAssetsShow=true;thisShow=false" 
                    />
                </div>
            </div>
            <div class="table-container table-2 mb-20">
                <table class="table">
                    <thead class="thead">
                        <tr>
                            <th>
                                <div class="position-relative">
                                    STT
                                    <d-tooltip text="Số thứ tự"></d-tooltip>
                                </div>
                            </th>
                            <th>Mã tài sản</th>
                            <th>Tên tài sản</th>
                            <th>Bộ phận sử dụng</th>
                            <th>Nguyên giá</th>
                            <th>Hao mòn năm</th>
                            <th>Giá trị còn lại</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                        <tr v-for="(asset, index) in assets" :key="asset.fixed_asset_id" 
                            tabindex="7" 
                            :id="'table'+index" 
                            :class="{'row--selected':(rowSelected == index), 'checkbox--selected':rowFocus2 == index}" 
                            v-contextmenu:contextmenu
                            @click.right="assetSelected = asset"
                            @keydown.f2="rowEdit(asset)" 
                            @keydown.insert="rowDuplicate(asset)" 
                            @keydown.delete="deleteOnKey(asset.fixed_asset_id)" 
                            @keydown.up="prevItem" @keydown.down="nextItem" 
                            @focus="rowFocus2=index" @click="rowSelected = index"
                            @dblclick="rowEdit(asset)" 
                            @mouseenter="rowHover = index" 
                            @mouseleave="rowHover = -1"
                        >
                            <td>{{index + 1}}</td>
                            <td>{{asset.fixed_asset_code}}</td>
                            <td :title="asset.fixed_asset_name">{{asset.fixed_asset_name}}</td>
                            <td :title="asset.department_name">{{asset.department_name}}</td>
                            <td>{{formatMoney(asset.cost)}}</td>
                            <td>{{formatMoney(asset.depreciation_year)}}</td>
                            <td>
                                <div v-show="rowHover != index">
                                    {{formatMoney(asset.cost-asset.depreciation_year*asset.life_time<0 ? 0 : asset.cost-asset.depreciation_year*asset.life_time)}}
                                </div>
                                <div v-show="rowHover == index" class="table-function" style="justify-content: flex-end;">
                                    <div class="position-relative mr-10">
                                        <div @click="rowEdit(asset)" class="button--icon-edit"></div>
                                        <d-tooltip text="Sửa"></d-tooltip>
                                    </div>
                                    <div class="position-relative">
                                        <div @click="deleteOnKey(asset.fixed_asset_id)" class="button--icon-delete"></div>
                                        <d-tooltip text="Xóa" class="tool-tip--left"></d-tooltip>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr style="height:auto;"></tr>
                    </tbody>
                    <el-empty v-if="totalCount==0" 
                        description="Không có dữ liệu"
                        style="position: absolute; top: calc(50% - 146px); left: calc(50% - 80px);" 
                    />
                    <tfoot class="tfoot">
                        <tr>
                            <td colspan="7">
                                <div class="tfooter-left">
                                    <div class="tfooter-text">Tổng số: <b>{{totalCount}}</b> bản ghi</div>
                                    <div class="tfooter-total">
                                        <select @change="page=1;loadData()" v-model="tableView">
                                            <option value="20" selected>20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="200">200</option>
                                        </select>
                                    </div>
                                    <div @click="prevPage()" class="tfooter-prev position-relative">
                                        <d-tooltip text="Trang trước" class="tool-tip--top"></d-tooltip>
                                    </div>
                                    <div 
                                        class="tfooter-page"
                                        :class="{'tfooter-page--selected':page == 1}" 
                                        @click="toPage(1)" 
                                    >
                                        1
                                    </div>
                                    <div 
                                        v-show="page>=3 && totalPage>5 && totalPage!=1" 
                                        class="tfooter-page"
                                    >
                                        ...
                                    </div>
                                    <div 
                                        v-show="(page<3 || totalPage==5 || totalPage==3) && totalPage>=3 " 
                                        class="tfooter-page"
                                        :class="{'tfooter-page--selected':page == 2}" 
                                        @click="toPage(2)" 
                                    >
                                        2
                                    </div>
                                    <div 
                                        v-show="page<3 && totalPage!=1 && totalPage>3" 
                                        class="tfooter-page"
                                        :class="{'tfooter-page--selected':page == 3}" 
                                        @click="toPage(3)" 
                                    >
                                        3
                                    </div>
                                    <div 
                                        v-show="page>=3 && page<totalPage-1 && totalPage!=1" 
                                        class="tfooter-page tfooter-page--selected"
                                    >
                                        {{page}}
                                    </div>
                                    <div 
                                        v-show="page<totalPage-1 && totalPage>5 && totalPage!=1" 
                                        class="tfooter-page"
                                    >
                                        ...
                                    </div>
                                    <div 
                                        v-show="page>=totalPage-1 && totalPage!=1 && totalPage>3" 
                                        class="tfooter-page"
                                        :class="{'tfooter-page--selected':page == totalPage-2}" 
                                        @click="toPage(totalPage-2)" 
                                    >
                                        {{totalPage-2}}
                                    </div>
                                    <div 
                                        v-show="(page>=totalPage-1 || totalPage==5) && totalPage!=1 && totalPage>3" 
                                        class="tfooter-page"
                                        :class="{'tfooter-page--selected':page == totalPage-1}" 
                                        @click="toPage(totalPage-1)" 
                                    >
                                        {{totalPage-1}}
                                    </div>
                                    <div 
                                        v-show="totalPage>1" :class="{'tfooter-page--selected':page == totalPage}" 
                                        class="tfooter-page"
                                        @click="toPage(totalPage)" 
                                    >
                                        {{totalPage}}
                                    </div>
                                    <div @click="nextPage()" class="tfooter-next position-relative">
                                        <d-tooltip text="Trang sau" class="tool-tip--top"></d-tooltip>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
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

    <voucher-select-assets
        v-if="selectAssetsShow"
        @hideDialog="selectAssetsShow=false;thisShow=true"
        @selectAssets="selectAssets"
        :assetsNoDisplay="assets"
    />

    <voucher-update-asset
        v-if="updateAssetShow"
        @hideDialog="updateAssetShow=false;thisShow=true"
        :assetSelected="assetSelected"
    />

    <!-- Context Menu -->
    <v-contextmenu ref="contextmenu">
        <v-contextmenu-item @click="selectAssetsShow=true;thisShow=false">Thêm</v-contextmenu-item>
        <v-contextmenu-item @click="rowEdit(voucherSelected)">Sửa</v-contextmenu-item>
        <v-contextmenu-item @click="deleteOnKey(voucherSelected.fixed_asset_id)">Xóa</v-contextmenu-item>
    </v-contextmenu>
</template>

<script>
import DButton from '@/components/base/DButton.vue';
import useValidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import DDialog from '@/components/base/DDialog.vue';
import DDialog1Button from '../../components/base/DDialog1Button.vue';
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
import DTooltipWarning from '@/components/base/DTooltipWarning.vue';
import DDialog3Button from '@/components/base/DDialog3Button.vue';
import VoucherSelectAssets from './VoucherSelectAssets.vue'
import VoucherUpdateAsset from './VoucherUpdateAsset.vue'
    
export default {
    name:"AssetDetail",
    components: { DButton, DDialog, DDialog1Button, DTooltipWarning, DDialog3Button, VoucherSelectAssets, VoucherUpdateAsset },
    props: {
        voucherSelected: Function, // Chứng từ được chọn
        //assetSelected: Function, // Tài sản được chọn
        assetsSelected: {
            type: Array
        },
        formMode: {
            type: Number,
            default: Enum.FormMode.Add
        },
        title: String,
        assetCode: String,
    },
    
    data() {
        return {
            voucher: { // Lưu dữ liệu 1 tài sản
                voucher_id:"",
                voucher_code:"",
                voucher_date:"",
                increment_date:"",
                cost:"",
                description:"",
                created_by:"",
                created_date:"",
                modified_by:"",
                modified_date:"",
            },
            // asset: { // Lưu dữ liệu 1 tài sản
            //     fixed_asset_id:"",
            //     fixed_asset_code:"",
            //     fixed_asset_name:"",
            //     organization_id:"",
            //     organization_code:"",
            //     organization_name:"",
            //     department_id:"",
            //     department_code:"",
            //     department_name:"",
            //     fixed_asset_category_id:"",
            //     fixed_asset_category_code:"",
            //     fixed_asset_category_name:"",
            //     quantity:"",
            //     cost:"",
            //     depreciation_rate:"",
            //     purchase_date:"",
            //     production_year:"",
            //     production_date:"",
            //     tracked_year:"",
            //     life_time:"",
            //     active:"",
            //     depreciation_year:"",
            //     created_by:"",
            //     created_date:"",
            //     modified_by:"",
            //     modified_date:"",
            // },
            //assetsSelected:[], // Mảng lưu các tài sản được chọn
            assets:[], // Mảng lưu các tài sản hiển thị
            assetSelected: {}, // Tài sản được chọn
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
            selectAssetsShow: false,
            updateAssetShow: false,
            thisShow: true,
            rowSelected:-1,
            rowHover: -1,
        }
    },

    watch: {
        voucher: {
            deep: true,
            handler() {
                this.isEdited = true
            }
        }
    },

    created() {
        // Cập nhật giá trị mảng asset thành giá trị tài sản truyền vào
        this.updateVoucher()
        // this.updateAsset()   
        // Truyền vào các giá trị mặc định
        this.defaultValue()
        // Sinh mã tiếp theo nếu là thêm và nhân bản
        if ((this.formMode == Enum.FormMode.Add) || (this.formMode == Enum.FormMode.Duplicate)) {
            this.generateNextCode()
        }
        // Truyền vào các tài sản được chọn
        this.assets = this.assetsSelected

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

        // // Cập nhật hao mòn năm
        // this.updateValue()
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
         * Truyền vào các tài sản đã chọn trong giao diện chọn tài sản
         * NDDAT (18/09/2022)
         * @param {array} assetsSelected các tài sản được chọn
         */
        selectAssets(assetsSelected) {
            for(let asset of assetsSelected) {
                if(asset!=null) this.assets.push(asset)
            }
        },

        /**
         * Hiển thị dialog sửa tài sản
         * NDDAT (17/11/2022)
         * @param {Asset} asset tài sản đang chọn
         */
        rowEdit(asset) {
            this.assetSelected = asset
            this.updateAssetShow = true;
            this.thisShow = false
        },

        /**
         * Định dạng tiền tệ
         * NDDAT (18/09/2022)
         * @param {double} money số tiền
         */
        formatMoney(money) {
            money = new Intl.NumberFormat(Resource.LanguageCode.VN, {}).format(money)
            return money
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
         * Gọi API lấy mã tài sản tiếp theo rồi gán vào mã hiện tại
         * NDDAT (29/09/2022)
         */
        generateNextCode() {
            try{
                // Gọi api lấy dữ liệu
                this.isLoading = true
                fetch(Resource.Url.Voucher + `/nextCode`, {method: Resource.Method.Get})
                .then(res => res.json())
                .then(data => {
                    this.voucher.voucher_code = Object.values(data)[0]
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
            // voucher
            if (this.voucher.voucher_date == null) this.voucher.voucher_date = new Date().toISOString()
            if (this.voucher.increment_date == null) this.voucher.increment_date = new Date().toISOString()

            // if (this.asset.purchase_date == null) this.asset.purchase_date = new Date().toISOString()
            // if (this.asset.production_date == null) this.asset.production_date = new Date().toISOString()
            // if (this.asset.tracked_year == null) this.asset.tracked_year = new Date().getFullYear()
            // if (this.asset.cost == null) this.asset.cost = 0
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
            this.$refs.asset_code.focus()
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
         * Cập nhật giá trị mảng voucher thành giá trị chứng từ truyền vào
         * NDDAT (14/11/2022)
         */
        updateVoucher() {
            this.voucher.voucher_id = this.voucherSelected.voucher_id
            this.voucher.voucher_code = this.voucherSelected.voucher_code
            this.voucher.voucher_date = this.voucherSelected.voucher_date
            this.voucher.increment_date = this.voucherSelected.increment_date
            this.voucher.cost = this.voucherSelected.cost
            this.voucher.description = this.voucherSelected.description
            this.voucher.created_by = this.voucherSelected.created_by
            this.voucher.created_date = this.voucherSelected.created_date
            this.voucher.modified_by = this.voucherSelected.modified_by
            this.voucher.modified_date = this.voucherSelected.modified_date    
        }

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