<template>
    <!-- Content Menu -->
    <div class="content-menu">
        <div class="content-search">
            <div class="search">
                <div class="search__icon"></div>
                <input v-model="search" @keyup="searchMethod(search)" class="search__input mr-11" type="text" placeholder="Tìm kiếm tài sản">
            </div>
            <div class="combobox-with-icon">
                <div class="combobox-icon"></div>
                <d-combobox type="1" main="department_name" placeholder="Loại tài sản" class="combobox-icon-padding mr-11"></d-combobox>
            </div>
            <div class="combobox-with-icon">
                <div class="combobox-icon"></div>
                <d-combobox type="2" main="fixed_asset_category_name" placeholder="Bộ phận sử dụng" class="combobox-icon-padding"></d-combobox>
            </div>
        </div>
        <div class="content-btns">
            <d-button @click="btnAddOnClick" text="Thêm tài sản" icon="add" class="mr-11"></d-button>
            <div class="position-relative">
                <d-button icon="excel" type="small" class="mr-11"></d-button>
                <d-tooltip text="Xuất"></d-tooltip>
            </div>
            <div class="position-relative">
                <d-button @click="btnDeleteOnClick" icon="delete" type="small"></d-button>
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
                <tr v-for="(as, index) in assets" :key="as.fixed_asset_id" :class="{'row--selected':(rowSelected == index), 'checkbox--selected':(checkboxSelected[index] == index)||checkedAll}" @click="rowSelect(index)" @mouseover="rowHover = index" @mouseleave="rowHover = -1">
                    <td class="ms-table-right ms-table-fit">
                        <input v-model="checked" :value="as.fixed_asset_id" @click.stop @change="checkedMethod(index)" type="checkbox">
                    </td>
                    <td>{{index + 1}}</td>
                    <td>{{as.fixed_asset_code}}</td>
                    <td>{{as.fixed_asset_name}}</td>
                    <td>{{as.fixed_asset_category_name}}</td>
                    <td>{{as.department_name}}</td>
                    <td>{{as.quantity}}</td>
                    <td>{{formatMoney(as.cost)}}</td>
                    <td>{{formatMoney(as.cost*as.depreciation_rate/100)}}</td>
                    <td>{{formatMoney(as.cost-as.cost*as.depreciation_rate/100)}}</td>
                    <td>
                        <div class="table-function">
                            <div class="position-relative">
                                <div v-show="rowHover == index || rowSelected == index || checkedAll || checkboxSelected[index] == index" @click="rowEdit(as)"  class="icon-edit"></div>
                                <d-tooltip text="Sửa"></d-tooltip>
                            </div>
                            <div class="position-relative">
                                <div v-show="rowHover == index || rowSelected == index || checkedAll || checkboxSelected[index] == index" @click="rowDuplicate(as)" class="icon-duplicate"></div>
                                <d-tooltip text="Nhân bản" class="tool-tip--left"></d-tooltip>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr style="height:auto;"></tr>
            </tbody>
            <tfoot class="tfoot">
                <tr>
                    <td colspan="6">
                        <div class="tfooter-left">
                            <div class="tfooter-text">Tổng số <b>{{tableTotal}}</b> bản ghi</div>
                            <div class="tfooter-total">
                                <select @change="page=1;loadData()" v-model="tableView">
                                    <option value="10">10</option>
                                    <option value="20" selected>20</option>
                                    <option value="80">80</option>
                                    <option value="100">100</option>
                                    <option value="-1">All</option>
                                </select>
                            </div>
                            <div @click="prevPage()" class="tfooter-prev position-relative">
                                <d-tooltip text="Trang trước" class="tool-tip--top"></d-tooltip>
                            </div>
                            <div @click="toPage(1)" :class="{'tfooter-page--selected':page == 1}" class="tfooter-page">1</div>
                            <div v-show="page>=3 && totalPage>5 && totalPage!=1" class="tfooter-page">...</div>
                            <div @click="toPage(2)" v-show="(page<3 || totalPage==5) && totalPage!=1" :class="{'tfooter-page--selected':page == 2}" class="tfooter-page">2</div>
                            <div @click="toPage(3)" v-show="page<3 && totalPage!=1" :class="{'tfooter-page--selected':page == 3}" class="tfooter-page">3</div>
                            <div v-show="page>=3 && page<totalPage-1 && totalPage!=1" class="tfooter-page tfooter-page--selected">{{page}}</div>
                            <div v-show="page<totalPage-1 && totalPage>5 && totalPage!=1" class="tfooter-page">...</div>
                            <div @click="toPage(totalPage-2)" v-show="page>=totalPage-1 && totalPage!=1" :class="{'tfooter-page--selected':page == totalPage-2}" class="tfooter-page">{{totalPage-2}}</div>
                            <div @click="toPage(totalPage-1)" v-show="(page>=totalPage-1 || totalPage==5) && totalPage!=1" :class="{'tfooter-page--selected':page == totalPage-1}" class="tfooter-page">{{totalPage-1}}</div>
                            <div @click="toPage(totalPage)" v-show="totalPage!=1" :class="{'tfooter-page--selected':page == totalPage}" class="tfooter-page">{{totalPage}}</div>
                            <div @click="nextPage()" class="tfooter-next position-relative">
                                <d-tooltip text="Trang sau" class="tool-tip--top"></d-tooltip>
                            </div>
                        </div>
                    </td>
                    <td><b>13</b></td>
                    <td><b>249.000.000</b></td>
                    <td><b>19.716.000</b></td>
                    <td><b>229.284.000</b></td>
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
    <asset-detail v-if="dialogShow" :formMode="detailFormMode" :assetSelected="asSelected" @hideDialog="hideDialogMethod" @hideDialogSuccess="hideDialogSuccessMethod" :title="title"></asset-detail>

    <!-- Dialog cảnh báo -->
    <d-dialog v-if="deleteShow" @closeNotify="closeDelete" @confirmNotify="confirmDelete" text="Bạn có muốn xóa tài sản " textbtn="Xóa"></d-dialog>

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


