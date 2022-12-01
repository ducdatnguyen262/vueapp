<template>
    <!-- Content Menu -->
    <div class="content-menu">
        <h2 style="margin: 0">Ghi tăng tài sản</h2>
        <div class="content-btns">
            <d-button 
                tabindex="1" 
                text="Thêm" 
                class="mr-11"
                @click="btnAddOnClick" 
            />
            <div class="menuWarp">
                <d-button 
                    v-show="dividerPosition != Table1Expand"
                    tabindex="2"
                    class="menuExpand mr-11"
                    type="medium"
                    icon="menu"
                    icon2="down"
                    @click="menuSelect=!menuSelect"
                />
                <d-button 
                    v-show="dividerPosition == Table1Expand"
                    tabindex="2"
                    class="menuExpand mr-11"
                    type="medium"
                    icon="menuExpand"
                    icon2="down"
                    @click="menuSelect=!menuSelect"
                />
                <d-button 
                    v-show="menuSelect"
                    tabindex="3"
                    class="menuSelect mr-11"
                    style="top: 37px;"
                    text="Giao diện dọc"
                    type="medium"
                    icon="menuExpand"
                    @click="dividerPosition = Table1Normal"
                    @mouseup="menuSelect=!menuSelect"
                />
                <d-button 
                    v-show="menuSelect"
                    tabindex="4"
                    class="menuSelect mr-11"
                    style="top: 73px;"
                    text="Giao diện ngang"
                    type="medium"
                    icon="menu"
                    @click="dividerPosition = Table1Expand"
                    @mouseup="menuSelect=!menuSelect"
                />
            </div>           
        </div>
    </div>

    <div class="wrapper">
        <div v-show="dividerPosition != - Table1Toolbar - Table2Toolbar">
            <div class="content-menu content-menu--white">
                <div class="content-search">
                    <div class="search">
                        <div class="search__icon"></div>
                        <input 
                            v-model="search" 
                            tabindex="5" 
                            id="searchInput"
                            class="search__input search__input--long mr-11" 
                            type="text" 
                            placeholder="Tìm kiếm theo số chứng từ, nội dung"
                            @keypress.enter="searchMethod(search)"
                        >
                    </div>
                </div>
                <div class="content-btns">
                    <div v-show="checked.length > 1" class="position-relative">
                        <div @click="btnDeleteOnClick()" tabindex="6" class="button-no-border icon-delete"></div>
                        <d-tooltip text="Xóa"></d-tooltip>
                    </div>
                    <div class="position-relative">
                        <vue-excel-xlsx
                            tabindex="7"
                            class="button-no-border icon-print"
                            :data="vouchers"
                            :columns="columns"
                            :file-name="'Danh sách chứng từ'"
                            :file-type="'xlsx'"
                            :sheet-name="'Danh sách chứng từ'"
                            >
                        </vue-excel-xlsx>
                        <d-tooltip text="In"></d-tooltip>
                    </div>
                    <div class="position-relative">
                        <div class="button-no-border icon-option"></div>
                        <d-tooltip text="Tùy chọn"></d-tooltip>
                    </div>
                </div>
            </div>

            <!-- Table 1 -->
            <div class="table-container table-1" :style="{height: `${dividerPosition}vh`}">
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
                            <th>Mã chứng từ</th>
                            <th>Ngày chứng từ</th>
                            <th>Ngày ghi tăng</th>
                            <th>Tổng nguyên giá</th>
                            <th>Nội dung</th>
                            <th>Chức năng</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                        <tr v-for="(voucher, index) in vouchers" :key="voucher.voucher_id" 
                            tabindex="7" 
                            :id="'table'+index" 
                            :class="{'row--selected':(rowSelected == index), 'checkbox--selected':(checkboxSelected[index] == voucher.voucher_id) || checkedAll || rowFocus == index}" 
                            v-contextmenu:contextmenu
                            @click.right.exact="voucherSelected = voucher;"
                            @keydown.f2="rowEdit(voucher)" 
                            @keydown.delete="rowDelete(voucher.voucher_id)" 
                            @keydown.up="prevItem" @keydown.down="nextItem" 
                            @focus="rowFocus=index;voucherSelected=voucher;" 
                            @click.exact="checkedMethodOnClick(index, voucher.voucher_id)"
                            @click.shift.exact="checkedMethodOnClickShift(index, voucher.voucher_id, $event)"
                            @click.ctrl.exact="checkedMethodOnClickCtrl(index, voucher.voucher_id)"
                            @dblclick="rowEdit(voucher)"
                            @mouseenter="rowHover = index" 
                            @mouseleave="rowHover = -1"
                        >
                            <td class="ms-table-right ms-table-fit">
                                <input 
                                    v-model="checked" 
                                    :value="voucher.voucher_id" 
                                    type="checkbox"
                                    @click.stop 
                                    @change="checkedMethod(index, voucher.voucher_id)" 
                                >
                            </td>
                            <td>{{index + 1}}</td>
                            <td @click="rowEdit(voucher)" style="color:#1AA4C8">{{voucher.voucher_code}}</td>
                            <td>{{formatDate(voucher.voucher_date)}}</td>
                            <td>{{formatDate(voucher.increment_date)}}</td>
                            <td>{{formatMoney(voucher.cost)}}</td>
                            <td>{{voucher.description}}</td>
                            <td>
                                <div class="table-function">
                                    <div class="position-relative">
                                        <div @click="rowEdit(voucher)" class="button--icon-edit"></div>
                                        <d-tooltip text="Sửa"></d-tooltip>
                                    </div>
                                    <div class="position-relative">
                                        <div @click="rowDelete(voucher.voucher_id)" class="button--icon-delete"></div>
                                        <d-tooltip text="Xóa" class="tool-tip--left"></d-tooltip>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr style="height:auto;"></tr>
                    </tbody>
                    <el-empty v-if="totalCount==0" 
                        description="Không có dữ liệu"
                        style="position: absolute; top: calc(50% - 80px); left: calc(50% - 80px);" 
                        :image-size="80"
                    />
                    <tfoot class="tfoot tfoot--big">
                        <tr class="total-line">
                            <td colspan="5"></td>
                            <td colspan="1" class="plr-10"><b>{{formatMoney(totalCost)}}</b></td>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <td colspan="8">
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
        </div>

        <div v-show="dividerPosition != Table1Expand">
            <div class="content-menu content-menu-2--white">
                <h3 style="margin:10px 0">Thông tin chi tiết</h3>
                <div class="content-btns">
                    <div v-show="dividerPosition != - Table1Toolbar - Table2Toolbar" class="position-relative">
                        <div class="button-no-border icon-expand" @click="dividerPosition = - Table1Toolbar - Table2Toolbar;menuSelect=false"></div>
                        <d-tooltip text="Mở rộng"></d-tooltip>
                    </div>
                    <div v-show="dividerPosition == - Table1Toolbar - Table2Toolbar" class="position-relative">
                        <div class="button-no-border icon-shrink" @click="dividerPosition = Table1Normal"></div>
                        <d-tooltip text="Thu nhỏ"></d-tooltip>
                    </div>
                </div>
            </div>

            <!-- Table 2 -->
            <div class="table-container table-2" :style="{height: `${ContentSize - Table1Toolbar - Table2Toolbar - dividerPosition}vh`}">
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
                            <th>                       
                                <div class="position-relative">
                                    HM/KH lũy kế
                                    <d-tooltip text="Hao mòn khấu hao lũy kế"></d-tooltip>
                                </div>
                            </th>
                            <th>Giá trị còn lại</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                        <tr v-for="(asset, index) in assets" :key="asset.fixed_asset_id" 
                            tabindex="7" 
                            :id="'table'+index" 
                            :class="{'row--selected':(rowSelected2 == index), 'checkbox--selected':rowFocus2 == index}"
                            @keydown.up="prevItem" @keydown.down="nextItem" 
                            @focus="rowFocus2=index" 
                            @click="rowSelected2 = index"
                            @mouseover="rowHover = index" 
                            @mouseleave="rowHover = -1"
                        >
                            <td>{{index + 1}}</td>
                            <td>{{asset.fixed_asset_code}}</td>
                            <td :title="asset.fixed_asset_name">{{asset.fixed_asset_name}}</td>
                            <td :title="asset.department_name">{{asset.department_name}}</td>
                            <td>{{formatMoney(asset.cost)}}</td>
                            <td>{{formatMoney(asset.depreciation_year*asset.life_time)}}</td>
                            <td>{{formatMoney(asset.cost-asset.depreciation_year*asset.life_time<0 ? 0 : asset.cost-asset.depreciation_year*asset.life_time)}}</td>
                        </tr>
                        <tr style="height:auto;"></tr>
                    </tbody>
                    <el-empty v-if="totalCount2==0" 
                        description="Không có dữ liệu"
                        style="position: absolute; top: calc(50% - 70px); left: calc(50% - 80px);" 
                        :image-size="80"
                    />
                    <tfoot class="tfoot">
                        <tr class="total-line">
                            <td colspan="4">
                                <div class="tfooter-left">
                                    <div class="tfooter-text">Tổng số: <b>{{totalCount2}}</b> bản ghi</div>
                                </div>
                            </td>
                            <td colspan="1" class="plr-10"><b>{{formatMoney(totalCost2)}}</b></td>
                            <td colspan="1" class="plr-10"><b>{{formatMoney(totalDepreciation2)}}</b></td>
                            <td colspan="1" class="plr-10"><b>{{formatMoney(totalCost2 - totalDepreciation2)}}</b></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>    
    </div>


    <!-- Context Menu -->
    <v-contextmenu ref="contextmenu">
        <v-contextmenu-item @click="btnAddOnClick">Thêm</v-contextmenu-item>
        <v-contextmenu-item @click="rowEdit(voucherSelected)">Sửa</v-contextmenu-item>
        <v-contextmenu-item @click="rowDelete(voucherSelected.voucher_id)">Xóa</v-contextmenu-item>
    </v-contextmenu>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
        <div class="loader"></div>
    </div>

    <!-- Dialog chi tiết chứng từ -->
    <voucher-detail
        v-if="dialogShow" 
        :formMode="detailFormMode" 
        :voucherSelected="voucherSelected" 
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

    <!-- Dialog cảnh cáo lỗi từ backend -->
    <d-dialog-1-button
        v-if="backendError" 
        :text="backendErrorMsg"
        @closeNotify="this.backendError = false"
    />

    <!-- Toast thông báo thành công -->
    <transition name="toast">
        <d-toast v-show="toastShow" type="success"></d-toast>
    </transition>

    <!-- Toast thông báo xóa thành công -->
    <transition name="toast">
        <d-toast v-show="toastDeleteShow" type="successDelete"></d-toast>
    </transition>

    <!-- Toast thông báo thất bại -->
    <transition name="toast">
        <d-toast v-show="toastFailedShow" type="failed"></d-toast>
    </transition>
