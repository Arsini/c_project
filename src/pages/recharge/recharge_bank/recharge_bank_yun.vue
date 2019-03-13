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
            },
            rules: {
                amount: {
                    required: '请输充值金额',
                    validator: validateAmount,
                },
            },
            topUpReturnCode: '',
            bonusCode: '',
            orderTips: false,
            orderData: {},
            data: '', //订单数据
            confirmUi: false,
            checkOrder: false,
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
                    depositMethod: 6,
                    clientType: 2,
                    supportMode: 'new',
                };
                if(this.bonusCode){
                    data.bonusCode = this.bonusCode
                } else if(this.topUpReturnCode){
                    data.topUpReturnCode = this.topUpReturnCode
                }
                this.$api.requestManualTopup(data).then(res=>{
                    const data = res.data;
                    this.orderTips = true
                    this.orderData = {
                        proposalId: data.proposalId,
                        amount: data.result.changeAmount,
                    }
                    this.data = data
                },err=>{
                    this.$refs['reward_item'].reset()
                    this.btnName = '下一步'
                })
            }
        },
        //
        confirmOrder(){
            if(this.checkOrder){
                this.$emit('sendOrderData', this.data)
                this.orderTips = false
                this.btnName = '下一步'
            } else {
                this.msg('请勾选我明白。')
                this.confirmUi = true
            }
        },
        //取消手工存款申请单
        cancelManualTopupRequest(){
            this.orderTips = false
            this.btnName = '正在取消订单...'
            this.$api.cancelManualTopupRequest({ proposalId: this.orderData.proposalId }).then(res=>{
                this.confirmUi = false
                this.btnName = '下一步'
                this.msg('取消订单成功。', 'success')
            })
        },
    }
}
</script>


<template>
    <form autocomplete="off" class="account_form recharge_bank_yun">
        <h3 class="pay_type_title">请输入存款金额</h3>
        <FormItem
        icon='icon-qianqian-'
        :rule='rules.amount'
        :placeholder='`充值金额 ${ currentSelectType.minDepositAmount } - ${ currentSelectType.maxDepositAmount }`'
        ref='amount'
        type='tel'
        v-model="form.amount"/>
        <RewardItem
        ref="reward_item"
        @rewardCode='rewardCode'
        @rewardGift='rewardGift'
        :rewardList='rewardList'/>
        <div class="btn_center">
            <button @click.prevent="onSubmit" class="btn btn_primary">{{ btnName }}</button>
        </div>
        <!-- 确认手工存款订单 -->
        <Dialog
		title='温馨提示' 
		:visible='orderTips' 
		@close="cancelManualTopupRequest">
			<div class="dialog_content" slot="body">
                <p>输入特定金额系统可更快查询到賬，本次的存款金额为{{ orderData.amount }}元（含小数点），如未存款{{ orderData.amount }}元，查询时间需要24小时。</p>
                <table>
                    <tr>
                        <td class="bg">订单号</td>
                        <td>{{ orderData.proposalId }}</td>
                    </tr>
                    <tr>
                        <td class="bg">存款金额</td>
                        <td class="red">{{ orderData.amount }}</td>
                    </tr>
                </table>
                <label class="confirm" :class="{'confirm_ui': confirmUi}">
                    <input class="checkbox" type="checkbox" v-model="checkOrder">我明白以上说明，将存款<span style="color: red;">{{ orderData.amount }}元</span>
                </label>
            </div>
            <div  class="btn_center" slot="footer">
                <button @click="confirmOrder" class="btn btn_secondary">确定</button>
                <button @click="cancelManualTopupRequest" class="btn btn_pop_cancel">取消订单</button>
			</div>
        </Dialog>
    </form>
</template>

<style lang="postcss">
    .recharge_bank_yun{
        .confirm_ui{
            border: 2px solid red;
        }
    }
</style>

