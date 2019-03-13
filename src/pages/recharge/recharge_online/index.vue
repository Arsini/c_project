<script>
import RewardItem from '../reward_item';
export default {
    components:{
        RewardItem,
    },
    props:[
        'onlineList',
        'rewardList',
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
            btnName: '下一步',
            payType: [],
            form: {
                amount: '',
            },
            rules: {
                amount: {
                    required: '请输充值金额',
                    validator: validateAmount,
                },
            },
            bonusCode: '',//优惠代码
            topUpReturnCode: '',//优惠礼包
            currentSelectType: '',
            noPayType: '',// 1、无支付方式；2、有支付方式
            paymentURL: '',
            confirmOrder: false,
            proposalId: '',
        }
    },
    created(){
        this.$store.commit('TITLE_NAME', '充值')
        this.renderOnlinePay()
    },
    methods: {
        //渲染 支付宝||微信 在线支付方式
        renderOnlinePay(){
            if(this.onlineList.length > 0){
                this.onlineList.forEach(e => {
                    const { maxDepositAmount, minDepositAmount, type, status, } = e;
                    const obj = {
                        maxDepositAmount,
                        minDepositAmount,
                        type,
                    }
                    const flag = type == 2 || type == 3 || type == 4 || type == 5 || type == 10 || type == 11 || type == 15;
                    if(!flag && status == 1){
                        switch(type){
                            case 1: obj.name = '网银支付'; this.payType.push(obj); break;
                            case 6: obj.name = '快捷支付'; this.payType.push(obj); break;
                            case 7: obj.name = 'QQ扫码'; this.payType.push(obj); break;
                            case 8: obj.name = '银联扫码'; this.payType.push(obj); break;
                            case 9: obj.name = '京东扫码'; this.payType.push(obj); break;
                            case 12: obj.name = 'QQWAP'; this.payType.push(obj); break;
                            case 14: obj.name = '京东wap'; this.payType.push(obj); break;
                            default: obj.name = `在线支付${type}`; this.payType.push(obj); break;
                        }
                    }
                });
                if(this.payType.length > 0){ 
                    this.selectPayType(this.payType[0].name)
                    this.noPayType = 2
                } else {
                    this.noPayType = 1
                }
            } else {
                this.noPayType = 1
            }
        },

        //
        selectPayType(name){
            this.currentSelectType = this.payType.find(e => e.name == name);
        },
        
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
                this.btnName = '正在生成订单...'
                const { amount, } = this.form;
                const data = {
                    amount,
                    bPMSGroup: true,
                    clientType: 2,
                    merchantUseType: 1,
                    topupType: this.currentSelectType.type,
                };
                if(this.bonusCode){
                    data.bonusCode = this.bonusCode
                } else if(this.topUpReturnCode){
                    data.topUpReturnCode = this.topUpReturnCode
                }
                this.$api.createOnlineTopupProposal(data).then(res=>{
                    const data = res.data;
                    this.paymentURL = data.topupDetail.paymentURL;
                    this.proposalId = data.proposalId;
                    this.confirmOrder = true
                    this.btnName = '下一步'
                },err=>{
                    open.close()
                    this.$refs['reward_item'].reset()
                    this.btnName = '下一步'
                })
            }
        },

        confirm(){
            this.confirmOrder = false
            window.open(this.paymentURL)
        }
    },
    watch:{
        onlineList(){
            this.renderOnlinePay()
        }
    }
}
</script>


<template>
    <div>
        <!-- 无支付方式 -->
        <div v-show='noPayType == 1 && !$store.state.windowLoading' class="no_pay_type">
            <h4>此充值渠道维护中，请先使用其他充值方式</h4>
            <p>This Recharge Channel Maintenance Please Use Other Charging Methods First</p>
        </div>

        <!-- 有支付方式 -->
        <div v-show='noPayType == 2'>
            <h3 class="pay_type_title">请选择支付方式</h3>
            <div class="pay_type_box clearfix">
                <ul class="pay_type clearfix">
                    <li
                    v-for="(val, key) in payType"
                    :key="key"
                    @click="selectPayType(val.name)">
                        <div
                        :class="{ 'select_online' : val.name == currentSelectType.name}"
                        class="pay_type_bg">
                            <i class="iconfont icon-yinlian"></i>
                            <p>{{ val.name }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <form class="account_form" autocomplete="off">
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
            </form>
        </div>

        <!-- 确认订单 -->
        <Dialog
		title='确认订单' 
		:visible='confirmOrder' 
		@close="confirmOrder = false">
			<div class="dialog_content recharge_online_pop" slot="body">
                <p>订单号：{{ proposalId }}</p>
                <p>充值金额：{{ form.amount }}</p>
            </div>
            <div class="btn_center" slot="footer">
				<button @click="confirm" class="btn btn_secondary">确定</button>
                <button @click="confirmOrder = false" class="btn btn_pop_cancel">取消</button>
			</div>
        </Dialog>
    </div>
</template>

<style lang="postcss">
    .recharge_online_pop{
        p{
            text-align: center;
            line-height: 26px;
        }
    }
</style>

