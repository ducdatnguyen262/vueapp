<template>
    <div class="dialog-container" v-on:keydown="keyboardEvent">
        <div class="dialog dialog-voucher">
            <div class="dialog__header background-white">
                <!-- <h2 class="dialog-title">{{title}}</h2> -->
                <h2 class="dialog-title">Chọn tài sản ghi tăng</h2>
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
            
            <div class="content-menu content-menu--white" style="margin:0; border-top:1px solid #d2d2d2">
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
            </div>
            <div class="table-container table-2 table-2--checkbox" style="height:480px; margin:0">
                <table class="table">
                    <thead class="thead">
                        <tr>
                            <th><input v-model="checkedAll" @click="checkedAllMethod()" type="checkbox"></th>
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
                            :class="{'row--selected':(rowSelected == index), 'checkbox--selected':(checkboxSelected[index] == asset.fixed_asset_id) || checkedAll || rowFocus == index}" 
                            v-contextmenu:contextmenu
                            @keydown.f2="rowEdit(asset)" 
                            @keydown.insert="rowDuplicate(asset)" 
                            @keydown.delete="deleteOnKey(asset.fixed_asset_id)" 
                            @keydown.up="prevItem" @keydown.down="nextItem" 
                            @focus="rowFocus=index" @click="rowSelect(index);checkedMethodOnClick(index, asset.fixed_asset_id)" 
                            @dblclick="rowEdit(asset)" 
                            @mouseover="rowHover = index" 
                            @mouseleave="rowHover = -1"
                        >
                            <td class="ms-table-right ms-table-fit">
                                <input 
                                    v-model="checked" 
                                    :value="asset.fixed_asset_id" 
                                    type="checkbox"
                                    @click.stop 
                                    @change="checkedMethod(index, asset.fixed_asset_id)" 
                                >
                            </td>
                            <td>{{index + 1}}</td>
                            <td>{{asset.fixed_asset_code}}</td>
                            <td :title="asset.fixed_asset_name">{{asset.fixed_asset_name}}</td>
                            <td :title="asset.department_name">{{asset.department_name}}</td>
                            <td>{{formatMoney(asset.cost)}}</td>
                            <td>{{formatMoney(asset.depreciation_year)}}</td>
                            <td>{{formatMoney(asset.cost-asset.depreciation_year*asset.life_time<0 ? 0 : asset.cost-asset.depreciation_year*asset.life_time)}}</td>
                        </tr>
                        <tr style="height:auto;"></tr>
                    </tbody>
                    <el-empty v-if="totalCount==0" 
                        description="Không có dữ liệu"
                        style="position: absolute; top: calc(50% - 146px); left: calc(50% - 80px);" 
                    />
                    <tfoot class="tfoot">
                        <tr>
                            <td colspan="6">
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
                                        v-show="totalPage!=1" :class="{'tfooter-page--selected':page == totalPage}" 
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

    <!-- Context Menu -->
    <v-contextmenu ref="contextmenu">
        <v-contextmenu-item @click="btnAddOnClick">Thêm</v-contextmenu-item>
        <v-contextmenu-item @click="rowEdit(assetSelected)">Sửa</v-contextmenu-item>
        <v-contextmenu-item @click="deleteOnKey(assetSelected.fixed_asset_id)">Xóa</v-contextmenu-item>
        <v-contextmenu-item @click="rowDuplicate(assetSelected)">Nhân bản</v-contextmenu-item>
    </v-contextmenu>
</template>

<script>
import DButton from '../../components/base/DButton.vue'
import DTooltip from '@/components/base/DTooltip.vue'
import DDialog from '@/components/base/DDialog.vue'
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
import DDialog1Button from '@/components/base/DDialog1Button.vue'


