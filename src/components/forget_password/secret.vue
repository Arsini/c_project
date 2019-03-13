<script>
export default {
    data(){
        return{
            form: {
                name: '',
                bankCard: '',
                userName: '',
                province: '',
                city: '',
                bank: '',
            },
            rules: {
                name: {
                    required: '请输入用户名',
                },
                bankCard: {
                    required: '请输入银行卡',
                },
                userName: {
                    required: '请输入请输入账号绑定银行卡姓名',
                },
                province: {
                    required: '请选择开户省份',
                },
                city: {
                    required: '请选择开户城市',
                },
                bank: {
                    required: '请选择银行',
                },
            },
            province: [],
            city: [],
            banks: [],
        }
    },
    created(){
        this.getProvinceList() // 获取省份列表
		this.banks = all.tool.GetSession('getBankTypeList').data;
    },
    methods:{
         // 获取省份列表
        getProvinceList(){
            this.$api.getProvinceList().then(res=>{
                this.province = res.data
            })
        },
        /**
         * 获取市列表
         */
        getCityList() {
            const data = { 
                provinceId: this.form.province,
            }
            this.$api.getCityList(data).then(res=>{
                this.city = res.data
            })
        },

        //
        onSubmit(){
            if(all.tool.validateForm(this)){
                const {
                    name,
                    bankCard,
                    userName,
                    city,
                    bank,
                } = this.form;
                const data = {
                    answer: [
                        {
                            quesNo: 1,
                            ans: bankCard,
                        },
                        {
                            quesNo: 2,
                            ans: userName,
                        },
                        {
                            quesNo: 3,
                            ans: city,
                        },
                        {
                            quesNo: 4,
                            ans: bank,
                        },
                    ],
                    name,
                }
                this.$api.resetPassword(data).then(res=>{
                    this.$emit('secretReset', res.data)
                })
            }
        }
    },
    watch:{
        'form.province'(){
            this.getCityList()
        }
    }
}
</script>


<template>
    <form class="white_form" >
        <FormItem
        icon='icon-zhanghu'
        :rule='rules.name'
        placeholder='请输入用户名(必填)'
        ref='name'
        v-model="form.name"/>
        <FormItem
        icon='icon-card'
        :rule='rules.bankCard'
        placeholder='请输入账号绑定银行卡后四位(必填)'
        ref='bankCard'
        v-model="form.bankCard"/>
        <FormItem
        icon='icon-iconmoban220'
        :rule='rules.userName'
        placeholder='请输入请输入账号绑定银行卡姓名(必填)'
        ref='userName'
        v-model="form.userName"/>
        <FormSelect
        v-model="form.province"
        :rule='rules.province'
        :options='province'
        placeholder='请选择开户省份(必选)'
        ref='province'/>
        <FormSelect
        v-model="form.city"
        :rule='rules.city'
        :options='city'
        placeholder='请选择开户城市(必选)'
        ref='city'/>
        <FormSelect
        v-model="form.bank"
        :rule='rules.bank'
        :options='banks'
        placeholder='请选择开户银行(必选)'
        ref='bank'/>
        <div class="btn_center">
            <button @click.prevent="onSubmit" class="btn btn_primary">重置密码</button>
        </div>
    </form>
</template>
