<template>
    <!-- Content Menu -->
    <div class="content-menu">
        <div class="content-search">
            <div class="search">
                <div class="search__icon"></div>
                <input 
                    v-model="search" 
                    tabindex="1" 
                    id="searchInput"
                    class="search__input mr-11" 
                    type="text" 
                    placeholder="Tìm kiếm tài sản"
                    @keypress.enter="searchMethod(search)"
                >
            </div>
            <div class="combobox-with-icon">
                <div class="combobox-icon"></div>
                <d-combobox 
                    type="2" 
                    main="fixed_asset_category_name" 
                    placeholder="Loại tài sản" 
                    class="combobox-icon-padding mr-11"
                    :tabindex="'2'" 
                    @searchAll="searchAllCategory" 
                    @comboboxSearch="categorySearch" 
                />
            </div>
            <div class="combobox-with-icon">
                <div class="combobox-icon"></div>
                <d-combobox 
                    type="1" 
                    main="department_name" 
                    placeholder="Bộ phận sử dụng" 
                    class="combobox-icon-padding mr-11"
                    :tabindex="'3'" 
                    @searchAll="searchAllDepartment" 
                    @comboboxSearch="departmentSearch"
                />
            </div>
        </div>
        <div class="content-btns">
            <d-button 
                tabindex="4" 
                text="Thêm tài sản" 
                icon="add" 
                class="mr-11"
                @click="btnAddOnClick" 
            />
            <div class="position-relative">
                <d-button 
                    tabindex="5" 
                    icon="excel" 
                    type="small" 
                    class="mr-11"
                />
                <d-tooltip text="Xuất"></d-tooltip>
            </div>
            <div class="position-relative">
                <d-button 
                    tabindex="6" 
                    icon="delete" 
                    type="small"
                    @click="btnDeleteOnClick" 
                />
                <d-tooltip text="Xóa"></d-tooltip>
            </div>
        </div>
    </div>

    <!-- Table -->
    <div class="table-container">
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
                    <th>Loại tài sản</th>
                    <th>Bộ phận sử dụng</th>
                    <th>Số lượng</th>
                    <th>Nguyên giá</th>
                    <th>                       
                        <div class="position-relative">
                            HM/KH lũy kế
                            <d-tooltip text="Hao mòn khấu hao lũy kế"></d-tooltip>
                        </div>
                    </th>
                    <th>Giá trị còn lại</th>
                    <th>Chức năng</th>
                </tr>
            </thead>
            <tbody class="tbody">
                <tr v-for="(asset, index) in assets" :key="asset.fixed_asset_id" 
                    tabindex="7" 
                    :id="'table'+index" 
                    :class="{'row--selected':(rowSelected == index), 'checkbox--selected':(checkboxSelected[index] == asset.fixed_asset_id) || checkedAll || rowFocus == index}" 
                    @keydown.f2="rowEdit(asset)" 
                    @keydown.insert="rowDuplicate(asset)" 
                    @keydown.delete="deleteOnKey(asset.fixed_asset_id)" 
                    @keydown.up="prevItem" @keydown.down="nextItem" 
                    @focus="rowFocus=index" @click="rowSelect(index)" 
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
                    <td :title="asset.fixed_asset_category_name">{{asset.fixed_asset_category_name}}</td>
                    <td :title="asset.department_name">{{asset.department_name}}</td>
                    <td>{{asset.quantity}}</td>
                    <td>{{formatMoney(asset.cost)}}</td>
                    <td>{{formatMoney(asset.depreciation_year*asset.life_time)}}</td>
                    <td>{{formatMoney(asset.cost-asset.depreciation_year*asset.life_time<0 ? 0 : asset.cost-asset.depreciation_year*asset.life_time)}}</td>
                    <td>
                        <div class="table-function">
                            <div class="position-relative">
                                <div @click="rowEdit(asset)" class="icon-edit"></div>
                                <d-tooltip text="Sửa"></d-tooltip>
                            </div>
                            <div class="position-relative">
                                <div @click="rowDuplicate(asset)" class="icon-duplicate"></div>
                                <d-tooltip text="Nhân bản" class="tool-tip--left"></d-tooltip>
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
                    <td><b>{{totalQuantity}}</b></td>
                    <td><b>{{formatMoney(totalCost)}}</b></td>
                    <td><b>{{formatMoney(totalDepreciation)}}</b></td>
                    <td><b>{{formatMoney(totalRemain)}}</b></td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
        <div class="loader"></div>
    </div>

    <!-- Dialog chi tiết tài sản -->
    <asset-detail 
        v-if="dialogShow" 
        :formMode="detailFormMode" 
        :assetSelected="assetSelected" 
        :assetCode="assetCode" 
        :title="title"
        @hideDialogSuccess="hideDialogSuccessMethod" 
        @hideDialog="hideDialogMethod" 
    />

    <!-- Dialog cảnh báo khi xóa -->
    <d-dialog 
        v-if="deleteShow" 
        :text="deleteText" textbtn="Xóa"
        @closeNotify="closeDelete" 
        @confirmNotify="confirmDelete" 
    />

    <!-- Dialog cảnh báo khi xóa nhưng không chọn tài sản nào -->
    <d-dialog-1-button 
        v-if="deleteSelectedNone" 
        text="Vui lòng chọn tài sản trước khi xóa."
        @closeNotify="this.deleteSelectedNone = false" 
    />

    <d-dialog-1-button v-on:keydown="keyboardEvent"
        v-if="backendError" 
        :text="backendErrorMsg"
        @closeNotify="this.backendError = false"
    />

    <!-- Toast thông báo thành công -->
    <transition name="toast">
        <d-toast v-show="toastShow"></d-toast>
    </transition>
