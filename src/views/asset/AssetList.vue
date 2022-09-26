<template>
    <!-- Content Menu -->
    <div class="content-menu">
        <div class="content-search">                 
            <d-search placeholder="Tìm kiếm tài sản" class="mr-11"></d-search>
            <div class="combobox-with-icon">
                <div class="combobox-icon"></div>
                <d-combobox placeholder="Loại tài sản" class="combobox-icon-padding mr-11"></d-combobox>
            </div>
            <div class="combobox-with-icon">
                <div class="combobox-icon"></div>
                <d-combobox placeholder="Bộ phận sử dụng" class="combobox-icon-padding"></d-combobox>
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
    <div class="table">
        <table>
            <thead>
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
                    <th format-date>Loại tài sản</th>
                    <th>Bộ phận sử dụng</th>
                    <th>Số lượng</th>
                    <th format-money>Nguyên giá</th>
                    <th format-money>                       
                        <div class="position-relative">
                            HM/KH lũy kế
                            <d-tooltip text="Hao mòn khấu hao lũy kế"></d-tooltip>
                        </div>
                    </th>
                    <th format-money>Giá trị còn lại</th>
                    <th>Chức năng</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(as, index) in assets" :key="as.fixed_asset_id" :class="{'row--selected':(rowSelected == index), 'checkbox--selected':(checkboxSelected[index] == index)||checkedAll}" @click="rowSelect(index)" @mouseover="rowHover = index" @mouseleave="rowHover = -1">
                    <td class="ms-table-right ms-table-fit">
                        <input v-model="checked" :value="as.fixed_asset_id" @click.stop @change="checkedMethod(index)" type="checkbox">
                    </td>
                    <td>{{index + 1}}</td>
                    <td>{{as.fixed_asset_code}}</td>
                    <td>{{as.fixed_asset_name}}</td>
                    <td>{{as.department_name}}</td>
                    <td>{{as.fixed_asset_category_name}}</td>
                    <td>{{as.quantity}}</td>
                    <td>{{formatMoney(as.cost)}}</td>
                    <td>{{formatMoney(as.cost)}}</td>
                    <td>{{formatMoney(as.cost)}}</td>
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
            <tfoot>
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
                            <div :class="{'tfooter-page--selected':page == 1}" class="tfooter-page">1</div>
                            <div v-show="page>=3 && totalPage>5 && totalPage!=1" class="tfooter-page">...</div>
                            <div v-show="page<3 && totalPage!=1" :class="{'tfooter-page--selected':page == 2}" class="tfooter-page">2</div>
                            <div v-show="page<3 && totalPage!=1" :class="{'tfooter-page--selected':page == 3}" class="tfooter-page">3</div>
                            <div v-show="page>=3 && page<totalPage-1 && totalPage!=1" class="tfooter-page tfooter-page--selected">{{page}}</div>
                            <div v-show="page<totalPage-1 && totalPage>5 && totalPage!=1" class="tfooter-page">...</div>
                            <div v-show="page>=totalPage-1 && totalPage!=1" :class="{'tfooter-page--selected':page == totalPage-2}" class="tfooter-page">{{totalPage-2}}</div>
                            <div v-show="(page>=totalPage-1 || totalPage==5) && totalPage!=1" :class="{'tfooter-page--selected':page == totalPage-1}" class="tfooter-page">{{totalPage-1}}</div>
                            <div v-show="totalPage!=1" :class="{'tfooter-page--selected':page == totalPage}" class="tfooter-page">{{totalPage}}</div>
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
import DSearch from '@/components/base/DSearch.vue'
import DTooltip from '@/components/base/DTooltip.vue'
import AssetDetail from './AssetDetail.vue'
import DCombobox from '../../components/base/DCombobox.vue'
import DDialog from '@/components/base/DDialog.vue'
import DToast from '@/components/base/DToast.vue'
import Resource from '../../js/resource.js'


export default {
  components: { DButton, DSearch, DTooltip, AssetDetail, DCombobox, DDialog, DToast },
  name:"AssetList",
  props: {
    
  },
  computed: {
    api : function() {
        return "https://localhost:7182/api/v1/Assets/filter?limit="+this.tableView+"&page="+this.page
    }
  },
  methods: {
    btnAddOnClick() {
        this.asSelected = {}
        this.dialogShow = true
        this.title = Resource.DialogTitle.add
    },
    btnDeleteOnClick() {
        this.deleteShow = true
    },
    closeDelete() {
        this.deleteShow = false
    },
    confirmDelete() {
        this.deleteShow = false
        // Xóa tài sản
        
    },
    hideDialogMethod () {
        this.dialogShow = false
        this.loadData()
    },
    hideDialogSuccessMethod() {
        this.dialogShow = false
        this.loadData()
        this.toastShow = true
        setTimeout(() => this.toastShow = false, 3000)
    },
    rowSelect(index) {
        this.rowSelected = index
    },
    rowEdit(asset) {
        this.asSelected = asset
        this.dialogShow = true
        this.detailFormMode = 2
        this.title = Resource.DialogTitle.edit
    },
    rowDuplicate(asset) {
        // Sinh ra mã tài sản mới

        this.asSelected = asset
        this.dialogShow = true
        this.title = Resource.DialogTitle.duplicate
    },
    checkedAllMethod() {
        try{
            this.checked = []
            this.checkboxSelected = []
            this.rowSelected = -1
            if (!this.checkedAll) {
                for (let index in this.assets) {
                    this.checked.push(this.assets[index].fixed_asset_id)
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
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
        } catch (error) {
            console.log(error);
        }
    },
    prevPage() {
        if(this.page > 1){
            this.page--
        this.loadData()
        }  
    },
    nextPage() {
        if(this.page < this.totalPage){
            this.page++
            this.loadData()
        }    
    },
    formatMoney(money) {
        try {
            money = new Intl.NumberFormat('de-DE', {}).format(money)
        return money
        } catch (error) {
            console.log(error);
        }  
    },
    loadData() {
        try{
            // Gọi api lấy dữ liệu
            this.isLoading = true
            fetch(this.api, {method:"GET"})
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
    totalPageMethod() {
        if(this.tableTotal <= this.tableView || this.tableView == -1) this.totalPage = 1
        else if(this.tableTotal%this.tableView==0) this.totalPage = this.tableTotal/this.tableView
        else this.totalPage = (this.tableTotal-(this.tableTotal%this.tableView))/this.tableView + 1
    }
  },
  created() {
    this.loadData()
  },
  data() {
    return {
        assets:[],
        isLoading: false,
        dialogShow: false,
        asSelected: {},
        detailFormMode: 1,
        rowSelected: -1,
        rowHover: -1,
        title: "Thêm tài sản",
        checkedAll: false,
        checked: [],
        checkboxSelected: [],
        deleteShow: false,
        toastShow: false,
        tableTotal: 0,
        tableView: 20,
        totalPage: 1,
        page: 1,
    }
  }
}
</script>

<style scoped>
    @import url('../../css/views/asset.css');
    @import url('../../css/base/table.css');
    @import url('../../css/base/dialog.css');
    @import url('../../css/base/loading.css');
    @import url('../../css/base/combobox.css');
    @import url('../../css/base/checkbox.css');
    @import url('../../css/base/toasttransition.css');
</style>