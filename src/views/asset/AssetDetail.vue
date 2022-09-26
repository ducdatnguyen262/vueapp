<template>
    <div class="dialog-container">
        <div class="dialog dialog--form">
            <div class="dialog__header">
                <h2 class="dialog-title">{{title}}</h2>
                <button ref="btnx" class="dialog-x-container">
                    <div @click="btnCloseOnClick" class="dialog-x"></div>
                </button>
            </div>
            <div class="dialog__content">
                <div class="dialog-item">
                    <label>Mã tài sản <span style="color: red;">*</span></label>
                    <input v-model="asset.fixed_asset_code" ref="asset_code" class="dialog-input" type="text">
                </div>
                <div class="dialog-item">
                    <label>Tên tài sản <span style="color: red;">*</span></label>
                    <input v-model="asset.fixed_asset_name" class="dialog-input dialog-input-big" type="text" placeholder="Nhập tên tài sản">
                </div>
                <div class="dialog-item">
                    <label>Mã bộ phận sử dụng <span style="color: red;">*</span></label>
                    <d-combobox placeholder="Chọn mã bộ phận sử dụng"></d-combobox>
                </div>
                <div class="dialog-item">
                    <label>Tên bộ phận sử dụng</label>
                    <input class="dialog-input dialog-input-big" type="text" disabled>
                </div>
                <div class="dialog-item">
                    <label>Mã loại tài sản <span style="color: red;">*</span></label>
                    <d-combobox placeholder="Chọn mã loại tài sản"></d-combobox>
                </div>
                <div class="dialog-item">
                    <label>Tên loại tài sản</label>
                    <input class="dialog-input dialog-input-big" type="text" disabled>
                </div>
                <div class="dialog-item">
                    <label>Số lượng <span style="color: red;">*</span></label>
                    <input v-model="asset.quantity" class="dialog-input" type="number" min="0" oninput="this.value = !!this.value && Math.abs(this.value)">
                </div>
                <div class="dialog-item">
                    <label>Nguyên giá <span style="color: red;">*</span></label>
                    <input v-model="asset.cost" class="dialog-input" type="number" min="0" oninput="this.value = !!this.value && Math.abs(this.value)">
                </div>
                <div class="dialog-item">
                    <label>Tỉ lệ hao mòn (%) <span style="color: red;">*</span></label>
                    <input v-model="asset.depreciation_rate" class="dialog-input" type="number" min="0" oninput="this.value = !!this.value && Math.abs(this.value)">
                </div>
                <div class="dialog-item">
                    <label>Ngày mua <span style="color: red;">*</span></label>
                    <el-date-picker class="datepicker" v-model="asset.purchase_date" type="date"/>
                </div>
                <div class="dialog-item">
                    <label>Ngày bắt đầu sử dụng <span style="color: red;">*</span></label>
                    <el-date-picker class="datepicker" v-model="asset.production_date" type="date"/>
                </div>
                <div class="dialog-item">
                    <label>Năm theo dõi</label>
                    <input v-model="asset.tracked_year" class="dialog-input" type="number" disabled>
                </div>
                <div class="dialog-item">
                    <label>Số năm sử dụng <span style="color: red;">*</span></label>
                    <input v-model="asset.life_time" class="dialog-input" type="number" min="0" oninput="this.value = !!this.value && Math.abs(this.value)">
                </div>
                <div class="dialog-item">
                    <label>Giá trị hao mòn năm <span style="color: red;">*</span></label>
                    <input v-model="asset.PhoneNumber" class="dialog-input" type="number" min="0" oninput="this.value = !!this.value && Math.abs(this.value)">
                </div>
            </div>
            <div class="dialog__footer">
                <DButton @click="btnCloseOnClick" text="Hủy" type="white" class="mr-10"></DButton>
                <DButton @click="btnSaveOnClick" text="Lưu" @keydown.tab="focusBack()"></DButton>
            </div>
        </div>
    </div>
    <d-dialog-1-button v-if="validateShow" @closeNotify="closeValidateMethod" :text="errorMessage"></d-dialog-1-button>
    <d-dialog v-if="notifyShow" @closeNotify="closeNotifyMethod" @confirmNotify="confirmNotifyMethod" text="Bạn có muốn hủy bỏ khai báo tài sản này?" textbtn="Hủy bỏ"></d-dialog>
