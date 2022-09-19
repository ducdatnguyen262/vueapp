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
            <d-button @click="btnAddOnClick" id="btnAdd" text="Thêm tài sản" icon="add" class="mr-11"></d-button>
            <div class="position-relative">
                <d-button icon="excel" type="small" class="mr-11"></d-button>
                <d-tooltip text="Xuất"></d-tooltip>
            </div>
            <div class="position-relative">
                <d-button icon="delete" type="small"></d-button>
                <d-tooltip text="Xóa"></d-tooltip>
            </div>
        </div>
    </div>

    <!-- Table -->
    <div class="table">
        <table id="employeeTable" api="/">
            <thead>
                <tr>
                    <th><input v-model="checkedAll" @click="checkedAllMethod()" type="checkbox"></th>
                    <th>
                        <div class="position-relative">
                            STT
                            <d-tooltip text="Số thứ tự"></d-tooltip>
                        </div>
                    </th>
                    <th prop-name="CustomerCode">Mã tài sản</th>
                    <th prop-name="FullName">Tên tài sản</th>
                    <th format-date prop-name="DateOfBirth">Loại tài sản</th>
                    <th prop-name="FullName">Bộ phận sử dụng</th>
                    <th prop-name="Gender">Số lượng</th>
                    <th format-money prop-name="PhoneNumber">Nguyên giá</th>
                    <th format-money prop-name="PhoneNumber">                       
                        <div class="position-relative">
                            HM/KH lũy kế
                            <d-tooltip text="Hao mòn khấu hao lũy kế"></d-tooltip>
                        </div>
                    </th>
                    <th format-money prop-name="PhoneNumber">Giá trị còn lại</th>
                    <th>Chức năng</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(as, index) in assets" :key="as.CustomerId" :class="{'row--selected':(rowSelected == index), 'checkbox--selected':(checkboxSelected[index] == index)||checkedAll}" @click="this.rowSelected = index" @mouseover="rowHover = index" @mouseleave="rowHover = -1">
                    <td class="ms-table-right ms-table-fit">
                        <input v-model="checked" :value="as.CustomerId" @change="checkedMethod()" type="checkbox">
                    </td>
                    <td>{{index + 1}}</td>
                    <td>{{as.CustomerCode}}</td>
                    <td>{{as.FullName}}</td>
                    <td>{{as.FullName}}</td>
                    <td>{{as.FullName}}</td>
                    <td>{{as.Gender}}</td>
                    <td>{{formatMoney(as.PhoneNumber)}}</td>
                    <td>{{formatMoney(as.PhoneNumber)}}</td>
                    <td>{{formatMoney(as.PhoneNumber)}}</td>
                    <td>
                        <div class="table-function">
                            <div class="position-relative">
                                <div v-show="rowHover == index || rowSelected == index || checkedAll" @click="rowEdit(as)"  class="icon-edit"></div>
                                <d-tooltip text="Sửa"></d-tooltip>
                            </div>
                            <div class="position-relative">
                                <div v-show="rowHover == index || rowSelected == index || checkedAll" @click="rowDuplicate(as)" class="icon-duplicate"></div>
                                <d-tooltip text="Nhân bản" class="tool-tip--left"></d-tooltip>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6">
                        <div class="tfooter-left">
                            <div class="tfooter-text">Tổng số <b>200</b> bản ghi</div>
                            <div class="tfooter-total" style="font-size: 11px;">
                                <select style="font-size: 11px; padding: 4px 6px;">
                                    <option value="10">10</option>
                                    <option value="20" selected>20</option>
                                    <option value="100">100</option>
                                    <option value="all">All</option>
                                </select>
                            </div>
                            <div class="tfooter-prev position-relative">
                                <d-tooltip text="Trang trước" class="tool-tip--top"></d-tooltip>
                            </div>
                            <div class="tfooter-page tfooter-page--selected" style="margin-right: 7px;"><b>1</b></div>
                            <div class="tfooter-page">2</div>
                            <div class="tfooter-page" style="margin-right: 0 5px;">...</div>
                            <div class="tfooter-page">10</div>
                            <div class="tfooter-next position-relative">
                                <d-tooltip text="Trang sau" class="tool-tip--top"></d-tooltip>
                            </div>
                        </div>
                    </td>
                    <td><b>13</b></td>
                    <td><b>249.000.000</b></td>
                    <td><b>19.716.000</b></td>
                    <td><b>229.284.000</b></td>
                    <td><button @click="checkedMethod()"></button></td>
                </tr>
            </tfoot>
        </table>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
        <div class="loader"></div>
    </div>

    <!-- Dialog chi tiết tài sản -->
    <asset-detail v-if="dialogShow" :formMode="detailFormMode" :assetSelected="asSelected" @hideDialog="hideDialogMethod" :title="title"></asset-detail>

    <!-- Dialog cảnh báo -->

</template>

<script>
import DButton from '../../components/base/DButton.vue'
import DSearch from '@/components/base/DSearch.vue'
import DTooltip from '@/components/base/DTooltip.vue'
import AssetDetail from './AssetDetail.vue'
import DCombobox from '../../components/base/DCombobox.vue'


export default {
  components: { DButton, DSearch, DTooltip, AssetDetail, DCombobox },
  name:"AssetList",
  props: {
    
  },
  methods: {
    btnAddOnClick() {
        this.asSelected = {}
        this.dialogShow = true
        this.title = "Thêm tài sản"
    },
    hideDialogMethod () {
        this.dialogShow = false
        this.loadData()
    },
    rowEdit(asset) {
        this.asSelected = asset
        this.dialogShow = true
        this.detailFormMode = 2
        this.title = "Sửa tài sản"
    },
    rowDuplicate(asset) {
        // Sinh ra mã tài sản mới

        this.asSelected = asset
        this.dialogShow = true
        this.title = "Nhân bản tài sản"
    },
    checkedAllMethod() {
        this.checked = []
        this.checkboxSelected = []
        this.rowSelected = -1
        if (!this.checkedAll) {
            for (let index in this.assets) {
                this.checked.push(this.assets[index].CustomerId)
            }
        }
    },
    checkedMethod() {
        for (let i in this.checked) {
            for (let index in this.assets) {
                if (this.checked[i] == this.assets[index].CustomerId) {
                    this.checkboxSelected[index] = index
                }
            }
        }
    },
    myMethod: function(event) {
      if (event.target.checked) console.log("checked");
      else console.log("unchecked");
    },
    formatMoney(money) {
        money = new Intl.NumberFormat('de-DE', {}).format(money)
        return money
    },
    loadData() {
        // Gọi api lấy dữ liệu
        this.isLoading = true
        fetch("https://cukcuk.manhnv.net/api/v1/Customers", {method:"GET"})
        .then(res => res.json())
        .then(data => {
            this.assets = data
            // console.log(data);
            this.isLoading = false
        })
        .catch(res => {
            console.log(res);
            this.isLoading = false
        })
    },
  },
  created() {
    this.loadData()
  },
  data() {
    return {
        assets:[],
        isLoading:false,
        dialogShow:false,
        asSelected: {},
        detailFormMode: 1,
        rowSelected: -1,
        rowHover: -1,
        title: "Thêm tài sản",
        checkedAll: false,
        checked: [],
        checkboxSelected: [],
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
</style>