export default {
  components: { DButton, DTooltip, AssetDetail, DCombobox, DDialog, DToast },
  name:"AssetList",
  props: [],
  created() {
    // Thực hiện gọi api lấy dữ liệu
    this.loadData()
  },
  data() {
    return {
        assets:[],
        isLoading: false, // Có đang loading hay không
        dialogShow: false, // Hiển thị dialog hay không
        asSelected: {}, // Tài sản được chọn
        detailFormMode: Enum.FormMode.Add, // Loại của dialog chi tiết tài sản
        rowSelected: -1, // Dòng được chọn tạm thời (click)
        rowHover: -1, // Dòng được hover
        title: "", // Title của dialog dialog chi tiết tài sản
        checkedAll: false, // Có check toàn bộ checkbox hay không
        checked: [], // Danh sách các dòng được chọn (checkbox)
        checkboxSelected: [], // Danh sách các dòng được chọn (checkbox) với chỉ số trùng với chỉ số các dòng hiển thị
        deleteShow: false, // Hiển thị dialog cảnh báo xóa hay không
        toastShow: false, // Hiển thị toast thông báo thành công hay không
        tableTotal: 0, // Tổng số bản ghi
        tableView: 20, // Số trang hiển thị
        totalPage: 1, // Tổng số trang
        page: 1, // Trang đang chọn
        keyword: "", // Từ khóa để tìm kiếm (theo mã và tên tài sản )
        mainUrl: "https://localhost:7182/api/v1/Assets", // url chính để nối các trường vào,
    }
  },
  computed: {
    // Tạo api lấy tài sản
    api : function() {
        return "https://localhost:7182/api/v1/Assets/filter?keyword="+this.keyword+"&limit="+this.tableView+"&page="+this.page
    },
  },
  methods: {
    /**
     * Nhấn button hiển thị dialog thêm tài sản
     * NDDAT (15/09/2022)
     */
    btnAddOnClick() {
        this.asSelected = {}
        this.dialogShow = true
        this.detailFormMode = Enum.FormMode.Add
        this.title = Resource.DialogTitle.Add
    },

    /**
     * Nhấn button hiển thị dialog cảnh báo xóa tài sản
     * NDDAT (15/09/2022)
     */
    btnDeleteOnClick() {
        this.deleteShow = true
    },

    /**
     * Đóng dialog cảnh báo xóa tài sản
     * NDDAT (15/09/2022)
     */
    closeDelete() {
        this.deleteShow = false
    },

    /**
     * Xác nhận xóa và đóng dialog cảnh báo xóa tài sản
     * NDDAT (28/09/2022)
     */
    confirmDelete() {
        this.closeDelete()
        // Xóa tài sản
        if(this.rowSelected != -1){
            console.log(this.assets[this.rowSelected]);
            try{
                // Xóa dữ liệu:
                var url = this.mainUrl + `/${this.assets[this.rowSelected].fixed_asset_id}`
                fetch(url, {method: Resource.Method.Delete, headers:{ 'Content-Type': 'application/json'}, body: JSON.stringify(this.asset)})
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
                                this.loadData()
                        }
                })
                .catch(res => {
                    console.log(res);
                })
            } catch (error) {
                console.log(error);
            }
        }
    },

    /**
     * Ẩn dialog chi tiết tài sản
     * NDDAT (15/09/2022)
     */
    hideDialogMethod () {
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
        this.asSelected = asset
        this.dialogShow = true
        this.detailFormMode = Enum.FormMode.Edit
        this.title = Resource.DialogTitle.Edit
    },

    /**
     * Nhấn button hiển thị dialog nhân bản tài sản
     * NDDAT (15/09/2022)
     * @param {Asset} asset tài sản đang chọn
     */
    rowDuplicate(asset) {
        // Sinh ra mã tài sản mới

        this.asSelected = asset
        this.generateNextCode()
        this.dialogShow = true
        this.detailFormMode = Enum.FormMode.Add
        this.title = Resource.DialogTitle.Duplicate
    },

    /**
     * Gọi API lấy mã tài sản tiếp theo rồi gán vào mã hiện tại
     * NDDAT (29/09/2022)
     */
    generateNextCode() {
        try{
            // Gọi api lấy dữ liệu
            this.isLoading = true
            fetch(this.mainUrl + `/nextCode`, {method: Resource.Method.Get})
            .then(res => res.json())
            .then(data => {
                this.asSelected.fixed_asset_code = Object.values(data)[0]
                this.isLoading = false
            })
            .catch(res => {
                console.log(res);
                this.isLoading = false
            })
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * Tìm kiếm theo mã và tên tài sản
     * NDDAT (27/09/2022)
     * @param {String} keyword từ khóa tìm kiếm
     */
    searchMethod(keyword) {
        console.log(keyword);
        this.keyword = keyword
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
        try{
            this.resetChecked()
            if (!this.checkedAll) {
                for (let index in this.assets) {
                    this.checked.push(this.assets[index].fixed_asset_id)
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * Click vào checkbox để chọn dòng đó
     * NDDAT (15/09/2022)
     * @param {int} ind số thứ tự dòng của checkbox
     */
    checkedMethod(ind) {
        try{
            if (this.checkboxSelected[ind] == ind) this.checkboxSelected[ind] = null
            for (let i in this.checked) {
                for (let index in this.assets) {
                    if (this.checked[i] == this.assets[index].fixed_asset_id) {
                        this.checkboxSelected[index] = index
                    }
                }
            }
            console.log(this.checked);
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * Về trang trước
     * NDDAT (25/09/2022)
     */
    prevPage() {
        if(this.page > 1){
            this.resetChecked()
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
            this.resetChecked()
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
        this.resetChecked()
        this.page = page
        this.loadData()
    },

    /**
     * Tính tổng số trang của bảng
     * NDDAT (25/09/2022)
     */
    totalPageMethod() {
        if(this.tableTotal <= this.tableView || this.tableView == -1) this.totalPage = 1
        else if(this.tableTotal%this.tableView==0) this.totalPage = this.tableTotal/this.tableView
        else this.totalPage = (this.tableTotal-(this.tableTotal%this.tableView))/this.tableView + 1
    },

    /**
     * Định dạng tiền tệ
     * NDDAT (18/09/2022)
     * @param {double} money số tiền
     */
    formatMoney(money) {
        try {
            money = new Intl.NumberFormat('de-DE', {}).format(money)
        return money
        } catch (error) {
            console.log(error);
        }  
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
                this.tableTotal = Object.values(data)[1]
                this.totalPageMethod()
                this.isLoading = false
            })
            .catch(res => {
                console.log(res);
                this.isLoading = false
            })
        } catch (error) {
            console.log(error);
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