</template>

<script>
import DButton from '../../components/base/DButton.vue'
import DTooltip from '@/components/base/DTooltip.vue'
import AssetDetail from './AssetDetail.vue'
import DCombobox from '../../components/base/DCombobox.vue'
import DDialog from '@/components/base/DDialog.vue'
import DToast from '@/components/base/DToast.vue'
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
import DDialog1Button from '@/components/base/DDialog1Button.vue'


export default {
  components: { DButton, DTooltip, AssetDetail, DCombobox, DDialog, DToast, DDialog1Button },
  name:"AssetList",

  data() {
    return {
        assets:[], // Mảng lưu các tài sản đang hiện
        assetsAll:[], // Mảng lưu toàn bộ tài sản trong database
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
        ctrlPressed: false, // Nút Ctrl có đang được bấm hay không
        backendError: false, // Có hiển thị dialog cảnh báo lỗi từ backend không
        backendErrorMsg: "", // Thông điệp trong cảnh báo lỗi backend
    }
  },

  created() {
    // Thực hiện gọi api lấy dữ liệu
    this.loadData()
    this.setUpCheckedAll()

    // Cài đặt keyboard shortcut
    window.addEventListener('keydown', function(e) {
        if(e.keyCode == Enum.KeyCode.SelectTable) {
            document.getElementById(`table0`).focus()
        }
        else if(e.which == Enum.KeyCode.Ctrl){
            this.ctrlPressed = true
        }
        else if(e.which == Enum.KeyCode.F3 && this.ctrlPressed == true){
            document.getElementById(`searchInput`).focus()
            this.ctrlPressed = false
        }
    });
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
                            this.setUpCheckedAll()
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
        this.setUpCheckedAll()
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
     * Hàm lấy toàn bộ dữ liệu database
     * NDDAT (15/09/2022)
     */
    setUpCheckedAll() {
        try{
            // Gọi api lấy toàn bộ dữ liệu
            this.isLoading = true
            fetch(Resource.Url.Asset+"/filters?keyword="+this.keyword+"&departmentId="+this.departmentId+"&categoryId="+this.categoryId+"&limit="+"-1"+"&page="+this.page, {method: Resource.Method.Get})
            .then(res => res.json())
            .then(data => {
                this.assetsAll = Object.values(data)[0]
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
     * Click vào checkbox đầu bảng để chọn toàn bộ bảng
     * NDDAT (15/09/2022)
     */
    checkedAllMethod() {
        this.resetChecked()
            if (!this.checkedAll) {
                for (let index in this.assetsAll) {
                    this.checked.push(this.assetsAll[index].fixed_asset_id)
                }
            }
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
  },
}
</script>

<style scoped>
    @import url('../../css/views/asset.css');
    @import url('../../css/base/search.css');
    @import url('../../css/base/table.css');
    @import url('../../css/base/dialog.css');
    @import url('../../css/base/loading.css');
    @import url('../../css/base/combobox.css');
    @import url('../../css/base/checkbox.css');
    @import url('../../css/base/toasttransition.css');
</style>