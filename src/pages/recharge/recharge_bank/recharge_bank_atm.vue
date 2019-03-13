<script>
import RewardItem from '../reward_item';
export default {
    components:{
        RewardItem,
    },
    props:[
        'rewardList',
        'bankTypeId',
        'currentSelectType',
    ],
    data(){
        //存款金额
        const validateAmount = (value, cb) => {
            const obj = this.rewardList.find(e => e.code == this.topUpReturnCode);
            const minTopUpAmount = obj? obj.minTopUpAmount : 0;
            if(!all.tool.isNumber(value)){
                cb('只能是整数')
                return false
            }else if(value < this.currentSelectType.minDepositAmount) {
                cb(`金额不能小于${ this.currentSelectType.minDepositAmount }元`)
                return false
            }else if(value > this.currentSelectType.maxDepositAmount){
                cb(`金额不能大于${ this.currentSelectType.maxDepositAmount }元`)
                return false
            }else if(value < minTopUpAmount){
                cb(`领取此优惠需要金额大于${ minTopUpAmount }元`)
                return false
            } else {
                cb()
            }
        }
        return{
            btnName:'下一步',
            form: {
                amount: '',
                provinceId:'',
                cityId: '',
            },
            rules: {
                amount: {
                    required: '请输充值金额',
                    validator: validateAmount,
                },
                provinceId:{
                    required: '省份不能为空'
                },
                cityId:{
                    required: '城市市不能为空'
                },
            },
            topUpReturnCode: '',
            bonusCode: '',
            provinceList: [],
            cityList: [],
        }
    },
    created(){
        this.$api.getProvinceList().then(res=>{
            this.provinceList = res.data
            this.$nextTick(()=>{
                this.autoProviceId()
            })
        })
    },
    methods:{
        //优惠代码
        rewardCode(code){
            this.topUpReturnCode = ''
            this.bonusCode = code
        },

        //存送礼包
        rewardGift(topUpReturnCode){
            this.bonusCode = ''
            this.topUpReturnCode = topUpReturnCode
        },
        //自动填充省
        autoProviceId(){
            const lastDepositProviceId = this.currentSelectType.lastDepositProviceId;
            if(lastDepositProviceId){
                this.form.provinceId = lastDepositProviceId
            }
        },
        //自动填充市
        autoCityId(){
            const lastDepositCityId = this.currentSelectType.lastDepositCityId;
            if(lastDepositCityId){
                this.form.cityId = lastDepositCityId
            }
        },
        //
        onSubmit(){
            if(all.tool.validateForm(this) && this.btnName == '下一步'){
                if(!this.bankTypeId){ 
                    this.msg('请选择收款银行。')
                    return
                }
                this.btnName = '正在生成订单...'
                const { amount, provinceId, cityId, } = this.form;
                const data = {
                    amount,
                    bPMSGroup: true,
                    bankTypeId: this.bankTypeId,
                    cityId,
                    depositMethod: 2,
                    provinceId,
                    clientType: 2,
                    supportMode: 'new',
                };
                if(this.bonusCode){
                    data.bonusCode = this.bonusCode
                } else if(this.topUpReturnCode){
                    data.topUpReturnCode = this.topUpReturnCode
                }
                this.$api.requestManualTopup(data).then(res=>{
                    this.$emit('sendOrderData', res.data)
                    this.btnName = '下一步'
                },err=>{
                    this.$refs['reward_item'].reset()
                    this.btnName = '下一步'
                })
            }
        }
    },
    watch: {
        'form.provinceId'() {
            this.$api.getCityList({provinceId: this.form.provinceId}).then(res=>{
                this.cityList = res.data
                this.$nextTick(()=>{
                    this.autoCityId()
                })
            })
        },
    },
}
</script>


<template>
    <form autocomplete="off" class="account_form">
            <h3 class="pay_type_title">请输入存款金额</h3>
            <FormItem
            icon='icon-qianqian-'
            :rule='rules.amount'
            :placeholder='`充值金额 ${ currentSelectType.minDepositAmount } - ${ currentSelectType.maxDepositAmount }`'
            ref='amount'
            type='tel'
            v-model="form.amount"/>
            <FormSelect
            :options='provinceList'
            :rule='rules.provinceId'
            v-model="form.provinceId"
            ref='provinceId'
            placeholder='请选择省'/>
            <FormSelect
            :options='cityList'
            :rule='rules.cityId'
            v-model="form.cityId"
            ref='cityId'
            placeholder='请选择市'/>
            <RewardItem
            ref="reward_item"
            @rewardCode='rewardCode'
            @rewardGift='rewardGift'
            :rewardList='rewardList'/>
            <div class="btn_center">
                <button @click.prevent="onSubmit" class="btn btn_primary">{{ btnName }}</button>
            </div>
    </form>
</template>
