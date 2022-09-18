<template>
    <div id="assetDetail" class="dialog-container">
        <div class="dialog dialog--form">
            <div class="dialog__header">
                <h2 id="dialog-title" class="dialog-title">{{title}}</h2>
                <div @click="btnCloseOnClick" id="btnXForm" class="dialog-x"></div>
            </div>
            <div class="dialog__content">
                <div class="dialog-item">
                    <label>Mã tài sản <span style="color: red;">*</span></label>
                    <input id="txtEmployeeCode" v-model="asset.CustomerCode" isRequired prop-name="CustomerCode" class="dialog-input" type="text">
                </div>
                <div class="dialog-item">
                    <label>Tên tài sản <span style="color: red;">*</span></label>
                    <input id="txtFullName" v-model="asset.FullName" isRequired prop-name="FullName" class="dialog-input dialog-input-big" type="text" placeholder="Nhập tên tài sản">
                </div>
                <div class="dialog-item">
                    <label>Mã bộ phận sử dụng <span style="color: red;">*</span></label>
                    <!-- <mcombobox id="cbxGender" api="https://cukcuk.manhnv.net/api/v1/CustomerGroups" text="CustomerGroupName" value="CustomerGroupId" placeholder="Chọn mã bộ phận sử dụng"></mcombobox> -->
                    <d-combobox id="cbxGender" placeholder="Chọn mã bộ phận sử dụng"></d-combobox>
                </div>
                <div class="dialog-item">
                    <label>Tên bộ phận sử dụng</label>
                    <input class="dialog-input dialog-input-big" type="text" disabled>
                </div>
                <div class="dialog-item">
                    <label>Mã loại tài sản <span style="color: red;">*</span></label>
                    <!-- <mcombobox id="cbxGender" api="https://cukcuk.manhnv.net/api/v1/CustomerGroups" text="CustomerGroupName" value="CustomerGroupId" placeholder="Chọn mã loại tài sản"></mcombobox> -->
                    <d-combobox id="cbxGender" placeholder="Chọn mã loại tài sản"></d-combobox>
                </div>
                <div class="dialog-item">
                    <label>Tên loại tài sản</label>
                    <input class="dialog-input dialog-input-big" type="text" disabled>
                </div>
                <div class="dialog-item">
                    <label>Số lượng <span style="color: red;">*</span></label>
                    <input v-model="asset.Gender" class="dialog-input" type="number">
                </div>
                <div class="dialog-item">
                    <label>Nguyên giá <span style="color: red;">*</span></label>
                    <input v-model="asset.PhoneNumber" class="dialog-input" type="number">
                </div>
                <div class="dialog-item">
                    <label>Tỉ lệ hao mòn (%) <span style="color: red;">*</span></label>
                    <input v-model="asset.Gender" class="dialog-input" type="number">
                </div>
                <div class="dialog-item">
                    <label>Ngày mua <span style="color: red;">*</span></label>
                    <input v-model="asset.DateOfBirth" class="dialog-input" type="date">
                </div>
                <div class="dialog-item">
                    <label>Ngày bắt đầu sử dụng <span style="color: red;">*</span></label>
                    <input v-model="asset.CreatedDate" class="dialog-input" type="date">
                </div>
                <div class="dialog-item">
                    <label>Năm theo dõi</label>
                    <input v-model="asset.Gender" class="dialog-input" type="number" disabled>
                </div>
                <div class="dialog-item">
                    <label>Số năm sử dụng <span style="color: red;">*</span></label>
                    <input v-model="asset.Gender" class="dialog-input" type="number">
                </div>
                <div class="dialog-item">
                    <label>Giá trị hao mòn năm <span style="color: red;">*</span></label>
                    <input v-model="asset.PhoneNumber" class="dialog-input" type="number">
                </div>
            </div>
            <div class="dialog__footer">
                <DButton @click="btnCloseOnClick" id="btnCloseForm" text="Hủy" type="white" class="mr-10"></DButton>
                <DButton @click="btnSaveOnClick" id="btnSave" text="Lưu"></DButton>
            </div>
        </div>
    </div>
    <d-dialog></d-dialog>
</template>

<script>
import DCombobox from '@/components/base/DCombobox.vue';
import DButton from '@/components/base/DButton.vue';
import useValidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import DDialog from '@/components/base/DDialog.vue';
// import Emun from '../../js/enum.js'
    
export default {
    name:"AssetDetail",
    components: { DCombobox, DButton, DDialog },
    props: {
        assetSelected: Function,
        formMode: {
            type: Number,
            default: 1
        },
        title: String,
    },
    created() {
        this.asset = this.assetSelected
    },
    data() {
        return {
            asset: {},
            v$: useValidate(),
        }
    },
    validations() {
        return {
            // asset: { required },
            asset: { 
                CustomerCode: { required },
                FullName: { required },
             },
        }
    },
    methods: {
        btnCloseOnClick() {
            this.$emit("hideDialog")
        },
        btnSaveOnClick() {
            var method = "POST"
            var url = "https://cukcuk.manhnv.net/api/v1/Customers"
            // Validate dữ liệu:
            console.log(this.v$);
            this.v$.$validate()
            if (this.v$.$error) {
                alert("Nhập thiếu thông tin")
            } else {
                // Cất dữ liệu:
    
                if(this.formMode == 2) {
                    method = "PUT"
                    url = url + `/${this.asset.CustomerId}`
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
                            alert("Success")
                            this.$emit("hideDialog")
                    }
                })
                .catch(res => {
                    console.log(res);
                    alert("Failed")
                })
            }
        }
    }
}
</script>

<style scoped>
@import url('../../css/base/input.css');
@import url('../../css/base/datepicker.css');
</style>