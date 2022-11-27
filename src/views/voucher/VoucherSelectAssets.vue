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
                            @keydown.f2="rowEdit(asset)" 
                            @keydown.up="prevItem" @keydown.down="nextItem" 
                            @focus="rowFocus=index" 
                            @click.exact="checkedMethodOnClick(index, asset.fixed_asset_id)"
                            @click.shift.exact="checkedMethodOnClickShift(index, asset.fixed_asset_id, $event)"
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
                    text="Hủy bỏ" 
                    type="white" 
                    class="mr-10" 
                    :id="'close-asset-detail'"
                    @click="btnCloseOnClick"
                />
                <d-button 
                    tabindex="113" 
                    text="Đồng ý" 
                    @click="btnSelectOnClick" 
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

    <!-- Toast thông báo thất bại -->
    <transition name="toast">
        <d-toast v-show="toastFailedShow" type="failed"></d-toast>
    </transition>
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
    props: {
        assetsNoDisplay: {
            type: Array
        },
    },

    data() {
        return {
            assets:[], // Mảng lưu các tài sản đang hiện
            assetsSelected:[], // Mảng lưu các tài sản được chọn
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
            toastFailedShow: false, // Hiển thị toast thông báo thất bại hay không
            localeCode: Resource.LanguageCode.VN, // Mã ngôn ngữ hiện tại
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
            return Resource.Url.Asset+"/filters?keyword="+this.keyword+"&departmentId="+this.departmentId+"&categoryId="+this.categoryId+"&limit="+this.tableView+"&page="+this.page+"&mode="+Enum.GetRecordMode.NotSelectedNotIncrement
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
     * Đóng dialog cảnh báo xóa tài sản
     * NDDAT (15/09/2022)
     */
    closeDelete() {
        document.getElementById(`table${this.rowFocus+1}`).focus()
        this.deleteShow = false
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
     * Tìm kiếm theo mã và tên tài sản
     * NDDAT (27/09/2022)
     * @param {String} keyword từ khóa tìm kiếm
     */
    searchMethod(keyword) {
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
        if (this.checkboxSelected[order] == code){
            this.checkboxSelected[order] = null
            this.assetsSelected[order] = null
        } 
        for (let i in this.checked) {
            for (let index in this.assets) {
                if (this.checked[i] == this.assets[index].fixed_asset_id) {
                    this.checkboxSelected[index] = this.assets[index].fixed_asset_id
                    this.assetsSelected[index] = this.assets[index]
                }
            }
        }
        this.checkedAllInspect()
    },

    /**
     * Check vào checkbox khi click vào dòng
     * NDDAT (15/11/2022)
     * @param {int} index số thứ tự dòng của checkbox
     * @param {int} code id của dòng chứa checkbox được click
     */
    checkedMethodOnClick(index, code) {
        this.rowSelected = index
        // Nếu dòng chọn đã check thì bỏ check
        if (this.checkboxSelected[index] == code){
            for (let i in this.checked) {
                if(this.checked[i] == this.checkboxSelected[index]) this.checked[i]=null
            }
            this.checkboxSelected[index] = null
            this.assetsSelected[index] = null
        }
        // Nếu dòng chọn chưa check thì check
        else {
            this.checked[this.checked.length] = code
        }
        // Cập nhật dãy checkboxSelected và assetsSelected lưu các dòng được check
        for (let i in this.checked) {
            for (let index in this.assets) {
                if (this.checked[i] == this.assets[index].fixed_asset_id) {
                    this.checkboxSelected[index] = this.assets[index].fixed_asset_id
                    this.assetsSelected[index] = this.assets[index]
                }
            }
        }
        this.checkedAllInspect()
    },

    /**
     * Check vào checkbox khi click vào dòng khi đang giữ Shift
     * NDDAT (15/11/2022)
     * @param {int} index số thứ tự dòng của checkbox
     * @param {int} code id của dòng chứa checkbox được click
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
            this.assetsSelected[index] = null
        }
        // Nếu dòng chọn chưa check thì check
        else {
            this.checked[this.checked.length] = code
        }
        // Cập nhật dãy checkboxSelected và assetsSelected lưu các dòng được check
        for (let i in this.checked) {
            for (let index in this.assets) {
                if (this.checked[i] == this.assets[index].fixed_asset_id) {
                    this.checkboxSelected[index] = this.assets[index].fixed_asset_id
                    this.assetsSelected[index] = this.assets[index]
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
                    if(i != nearIndex && i != index) this.checked[this.checked.length] = this.assets[i].fixed_asset_id
                    this.checkboxSelected[i] = this.assets[i].fixed_asset_id
                    this.assetsSelected[i] = this.assets[i]
                }
            else
                for(let i = index; i <= nearIndex; i++) {
                    if(i != nearIndex && i != index) this.checked[this.checked.length] = this.assets[i].fixed_asset_id
                    this.checkboxSelected[i] = this.assets[i].fixed_asset_id
                    this.assetsSelected[i] = this.assets[i]
                }
        }
        this.checkedAllInspect()
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
        money = new Intl.NumberFormat(this.localeCode, {}).format(money)
        return money
    },

    /**
     * Gọi api lấy dữ liệu
     * NDDAT (15/09/2022)
     */
    loadData() {
        try{
            // Chuyển danh sách tài sản thành danh sách id tài sản
            let assetids = this.assetsNoDisplay.map(function (obj) {
                return obj.fixed_asset_id;
            });

            // Gọi api lấy dữ liệu
            this.isLoading = true
            fetch(this.api, {method: Resource.Method.Post, headers:{'Content-Type': 'application/json'}, body: JSON.stringify(assetids)})
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
     * Xử lí sự kiện keyboard shortcut
     * NDDAT (12/10/2022)
     */
    keyboardEvent(e) {
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
            this.btnSelectOnClick()
            this.ctrlPressed = false
        }
        else if(e.which == Enum.KeyCode.F9 && this.ctrlPressed == true){
            this.btnCloseOnClick()
            this.ctrlPressed = false
        }
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
        this.btnSelectOnClick()
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
    btnSelectOnClick() {
        this.btnCloseOnClick()
        this.$emit("selectAssets", this.assetsSelected)
    },
  },
}
</script>

<style scoped>
    @import url('../../css/base/input.css');
    @import url('../../css/base/datepicker.css');
</style>