</template>

<script>
import DCombobox from '@/components/base/DCombobox.vue';
import DButton from '@/components/base/DButton.vue';
import useValidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import DDialog from '@/components/base/DDialog.vue';
import DDialog1Button from '../../components/base/DDialog1Button.vue';
    
export default {
    name:"AssetDetail",
    components: { DCombobox, DButton, DDialog, DDialog1Button },
    props: {
        assetSelected: Function,
        formMode: {
            type: Number,
            default: 1
        },
        title: String,
    },
    created() {
        // Lấy tài sản là tài sản được truyền vào
        this.asset = this.assetSelected
    },
    mounted() {
        // Focus vào ô đầu của dialog
        this.focusFirst()
    },
    data() {
        return {
            asset: {}, // Lưu dữ liệu tài sản
            notifyShow: false, // Có hiển thị dialog cảnh báo hay không
            v$: useValidate(), // Validate dữ liệu (sử dụng vuelidate)
            errorArray: [], // Dãy chứa các lỗi validate
            errorMessage: "", // Thông điệp hiện trong dialog cảnh báo lỗi validate
            validateShow: false, // Có hiển thị dialog cảnh báo lỗi validate hay không
            api: "https://localhost:7182/api/v1/Assets", // API lấy tài sản
        }
    },
    validations() {
        return {
            // asset: { required },
            asset: { 
                fixed_asset_code: { required },
                fixed_asset_name: { required },
             },
        }
    },
    methods: {
        /**
         * Đóng dialog cảnh báo lỗi validate
         * NDDAT (19/07/2022)
         */
        closeValidateMethod() {
            this.validateShow = false
        },

        /**
         * Tạo thông điệp cho dialog cảnh báo lỗi validate
         * NDDAT (19/07/2022)
         */        
        createValidateMessage() {
            try{
                this.errorMessage = "Cần phải nhập thông tin: "
                for(let i in this.errorArray) {
                    this.errorMessage = this.errorMessage + this.errorArray[i]
                    if(i != this.errorArray.length - 1) this.errorMessage = this.errorMessage +", "
                }
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * Đóng dialog cảnh báo
         * NDDAT (15/07/2022)
         */
        closeNotifyMethod() {
            this.notifyShow = false
        },

        /**
         * Xác nhận và đóng dialog cảnh báo
         * NDDAT (15/07/2022)
         */
        confirmNotifyMethod() {
            this.closeNotifyMethod()
            this.$emit("hideDialog")
        },

        /**
         * Focus vào phần tử đầu tiên
         * NDDAT (15/07/2022)
         */
        focusFirst() {
            this.$refs.asset_code.focus()
        },

        /**
         * Chuyển focus lên đầu sau khi đến cuối dialog tài sản
         * NDDAT (15/07/2022)
         */
        focusBack() {
            this.$refs.btnx.focus()
        },

        /**
         * Click vào button để đóng dialog tài sản
         * NDDAT (15/07/2022)
         */
        btnCloseOnClick() {
            // Hiện cảnh báo có muốn đóng hay không
            this.notifyShow = true
        },

        /**
         * Click vào button để lưu tài sản
         * NDDAT (15/07/2022)
         */
        btnSaveOnClick() {
            try{
                var method = "POST"
                var url = this.api
                // Validate dữ liệu:
                this.v$.$validate()
                if (this.v$.$error) {
                    this.errorArray = []
                    if (this.v$.asset.fixed_asset_code.$error) this.errorArray.push("mã tài sản\n");
                    if (this.v$.asset.fixed_asset_name.$error) this.errorArray.push("tên tài sản");
                    this.createValidateMessage()
                    this.validateShow = true
                } else {
                    // Cất dữ liệu:
                    console.log(1);
                    if(this.formMode == 2) {
                        method = "PUT"
                        url = url + `/${this.asset.fixed_asset_id}`
                    }
                    fetch(url, {method: method, headers:{ 'Content-Type': 'application/json'}, body: JSON.stringify(this.asset)})
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
                                this.$emit("hideDialogSuccess")
                        }
                    })
                    .catch(res => {
                        console.log(res);
                        alert("Failed")
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped>
@import url('../../css/base/input.css');
@import url('../../css/base/datepicker.css');
</style>