export default {
    components: { DButton, DTooltip, DDialog, DDialog1Button },
    name:"AssetList",

    data() {
        return {
            assets:[], // Mảng lưu các tài sản đang hiện
            search:"", // Lưu giá trị input tìm kiếm
            isLoading: false, // Có đang loading hay không
            dialogShow: false, // Hiển thị dialog hay không
            assetSelected: {}, // Tài sản được chọn
            detailFormMode: Enum.FormMode.Add, // Loại của dialog chi tiết tài sản
            rowSelected: -1, // Dòng được chọn tạm thời (click)
            rowHover: -1, // Dòng được hover
            rowFocus: -1, // Dòng được focus
            rowFocusDelete: [], // Chứa id của dòng được focus để xóa
            title: "", // Title của dialog dialog chi tiết tài sản
            checkedAll: false, // Có check toàn bộ checkbox hay không
            checked: [], // Danh sách các dòng được chọn (checkbox)
            checkboxSelected: [], // Danh sách các dòng được chọn (checkbox) với chỉ số trùng với chỉ số các dòng hiển thị
            deleteShow: false, // Hiển thị dialog cảnh báo xóa hay không
            deleteText:"", // Nội dung dialog cảnh báo xóa
            deleteSelectedNone: false, // // Hiển thị dialog cảnh báo khi xóa mà không chọn tài sản nào
            toastShow: false, // Hiển thị toast thông báo thành công hay không
            tableView: 20, // Số trang hiển thị
            totalPage: 1, // Tổng số trang
            page: 1, // Trang đang chọn
            totalCount: 0, // Tổng số bản ghi
            totalQuantity: 0, // Tổng số lượng
            totalCost: 0, // Tổng số nguyên giá
            totalDepreciation: 0, // Tổng số hao mòn lũy kế
            totalRemain: 0, // Tổng số còn lại
            keyword: "", // Từ khóa để tìm kiếm (theo mã và tên tài sản )
            departmentId: "", // Mã phòng ban để tìm kiếm
            categoryId: "", // Mã loại tài sản để tìm kiếm
            assetCode: "", // Mã tài sản lưu lại khi mở form
            backendError: false, // Có hiển thị dialog cảnh báo lỗi từ backend không
            backendErrorMsg: "", // Thông điệp trong cảnh báo lỗi backend
            columns : [
                        {
                            label: "Mã tài sản",
                            field: "fixed_asset_code",
                        },
                        {
                            label: "Tên tài sản",
                            field: "fixed_asset_name",
                        },
                        {
                            label: "Loại tài sản",
                            field: "fixed_asset_category_name",
                        },
                        {
                            label: "Bộ phận sử dụng",
                            field: "department_name",
                        },
                        {
                            label: "Số lượng",
                            field: "quantity",
                        },
                        {
                            label: "Nguyên giá",
                            field: "cost",
                            dataFormat: this.formatMoney
                        },
                        {
                            label: "Ngày mua",
                            field: "purchase_date",
                            dataFormat: this.formatDate
                        },
                        {
                            label: "Tỷ lệ hao mòn (%)",
                            field: "depreciation_rate",
                        },
                        {
                            label: "Năm bắt đầu theo dõi",
                            field: "tracked_year",
                        },
                        {
                            label: "Số năm sử dụng",
                            field: "life_time",
                        },
                        {
                            label: "Ngày bắt đầu sử dụng",
                            field: "production_date",
                            dataFormat: this.formatDate
                        },
                        {
                            label: "Hao mòn năm",
                            field: "depreciation_year",
                        },
                    ],
        }
    },

    created() {
        // Thực hiện gọi api lấy dữ liệu
        this.loadData()

        // Cài đặt keyboard shortcut
        const component = this;
        this.handler = function (e) {
            component.$emit('keydown', e);
        }
        window.addEventListener('keydown', this.handler)

        window.addEventListener('keydown', function(e) {
            if(e.keyCode == Enum.KeyCode.SelectTable) {
                document.getElementById(`table0`).focus()
            }
            else if(e.which == Enum.KeyCode.F3 && e.ctrlKey == true){
                document.getElementById(`searchInput`).focus()
            }
        });
    },

    beforeUnmount() {
        window.removeEventListener('keypress', this.handler);
    },

    computed: {
        // Tạo api lấy tài sản
        api : function() {
            return Resource.Url.Asset+"/filters?keyword="+this.keyword+"&departmentId="+this.departmentId+"&categoryId="+this.categoryId+"&limit="+this.tableView+"&page="+this.page
        },
    },

  methods: {
    /**
     * Nhấn button hiển thị dialog thêm tài sản
     * NDDAT (15/09/2022)
     */
    btnAddOnClick() { 
        this.assetSelected = {}
        this.detailFormMode = Enum.FormMode.Add
        this.title = Resource.DialogTitle.Add
        this.dialogShow = true
    },

    /**
     * Tạo text cho dialog cảnh báo xóa
     * NDDAT (26/09/2022)
     */
    deleteTextCreate() {
        if(this.checked.length > 1) this.deleteText = "<b>"+(this.checked.length>9 ? this.checked.length : "0"+this.checked.length)+"</b> tài sản đã được chọn. Bạn có muốn xóa các tài sản này khỏi danh sách?"
        else {
            var id
            if(this.checked.length == 1) id = this.checked[0];
            else if(this.rowFocusDelete[0]) id = this.rowFocusDelete[0]
            for (let index in this.assets) {
                if (id == this.assets[index].fixed_asset_id){
                    this.deleteText = "Bạn có muốn xóa tài sản <b>"+this.assets[index].fixed_asset_code+"</b> - <b>"+this.assets[index].fixed_asset_name+"</b>?"
                    break;
                }
            } 
        }
    },

    /**
     * Nhấn button hiển thị dialog cảnh báo xóa tài sản
     * NDDAT (15/09/2022)
     */
    btnDeleteOnClick() {
        if(this.checked.length == 0) {
            this.deleteSelectedNone =true
        }
        else {
            this.deleteTextCreate()
            this.deleteShow = true
        }
    },

    /**
     * Nhấn phím tắt Delete hiển thị dialog cảnh báo xóa tài sản
     * NDDAT (07/10/2022)
     * @param {string} id ID tài sản đang focus
     */
    deleteOnKey(id) {
        this.rowFocusDelete[0] = id;
        this.deleteTextCreate()
        this.deleteShow = true
    },

    /**
     * Đóng dialog cảnh báo xóa tài sản
     * NDDAT (15/09/2022)
     */
    closeDelete() {
        document.getElementById(`table${this.rowFocus+1}`).focus()
        this.deleteShow = false
    },

    /**
     * Xác nhận xóa và đóng dialog cảnh báo xóa tài sản
     * NDDAT (28/09/2022)
     */
    confirmDelete() {
        // Xóa tài sản
        if(this.rowFocusDelete[0] || this.checked[0]){
            try{
                // Xóa dữ liệu:
                var url = Resource.Url.Asset + "/batch-delete"
                var body = ""
                if(this.checked[0]) body = this.checked
                else body = this.rowFocusDelete
                fetch(url, {method: Resource.Method.Post, headers:{ 'Content-Type': 'application/json'}, body: JSON.stringify(body)})
                .then(res =>{
                    var status = res.status
                    switch(status) {
                        case 400: 
                            this.backEndErrorNotify(Resource.ErrorCode[400])
                            break
                        case 405: 
                            this.backEndErrorNotify(Resource.ErrorCode[405])
                            break
                        case 500: 
                            this.backEndErrorNotify(Resource.ErrorCode[500])
                            break
                        default: 
                            this.closeDelete()
                            this.loadData()
                            this.rowFocusDelete = []
                            this.checked = []
                    }
                })
                .catch(res => {
                    console.error(res);
                })
            } catch (error) {
                console.error(error);
            }
        }
    },

    /**
     * Ẩn dialog chi tiết tài sản
     * NDDAT (15/09/2022)
     */
    hideDialogMethod () {
        if(this.rowFocus > -1) {
            document.getElementById(`table${this.rowFocus}`).focus()
        }
        this.dialogShow = false
        this.loadData()
    },

    /**
     * Hiện thông báo thêm thành công và ẩn dialog chi tiết tài sản
     * NDDAT (15/09/2022)
     */
    hideDialogSuccessMethod() {
        this.hideDialogMethod()
        this.toastShow = true
        setTimeout(() => this.toastShow = false, 3000)
    },

    /**
     * Click 1 dòng trong bảng để highlight
     * NDDAT (15/09/2022)
     * @param {int} index số thứ tự dòng
     */
    rowSelect(index) {
        this.rowSelected = index
    },

    /**
     * Nhấn button hiển thị dialog sửa tài sản
     * NDDAT (15/09/2022)
     * @param {Asset} asset tài sản đang chọn
     */
    rowEdit(asset) {
        this.assetSelected = asset
        this.assetCode = this.assetSelected.fixed_asset_code
        this.detailFormMode = Enum.FormMode.Edit
        this.title = Resource.DialogTitle.Edit
        this.dialogShow = true
    },

    /**
     * Nhấn button hiển thị dialog nhân bản tài sản
     * NDDAT (15/09/2022)
     * @param {Asset} asset tài sản đang chọn
     */
    rowDuplicate(asset) {
        this.assetSelected = asset
        this.detailFormMode = Enum.FormMode.Duplicate
        this.title = Resource.DialogTitle.Duplicate
        this.dialogShow = true
    },

    /**
     * Tìm kiếm theo mã và tên tài sản
     * NDDAT (27/09/2022)
     * @param {String} keyword từ khóa tìm kiếm
     */
    searchMethod(keyword) {
        this.keyword = keyword
        this.loadData()
    },

    /**
     * Tìm kiếm toàn bộ loại tài sản
     * NDDAT (29/09/2022)
     */
    searchAllCategory() {
        this.categoryId = ""
        this.loadData()
    },

    /**
     * Tìm kiếm toàn bộ phòng ban
     * NDDAT (29/09/2022)
     */
    searchAllDepartment() {
        this.departmentId = ""
        this.loadData()
    },

    /**
     * Tìm kiếm loại tài sản
     * NDDAT (29/09/2022)
     */
    categorySearch(id) {
        this.categoryId = id
        this.loadData()
    },

    /**
     * Tìm kiếm phòng ban
     * NDDAT (29/09/2022)
     * @param {string} id ID phòng ban
     */
    departmentSearch(id) {
        this.departmentId = id
        this.loadData()
    },

    /**
     * Đặt lại toàn bộ checkbox
     * NDDAT (27/09/2022)
     */
    resetChecked() {
        this.checked = []
        this.checkboxSelected = []
        this.rowSelected = -1
    },

    /**
     * Click vào checkbox đầu bảng để chọn toàn bộ bảng
     * NDDAT (15/09/2022)
     */
    checkedAllMethod() {
        this.resetChecked()
        if (!this.checkedAll) {
            for (let asset of this.assets) {
                this.checked.push(asset.fixed_asset_id)
            }
        }
    },

    /**
     * Kiểm tra có cần checkbox toàn bộ không
     * NDDAT (09/11/2022)
     */
    checkedAllInspect() {
        if(this.assets.length > 0) {
            let checkall = true
            for (let asset of this.assets) {
                let match = false
                for (let check of this.checked) {
                    if(match == true) break
                    if(asset.fixed_asset_id == check){
                        match = true
                        break
                    }
                }
                if(match == false) checkall = false
            }
            if(checkall) this.checkedAll = true
            else this.checkedAll = false
        }
        else this.checkedAll = false
    },

    /**
     * Click vào checkbox để chọn dòng đó
     * NDDAT (15/09/2022)
     * @param {int} order số thứ tự dòng của checkbox
     * @param {int} code id của dòng chứa checkbox được click
     */
    checkedMethod(order, code) {
        if (this.checkboxSelected[order] == code) this.checkboxSelected[order] = null
        for (let i in this.checked) {
            for (let index in this.assets) {
                if (this.checked[i] == this.assets[index].fixed_asset_id) {
                    this.checkboxSelected[index] = this.assets[index].fixed_asset_id
                }
            }
        }
        this.checkedAllInspect()
        console.log(this.checked);
        console.log(this.checkboxSelected);
    },

    checkedMethodOnClick(order, code) {
        if (this.checkboxSelected[order] == code){
            for (let i in this.checked) {
                if(this.checked[i] == this.checkboxSelected[order]) this.checked[i]=null
            }
            this.checkboxSelected[order] = null
        }
        else {
            this.checked[this.checked.length] = code
        }
        for (let i in this.checked) {
            for (let index in this.assets) {
                if (this.checked[i] == this.assets[index].fixed_asset_id) {
                    this.checkboxSelected[index] = this.assets[index].fixed_asset_id
                }
            }
        }
        this.checkedAllInspect()
        console.log(this.checked);
        console.log(this.checkboxSelected);
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
     * Về trang trước
     * NDDAT (25/09/2022)
     */
    prevPage() {
        if(this.page > 1){
            this.page--
            this.loadData()
        }  
    },

    /**
     * Sang trang sau
     * NDDAT (25/09/2022)
     */
    nextPage() {
        if(this.page < this.totalPage){
            this.page++
            this.loadData()
        }    
    },

    /**
     * Tới trang được chọn
     * NDDAT (25/09/2022)
     * @param {int} page số trang
     */
    toPage(page) {
        this.page = page
        this.loadData()
    },

    /**
     * Tính tổng số trang của bảng
     * NDDAT (25/09/2022)
     */
    totalPageMethod() {
        if(this.totalCount <= this.tableView || this.tableView == -1) this.totalPage = 1
        else if(this.totalCount%this.tableView==0) this.totalPage = this.totalCount/this.tableView
        else this.totalPage = (this.totalCount-(this.totalCount%this.tableView))/this.tableView + 1
    },

    /**
     * Hiện thị cảnh báo lỗi truyền từ BackEnd
     * NDDAT (12/10/2022)
     * @param {string} text Thông điệp trong cảnh báo
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
        money = new Intl.NumberFormat(Resource.LanguageCode.VN, {}).format(money)
        return money
    },

    /**
     * Định dạng ngày tháng
     * NDDAT (18/10/2022)
     * @param {string} date số tiền
     */
    formatDate(date) {
        const dateFormat = new Date(date)
        dateFormat.toLocaleDateString()
        let day = dateFormat.getDate().toString().padStart(2, "0")
        let month = (dateFormat.getMonth() + 1).toString().padStart(2, "0")
        let year = dateFormat.getFullYear()
        return day + '/' + month + '/' + year
    },

    /**
     * Gọi api lấy dữ liệu rồi reload lại trang
     * NDDAT (15/09/2022)
     */
    loadData() {
        try{
            // Gọi api lấy dữ liệu
            this.isLoading = true
            fetch(this.api, {method: Resource.Method.Get})
            .then(res => res.json())
            .then(data => {
                this.assets = Object.values(data)[0]
                this.totalCount = Object.values(data)[1]
                this.totalQuantity = Object.values(data)[2]
                this.totalCost = Object.values(data)[3]
                this.totalDepreciation = Object.values(data)[4]
                this.totalRemain = Object.values(data)[5]
                this.totalPageMethod()
                this.checkedAllInspect()
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

        if (this.asset.purchase_date == null) this.asset.purchase_date = new Date().toISOString()
        if (this.asset.production_date == null) this.asset.production_date = new Date().toISOString()
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
        this.$emit("hideDialog")
    },

    /**
     * Click vào button để lưu tài sản
     * NDDAT (15/09/2022)
     */
    btnSaveOnClick() {
        try{
            this.btnCloseOnClick()    
               
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
  },
}
</script>

<style scoped>
    @import url('../../css/base/input.css');
    @import url('../../css/base/datepicker.css');
</style>