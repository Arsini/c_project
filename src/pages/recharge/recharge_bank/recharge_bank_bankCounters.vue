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
                realName: '',
            },
            rules: {
                amount: {
                    required: '请输充值金额',
                    validator: validateAmount,
                },
                realName: {
                    required: '请输入银行卡姓名',
                },
            },
            topUpReturnCode: '',
            bonusCode: '',
            transferType: '',
        }
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

        selectTransferType(name){
            this.transferType = name
        },

        //
        onSubmit(){
            if(all.tool.validateForm(this) && this.btnName == '下一步'){
                if(!this.bankTypeId){ 
                    this.msg('请选择收款银行。')
                    return
                }
                this.btnName = '正在生成订单...'
                const { amount, realName, } = this.form;
                const data = {
                    amount,
                    bPMSGroup: true,
                    bankTypeId: this.bankTypeId,
                    depositMethod: 3,
                    clientType: 2,
                    supportMode: 'new',
                };
                if(this.transferType == '银行卡'){
                    data.realName = realName
                }
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
        },
    }
}
</script>

<template>
    <div class="recharge_bank_bankCounters">
        <h3 class="pay_type_title">请选择转帐方式</h3>
        <div class="pay_type_box">
            <ul class="pay_type clearfix">
                <li @click="selectTransferType('银行卡')">
                    <div
                    :class="{ 'select_bank' : transferType == '银行卡'}"
                    class="pay_type_bg">
                        <i class="iconfont icon-card"></i>
                        <p>银行卡</p>
                    </div>
                </li>
                <li @click="selectTransferType('现金')">
                    <div
                     :class="{ 'select_bank' : transferType == '现金'}"
                    class="pay_type_bg">
                        <i class="iconfont icon-xianjin"></i>
                        <p>现金</p>
                    </div>
                </li>
            </ul>
        </div>
        
        <!-- 银行卡 -->
        <form v-if="transferType == '银行卡'" autocomplete="off" class="account_form">
            <h3 class="pay_type_title">请输入存款金额</h3>
            <FormItem
            icon='icon-qianqian-'
            :rule='rules.amount'
            :placeholder='`充值金额 ${ currentSelectType.minDepositAmount } - ${ currentSelectType.maxDepositAmount }`'
            ref='amount'
            type='tel'
            v-model="form.amount"/>
            <FormItem
            :rule='rules.realName'
            placeholder='请输入银行卡姓名'
            ref='realName'
            v-model="form.realName"/>
            <RewardItem
            @rewardCode='rewardCode'
            @rewardGift='rewardGift'
            :rewardList='rewardList'/>
        </form>
        <!-- 现金 -->
        <form v-if="transferType == '现金'" autocomplete="off" class="account_form">
            <h3 class="pay_type_title">请输入存款金额</h3>
            <!-- <p class="number">转账编号：100521</p> -->
            <FormItem
            icon='icon-qianqian-'
            :rule='rules.amount'
            :placeholder='`充值金额 ${ currentSelectType.minDepositAmount } - ${ currentSelectType.maxDepositAmount }`'
            ref='amount'
            v-model="form.amount"/>
            <RewardItem
            ref="reward_item"
            @rewardCode='rewardCode'
            @rewardGift='rewardGift'
            :rewardList='rewardList'/>
        </form>

        <div v-show="transferType" class="btn_center">
            <button @click.prevent="onSubmit" class="btn btn_primary">{{ btnName }}</button>
        </div>
    </div>
</template>

<style lang="postcss">
    .recharge_bank_bankCounters{
        .number{
            padding-bottom: 20px;
        }
    }
</style>

