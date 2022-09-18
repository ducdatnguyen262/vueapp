<template>
    <div>
        {{name}}<br/>
        <input type="text" :value="number">
        <input :class="{'border-red':!isValid}" @input="inputOnChange" type="text" v-model="name"><br/>
        <div v-if="isShow">v-if-text</div>
        <div v-show="isShow">v-show-text</div>
        <button @click="btnSaveOnClick">Luu</button>
        <div>
            {{upperCaseFullName}}
            {{methodUpperCaseFullName(this.name)}}
        </div>
        <ul>
            <li v-for="(item, index) in items" :key="item.ItemCode">{{index}} - {{item.ItemCode}} - {{methodUpperCaseFullName(item.FullName)}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name:"OverviewList",
    components:{},
    props:["fullName"],
    // 1. Before Create
    beforeCreate() {
        // console.log("1. Before Create");
    },
    mounted() {
        // console.log("4. Mounted");
    },
    methods: {
        btnSaveOnClick() {
            this.isShow = !this.isShow
        },
        inputOnChange() {
            var name = this.name
            if (name == "Ho Chi Minh") {
                this.isValid = false
            } else {
                this.isValid = true
            }
        },
        methodUpperCaseFullName(name) {
            return name.toUpperCase()
        }
    },
    watch: {
        name: function(newValue, oldValue) {
            console.log("New:" + newValue);
            console.log("Old:" + oldValue);
        }
    },
    computed: {
        upperCaseFullName:function() {
            return this.name.toUpperCase()
        }
    },
    data() {
        return {
            items: [
                {ItemCode: "I001", FullName: "Nguyen Duc Dat 1"},
                {ItemCode: "I002", FullName: "Nguyen Duc Dat 2"},
                {ItemCode: "I003", FullName: "Nguyen Duc Dat 3"},
                {ItemCode: "I004", FullName: "Nguyen Duc Dat 4"}
            ],
            titlePage:"Tong quan 1",
            number:1,
            name:"Nguyen Duc Dat",
            isShow: true,
            isValid: true
        }
    },
}
</script>

<style scoped>
.border-red {
    outline: none;
    border: 1px solid red;
}
</style>