</template>

<script>
import DButton from '../../components/base/DButton.vue'
import DTooltip from '@/components/base/DTooltip.vue'
import VoucherDetail from './VoucherDetail.vue'
import DDialog from '@/components/base/DDialog.vue'
import DToast from '@/components/base/DToast.vue'
import Enum from '../../js/enum.js'
import Resource from '../../js/resource.js'
import DDialog1Button from '@/components/base/DDialog1Button.vue'


export default {
  components: { DButton, DTooltip, VoucherDetail, DDialog, DToast, DDialog1Button },
  name:"voucherList",

  data() {
    return {
        vouchers:[], // Mảng lưu các chứng từ đang hiện
        vouchersSelected:[], // Mảng lưu các chứng từ đang chọn
        voucherSelected: {}, // Chứng từ được chọn
        assets:[], // Mảng lưu các tài sản đang hiện
        search:"", // Lưu giá trị input tìm kiếm
        isLoading: false, // Có đang loading hay không
        dialogShow: false, // Hiển thị dialog hay không
        detailFormMode: Enum.FormMode.Add, // Loại của dialog chi tiết tài sản
        rowSelected: -1, // Dòng được chọn tạm thời (click) ở table 1
        rowSelected2: -1, // Dòng được chọn tạm thời (click) ở table 2
        rowHover: -1, // Dòng được hover
        rowFocus: 0, // Dòng được focus ở table-1
        rowFocus2: -1, // Dòng được focus ở table-2
        rowFocusDelete: [], // Chứa id của dòng được focus để xóa
        title: "", // Title của dialog dialog chi tiết tài sản
        checkedAll: false, // Có check toàn bộ checkbox hay không
        checked: [], // Danh sách các dòng được chọn (checkbox)
        checkboxSelected: [], // Danh sách các dòng được chọn (checkbox) với chỉ số trùng với chỉ số các dòng hiển thị
        deleteShow: false, // Hiển thị dialog cảnh báo xóa hay không
        deleteText:"", // Nội dung dialog cảnh báo xóa
        toastShow: false, // Hiển thị toast thông báo thành công hay không
        toastDeleteShow: false, // Hiển thị toast thông báo xóa thành công hay không
        toastFailedShow: false, // Hiển thị toast thông báo thất bại hay không
        tableView: 20, // Số trang hiển thị
        totalPage: 1, // Tổng số trang
        page: 1, // Trang đang chọn
        totalCount: 0, // Tổng số bản ghi
        totalCost: 0, // Tổng số nguyên giá
        tableView2: 20, // Số trang hiển thị bảng 2
        totalPage2: 1, // Tổng số trang bảng 2
        page2: 1, // Trang đang chọn bảng 2
        totalCount2: 0, // Tổng số bản ghi bảng 2
        keyword: "", // Từ khóa để tìm kiếm (theo số chứng từ và nội dung)
        backendError: false, // Có hiển thị dialog cảnh báo lỗi từ backend không
        backendErrorMsg: "", // Thông điệp trong cảnh báo lỗi backend
        dividerPosition: this.Table1Normal, // Độ dài bảng 1 với đơn vị vh
        ContentSize: Resource.VoucherListSize.Content, // Độ dài nội dung chính (ô tìm kiếm và 2 bảng)
        Table1Normal: Resource.VoucherListSize.Table1Normal, // Độ dài bảng 1
        Table1Expand: Resource.VoucherListSize.Table1Expand, // Độ dài bảng 1 mở rộng
        Table1Toolbar: Resource.VoucherListSize.Table1Toolbar, // Độ dài thanh toolbar bảng 1
        Table2Toolbar: Resource.VoucherListSize.Table2Toolbar, // Độ dài thanh toolbar bảng 2
        menuSelect: false, // Có mở rộng menu chọn cách hiển thị bảng hay không
        localeCode: Resource.LanguageCode.VN, // Mã ngôn ngữ hiện tại
        dateFormat: Resource.DateFormat.VN, // Định dạng ngày hiện tại
        columns : [ // Định dạng để Xuất (In)
                    {
                        label: "Mã chứng từ",
                        field: "voucher_code",
                    },
                    {
                        label: "Ngày chứng từ",
                        field: "voucher_date",
                        dataFormat: this.formatDate
                    },
                    {
                        label: "Ngày ghi tăng",
                        field: "increment_date",
                        dataFormat: this.formatDate
                    },
                    {
                        label: "Tổng nguyên giá",
                        field: "cost",
                        dataFormat: this.formatMoney
                    },
                    {
                        label: "Nội dung",
                        field: "description",
                    },
                ],
    }
  },

  created() {
    // Thực hiện gọi api lấy dữ liệu
    this.loadData()
    // Cài đặt keyboard shortcut
    window.addEventListener('keydown', function(e) {
        // Ctrl + F3 để focus ô tìm kiếm
        if(e.which == Enum.KeyCode.F3 && e.ctrlKey == true){
            document.getElementById(`searchInput`).focus()
        }
    });
  },

  updated() {
    // Đặt lại số trang khi tìm kiếm
    if(this.totalPage < this.page) {
        this.page = this.totalPage
        this.loadData()
    } 
  },

  watch: {
    rowFocus: {
        handler() {
            this.loadDetailData()
        }
    },
    totalCount: {
        handler(newVal) {
            // Khi không có bản ghi
            if(newVal == 0) {
                this.totalCount2 = 0
                this.assets = []
                this.resetChecked()
            }
        }
    },
  },

  computed: {
    // Tạo api lấy chứng từ
    api : function() {
        return Resource.Url.Voucher+"/filters?keyword="+this.keyword+"&limit="+this.tableView+"&page="+this.page
    },

    // Tạo api lấy chi tiết chứng từ
    getDetailApi : function() {
        if(this.vouchers[this.rowFocus])
            return Resource.Url.Voucher+"/detail/"+this.vouchers[this.rowFocus].voucher_id+"?limit=-1"
        else return -1;
    },
  },

  methods: {
    /**
     * Check vào checkbox khi click vào dòng
     * NDDAT (15/11/2022)
     * @param {number} index số thứ tự dòng của checkbox
     * @param {number} code id của dòng chứa checkbox được click
     */
    checkedMethodOnClick(index, code) {
        this.rowSelected = index
        // Khi chọn 1 dòng thì bỏ check các dòng
        this.checked = []
        // Nếu dòng chưa check thì sẽ check
        if (this.checkboxSelected[index] != code) this.checked[this.checked.length] = code
        // Cập nhật dãy checkboxSelected và vouchersSelected lưu các dòng được check
        this.checkboxSelected = []
        this.vouchersSelected = []
        for (let i in this.checked) {
            for (let index in this.vouchers) {
                if (this.checked[i] == this.vouchers[index].voucher_id) {
                    this.checkboxSelected[index] = this.vouchers[index].voucher_id
                    this.vouchersSelected[index] = this.vouchers[index]
                }
            }
        }
        this.checkedAllInspect()
    },
    
    /**
     * Check vào checkbox khi click vào dòng khi đang giữ Shift
     * NDDAT (15/11/2022)
     * @param {number} index số thứ tự dòng của checkbox
     * @param {number} code id của dòng chứa checkbox được click
     * @param {PointerEvent} event sự kiện click khi nhấn giữ shift
     */
    checkedMethodOnClickShift(index, code, event) {
        event.preventDefault();
        this.rowSelected = index
        // Nếu dòng chọn đã check thì bỏ check
        if (this.checkboxSelected[index] == code){
            for (let i in this.checked) {
                if(this.checked[i] == this.checkboxSelected[index]) this.checked[i]=null
            }
            this.checkboxSelected[index] = null
            this.vouchersSelected[index] = null
        }
        // Nếu dòng chọn chưa check thì check
        else {
            this.checked[this.checked.length] = code
        }
        // Cập nhật dãy checkboxSelected và vouchersSelected lưu các dòng được check
        for (let i in this.checked) {
            for (let index in this.assets) {
                if(index < this.vouchers.length){
                    if (this.checked[i] == this.vouchers[index].voucher_id) {
                        this.checkboxSelected[index] = this.vouchers[index].voucher_id
                        this.vouchersSelected[index] = this.vouchers[index]
                    }
                }
            }
        }
        
        if(this.checked.length > 1) {
            let nearIndex
            let min = null
            // Tìm vị trí gần nhất đã check so với ô đang check
            for (let i in this.checkboxSelected) {
                if(this.checkboxSelected[i]&&i!=index) {
                    if(min == null){
                        min = (i>=index) ? i-index : index-i
                        nearIndex = i
                    } 
                    let temp = (i>=index) ? i-index : index-i
                    if(temp < min) {
                        min = temp
                        nearIndex = i
                    }
                }
            }
            // Check các dòng ở giữa dòng vừa check và dòng check lần trước
            if(nearIndex < index)
                for(let i = nearIndex; i <= index; i++) {
                    if(i != nearIndex && i != index) this.checked[this.checked.length] = this.vouchers[i].voucher_id
                    this.checkboxSelected[i] = this.vouchers[i].voucher_id
                    this.vouchersSelected[i] = this.vouchers[i]
                }
            else
                for(let i = index; i <= nearIndex; i++) {
                    if(i != nearIndex && i != index) this.checked[this.checked.length] = this.vouchers[i].voucher_id
                    this.checkboxSelected[i] = this.vouchers[i].voucher_id
                    this.vouchersSelected[i] = this.vouchers[i]
                }
        }
        this.checkedAllInspect()
    },

    /**
     * Check vào checkbox khi click vào dòng khi đang giữ Ctrl
     * NDDAT (15/11/2022)
     * @param {number} index số thứ tự dòng của checkbox
     * @param {number} code id của dòng chứa checkbox được click
     */
    checkedMethodOnClickCtrl(index, code) {
        this.rowSelected = index
        // Nếu dòng chọn đã check thì bỏ check
        if (this.checkboxSelected[index] == code){
            for (let i in this.checked) {
                if(this.checked[i] == this.checkboxSelected[index]) this.checked[i]=null
            }
            this.checkboxSelected[index] = null
            this.vouchersSelected[index] = null
        }
        // Nếu dòng chọn chưa check thì check
        else {
            this.checked[this.checked.length] = code
        }
        // Cập nhật dãy checkboxSelected và vouchersSelected lưu các dòng được check
        for (let i in this.checked) {
            for (let index in this.assets) {
                if (this.checked[i] == this.vouchers[index].voucher_id) {
                    this.checkboxSelected[index] = this.vouchers[index].voucher_id
                    this.vouchersSelected[index] = this.vouchers[index]
                }
            }
        }
        this.checkedAllInspect()
    },

    /**
     * Nhấn button hiển thị dialog thêm tài sản 1
     * NDDAT (15/09/2022)
     */
    btnAddOnClick() { 
        this.voucherSelected = {}
        this.assets = []
        this.detailFormMode = Enum.FormMode.Add
        this.title = Resource.Title.Add
        this.dialogShow = true
    },

    /**
     * Nhấn button hiển thị dialog cảnh báo xóa tài sản
     * NDDAT (15/09/2022)
     */
    btnDeleteOnClick() {
        this.rowFocusDelete = this.checked
        this.deleteTextCreate()
        this.deleteShow = true
    },

    /**
     * Tạo text cho dialog cảnh báo xóa
     * NDDAT (26/09/2022)
     */
    deleteTextCreate() {
        if(this.checked.length > 1) this.deleteText = "<b>"+(this.checked.length>9 ? this.checked.length : "0"+this.checked.length)+"</b> chứng từ đã được chọn. Bạn có muốn xóa các chứng từ này khỏi danh sách?"
        else {
            var id = this.rowFocusDelete[0]
            for (let index in this.vouchers) {
                if (id == this.vouchers[index].voucher_id){
                    this.deleteText = "Bạn có muốn xóa chứng từ có mã <b>"+this.vouchers[index].voucher_code+"</b>?"
                    break;
                }
            } 
        }
    },

    /**
     * Xóa tài sản
     * NDDAT (07/10/2022)
     * @param {string} id ID tài sản đang focus
     */
    rowDelete(id) {
        this.rowFocusDelete[0] = id;
        this.deleteTextCreate()
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
     * Xác nhận xóa và đóng dialog cảnh báo xóa chứng từ
     * NDDAT (22/11/2022)
     */
    confirmDelete() {
        // Xóa chứng từ
        if(this.rowFocusDelete.length > 0) {
            if(this.rowFocusDelete[0]){
                try{
                    // Xóa dữ liệu:
                    var url = Resource.Url.Voucher + "/batch-delete"
                    var body = this.rowFocusDelete
                    this.isLoading = true
                    fetch(url, {method: Resource.Method.Post, headers:{ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}`}, body: JSON.stringify(body)})
                    .then(res =>{
                        var status = res.status
                        switch(status) {
                            case 400: 
                                this.backEndErrorNotify(Resource.ErrorCode[400])
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
                                this.addArray = []
                                this.deleteArray = []
                                this.closeDelete()
                                this.loadData()
                                this.rowFocus = 0
                                this.rowFocusDelete = []
                                this.checked = []
                                this.isLoading = false
                                this.toastDeleteShow = true
                                setTimeout(() => this.toastDeleteShow = false, 3000)
                        }
                    })
                    .catch(res => {
                        console.error(res);
                        this.closeDelete()
                        this.isLoading = false
                        this.toastFailedShow = true
                        setTimeout(() => this.toastFailedShow = false, 3000)
                    })
                } catch (error) {
                    console.error(error);
                    this.closeDelete()
                    this.isLoading = false
                    this.toastFailedShow = true
                    setTimeout(() => this.toastFailedShow = false, 3000)
                }
            }
        }
    },

    /**
     * Ẩn dialog chi tiết tài sản
     * NDDAT (15/09/2022)
     */
    hideDialogMethod() {
        this.dialogShow = false
        this.loadData()
    },

    /**
     * Hiện thông báo thêm thành công và ẩn dialog chi tiết tài sản
     * NDDAT (15/09/2022)
     */
    hideDialogSuccessMethod() {
        this.rowFocus = 0
        this.resetChecked()
        this.hideDialogMethod()
        this.toastShow = true
        setTimeout(() => this.toastShow = false, 3000)
    },

    /**
     * Nhấn button hiển thị dialog sửa tài sản
     * NDDAT (15/09/2022)
     * @param {Voucher} voucher chứng từ đang chọn
     */
    rowEdit(voucher) {
        this.voucherSelected = voucher
        this.detailFormMode = Enum.FormMode.Edit
        this.title = Resource.Title.Edit
        this.dialogShow = true
    },

    /**
     * Tìm kiếm theo mã và tên tài sản
     * NDDAT (27/09/2022)
     * @param {string} keyword từ khóa tìm kiếm
     */
    searchMethod(keyword) {
        this.keyword = keyword
        this.rowFocus = 0
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
        this.rowSelected2 = -1
    },

    /**
     * Click vào checkbox đầu bảng để chọn toàn bộ bảng
     * NDDAT (15/09/2022)
     */
    checkedAllMethod() {
        this.resetChecked()
        if (!this.checkedAll) {
            for (let voucher of this.vouchers) {
                this.checked.push(voucher.voucher_id)
            }
        }
    },

    /**
     * Kiểm tra có cần checkbox toàn bộ không
     * NDDAT (09/11/2022)
     */
    checkedAllInspect() {
        if(this.vouchers.length > 0) {
            let checkall = true
            for (let voucher of this.vouchers) {
                let match = false
                for (let check of this.checked) {
                    if(match == true) break
                    if(voucher.voucher_id == check){
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
     * @param {number} order số thứ tự dòng của checkbox
     * @param {number} code id của dòng chứa checkbox được click
     */
    checkedMethod(order, code) {
        if (this.checkboxSelected[order] == code){
            this.checkboxSelected[order] = null
            this.vouchersSelected[order] = null
        } 
        for (let i in this.checked) {
            for (let index in this.vouchers) {
                if (this.checked[i] == this.vouchers[index].voucher_id) {
                    this.checkboxSelected[index] = this.vouchers[index].voucher_id
                    this.vouchersSelected[index] = this.vouchers[index]
                }
            }
        }
        this.checkedAllInspect()
    },

    /**
     * Focus vào item trước đó
     * NDDAT (07/10/2022)
     * @param {Event} e sự kiện ấn mũi tên lên
     */
    prevItem(e) {
        if(e.target.previousElementSibling){
            e.target.previousElementSibling.focus()
        }
    },

    /**
     * Focus vào item tiếp theo
     * NDDAT (07/10/2022)
     * @param {Event} e sự kiện ấn mũi tên xuống
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
            this.rowFocus = 0;
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
            this.rowFocus = 0;
            this.loadData()
        }    
    },

    /**
     * Tới trang được chọn
     * NDDAT (25/09/2022)
     * @param {number} page số trang
     */
    toPage(page) {
        this.page = page
        this.rowFocus = 0;
        this.loadData()
    },

    /**
     * Tính tổng số trang của bảng
     * NDDAT (12/11/2022)
     */
    totalPageMethod() {
        // table-1
        if(this.totalCount <= this.tableView || this.tableView == -1) this.totalPage = 1
        else if(this.totalCount%this.tableView==0) this.totalPage = this.totalCount/this.tableView
        else this.totalPage = (this.totalCount-(this.totalCount%this.tableView))/this.tableView + 1
        
        //table-2
        if(this.totalCount2 <= this.tableView2 || this.tableView2 == -1) this.totalPage2 = 1
        else if(this.totalCount2%this.tableView2==0) this.totalPage2 = this.totalCount2/this.tableView2
        else this.totalPage2 = (this.totalCount2-(this.totalCount2%this.tableView2))/this.tableView2 + 1
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
        money = new Intl.NumberFormat(this.localeCode, {}).format(money)
        return money
    },

    /**
     * Định dạng ngày tháng
     * NDDAT (18/10/2022)
     * @param {string} date số tiền
     */
    formatDate(date) {
        const dateFormat = new Date(date)
        let day = dateFormat.getDate().toString().padStart(2, "0")
        let month = (dateFormat.getMonth() + 1).toString().padStart(2, "0")
        let year = dateFormat.getFullYear()
        if(this.dateFormat == Resource.DateFormat.VN) return day + '/' + month + '/' + year
        if(this.dateFormat == Resource.DateFormat.US) return month + '/' + day + '/' + year
    },

    /**
     * Gọi api lấy dữ liệu
     * NDDAT (15/09/2022)
     */
    loadData() {
        try{
            // Gọi api lấy dữ liệu
            this.isLoading = true
            fetch(this.api, {method: Resource.Method.Get , headers:{'Authorization': `Bearer ${localStorage.getItem("token")}`}})
            .then(res => res.json())
            .then(data => {
                this.vouchers = Object.values(data)[0]
                this.totalCount = Object.values(data)[1]
                this.totalCost = Object.values(data)[3]
                this.totalPageMethod()
                this.checkedAllInspect()
                this.loadDetailData()
                this.isLoading = false
            })
            .catch(res => {
                console.error(res);
                this.isLoading = false
                this.toastFailedShow = true
                setTimeout(() => this.toastFailedShow = false, 3000)
            })
        } catch (error) {
            console.error(error);
            this.isLoading = false
            this.toastFailedShow = true
            setTimeout(() => this.toastFailedShow = false, 3000)
        }
    },

    /**
     * Gọi api lấy dữ liệu các tài sản khi chọn 1 chứng từ
     * NDDAT (15/09/2022)
     */
    loadDetailData() {
        if(this.getDetailApi != -1) {
            try{
                // Gọi api lấy dữ liệu
                this.isLoading = true
                fetch(this.getDetailApi, {method: Resource.Method.Get, headers:{'Authorization': `Bearer ${localStorage.getItem("token")}`}})
                .then(res => res.json())
                .then(data => {
                    this.assets = Object.values(data)[0]
                    this.totalCount2 = Object.values(data)[1]
                    this.totalCost2 = Object.values(data)[3]
                    this.totalDepreciation2 = Object.values(data)[4]
                    this.totalPageMethod()
                    this.checkedAllInspect()
                    this.isLoading = false
                })
                .catch(res => {
                    console.error(res);
                    this.isLoading = false
                    this.toastFailedShow = true
                    setTimeout(() => this.toastFailedShow = false, 3000)
                })
            } catch (error) {
                console.error(error);
                this.isLoading = false
                this.toastFailedShow = true
                setTimeout(() => this.toastFailedShow = false, 3000)
            }
        }
    },
  },
}
</script>

<style scoped>
    @import url('../../css/views/voucher.css');
</style>