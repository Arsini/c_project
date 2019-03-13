<script>
// import RewardItem from '../reward_item';
import ATM from './recharge_bank_atm'
import BankCounters from './recharge_bank_bankCounters'
import OnlineBank from './recharge_bank_online_bank'
import Yun from './recharge_bank_yun'
import TransferBankOrder from '../transfer_bank_order_tpl';//转 银行卡
export default {
    components:{
        // RewardItem,
        ATM,
        BankCounters,
        OnlineBank,
        Yun,
        TransferBankOrder,
    },
    props:[
        'rewardList',
        'bankList',
    ],
    data(){
        return{
            payType: [],
            currentSelectType: '',
            currentBank: '',
            isHaveOrder: '',//1:无订单。 2： 有订单
            orderData: '',
            noPayType: '',// 1、无支付方式；2、有支付方式
        }
    },
    created(){
        this.$store.commit('TITLE_NAME', '充值')
        this.getCashRechargeStatus()
    },
    methods:{
        //获取手工充值状态，查看是否有订单
        getCashRechargeStatus(){
            this.$api.getCashRechargeStatus().then(res=>{
                const data = res.data;
                if(data){
                    this.formatTransferBankData(data)
                } else {
                    this.isHaveOrder = '2'
                }
                this.renderBankCard()
            })
        },

        //格式化 转银行卡页面数据
        formatTransferBankData(data){
            this.isHaveOrder = '1'
            const {
                proposalId,
                result,
                inputData,
                restTime,
            } = data;
            const { depositMethod } = inputData;
            const {
                cardOwner,
                bankCardNo,
                bankTypeId,
                openingPoint,
            } = result;
            const orderData = {
                proposalId,
                depositMethod,
                cardOwner,
                bankCardNo,
                bankTypeId,
                restTime,
                openingPoint,
            }
            if(depositMethod != 4 && depositMethod != 5 && depositMethod != 6){
                orderData.amount = inputData.amount
            } else {
                orderData.amount = data.result.changeAmount
                if(depositMethod == 6){
                    orderData.codeAddress = data.result.codeAddress
                }
            }
            this.orderData = orderData
        },

        //渲染手工存款
        renderBankCard(){
            // 1:网银转账  2:atm 3：银行柜台   4：支付宝转账  5：微信转账 6:云闪付 ----备注说明：可能其中之一存在了存款方式，但是data中无可用的银行类型。返回有改类型和该类型有银行卡才代表这个类型方式可以用
            if(this.bankList.length > 0){
                const onlineBank = this.bankList.find(e => e.depositMethod == 1 && e.data.length > 0);   // 1:网银转账 
                const ATM = this.bankList.find(e => e.depositMethod == 2 && e.data.length > 0);          //ATM
                const bankCounters = this.bankList.find(e => e.depositMethod == 3 && e.data.length > 0); //银行柜台
                const yun = this.bankList.find(e => e.depositMethod == 6 && e.data.length > 0);          //云闪付 
                if(onlineBank){
                    this.payType.push({
                        name: '网银转账',
                        maxDepositAmount: onlineBank.maxDepositAmount,
                        minDepositAmount: onlineBank.minDepositAmount || 100,
                        banks: onlineBank.data,
                        lastOnlineBankingName: onlineBank.lastOnlineBankingName,
                        icon: 'icon-cf-c48',
                    })
                }
                if(ATM){
                    this.payType.push({
                        name: 'ATM',
                        maxDepositAmount: ATM.maxDepositAmount,
                        minDepositAmount: ATM.minDepositAmount || 100,
                        lastDepositProviceId: ATM.lastDepositProviceId,
                        lastDepositCityId: ATM.lastDepositCityId,
                        banks: ATM.data,
                        icon: 'icon-atm',
                    })
                }
                if(bankCounters){
                    this.payType.push({
                        name: '银行柜台',
                        maxDepositAmount: bankCounters.maxDepositAmount,
                        minDepositAmount: bankCounters.minDepositAmount || 100,
                        banks: bankCounters.data,
                        icon: 'icon-cun',
                    })
                }
                if(yun){
                    this.payType.push({
                        name: '云闪付',
                        maxDepositAmount: yun.maxDepositAmount,
                        minDepositAmount: yun.minDepositAmount || 100,
                        banks: yun.data,
                        icon: 'icon-icon_sm',
                    })
                }
                if(this.payType.length > 0){
                    this.noPayType = 2
                    this.selectPayType(this.payType[0].name)
                } else {
                    this.noPayType = 1
                }
            } else {
                this.noPayType = 1
            }
        },

        //选择支付方式
        selectPayType(name){
            this.currentSelectType = this.payType.find(e => e.name == name);
        },

        //选择银行
        selectBank(bankTypeId){
            //过滤出银行卡最大
            const maxDepositAmount = (this.currentSelectType.banks).find(e => e.bankTypeId == bankTypeId).maxDepositAmount;
            this.currentSelectType.maxDepositAmount = maxDepositAmount
            this.currentBank = bankTypeId
        },
    },
    watch:{
        bankList(){
            this.renderBankCard()
        }
    },
}
</script>

<template>
    <div class="recharge_bank">
        <!-- 无支付方式 -->
        <div v-show='noPayType == 1 && !$store.state.windowLoading' class="no_pay_type">
            <h4>此充值渠道维护中，请先使用其他充值方式</h4>
            <p>This Recharge Channel Maintenance Please Use Other Charging Methods First</p>
        </div>
        
        <!-- 无订单 -->
        <div v-show="isHaveOrder == '2' && noPayType == 2">
            <h3 class="pay_type_title">请选择支付方式</h3>
            <div class="pay_type_box">
                <ul class="pay_type clearfix">
                    <li
                    v-for="(val, key) in payType"
                    :key="key"
                    @click="selectPayType(val.name)">
                        <div
                        :class="{ 'select_bank' : val.name == currentSelectType.name}"
                        class="pay_type_bg">
                            <i class="iconfont" :class="val.icon"></i>
                            <p>{{ val.name }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <h3 class="pay_type_title">请选择收款银行</h3>
            <div class="pay_type_box">
                <ul class="pay_type clearfix">
                    <li
                    v-for="item in currentSelectType.banks"
                    v-show="item.status == 1"
                    :key="item.id"
                    @click="selectBank(item.bankTypeId)">
                        <div
                        :class="{ 'select_bank' : item.bankTypeId == currentBank }"
                        class="pay_type_bg">
                            <i v-if="item.bankTypeId == 1" class="iconfont icon-gongshangyinhangicbcbank1193388easyiconnet"></i>
                            <i v-else-if="item.bankTypeId == 2" class="iconfont icon-nongyeyinxing"></i>
                            <i v-else-if="item.bankTypeId == 3" class="iconfont icon-zhongguoyinhangbank1193437easyiconnet"></i>
                            <i v-else-if="item.bankTypeId == 4" class="iconfont icon-jiansheyinxing"></i>
                            <i v-else-if="item.bankTypeId == 5" class="iconfont icon-jiaotongyinxing"></i>
                            <i v-else-if="item.bankTypeId == 6" class="iconfont icon-zhongxinyinxing"></i>
                            <i v-else-if="item.bankTypeId == 7" class="iconfont icon-guangdayinxing"></i>
                            <i v-else-if="item.bankTypeId == 8" class="iconfont icon-changyonglogo17"></i>
                            <i v-else-if="item.bankTypeId == 9" class="iconfont icon-guangfa"></i>
                            <i v-else-if="item.bankTypeId == 11" class="iconfont icon-zhaoshangyinhangbank1193432easyiconnet"></i>
                            <i v-else-if="item.bankTypeId == 12" class="iconfont icon-changyonglogo05"></i>
                            <i v-else-if="item.bankTypeId == 13" class="iconfont icon-pufayinxing"></i>
                            <i v-else-if="item.bankTypeId == 161" class="iconfont icon-youzhengyinxing"></i>
                            <i v-else-if="item.bankTypeId == 169" class="iconfont icon-minshengyinxing"></i>
                            <i v-else class="iconfont icon-yinxing"></i>
                            <p>{{ item.name }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <OnlineBank
            v-if="currentSelectType.name =='网银转账'"
            :rewardList='rewardList'
            :bankTypeId='currentBank'
            :currentSelectType='currentSelectType'
            @sendOrderData='formatTransferBankData'/>
            <ATM
            v-else-if="currentSelectType.name =='ATM'"
            :rewardList='rewardList'
            :bankTypeId='currentBank'
            :currentSelectType='currentSelectType'
            @sendOrderData='formatTransferBankData'/>
            <BankCounters
            v-else-if="currentSelectType.name =='银行柜台'"
            :rewardList='rewardList'
            :bankTypeId='currentBank'
            :currentSelectType='currentSelectType'
            @sendOrderData='formatTransferBankData'/>
            <Yun
            v-else-if="currentSelectType.name =='云闪付'"
            :rewardList='rewardList'
            :bankTypeId='currentBank'
            :currentSelectType='currentSelectType'
            @sendOrderData='formatTransferBankData'/>
        </div>

        <!-- 有订单 -->
        <TransferBankOrder
        @cancelOrderStatus="isHaveOrder = '2'"
        v-if="isHaveOrder == '1'"
        :orderData='orderData'/>
    </div>
</template>

<style lang="postcss">
    .recharge_bank{
        .pay_type_box{
            border-bottom: 1px solid #404040;
            .pay_type {
                li{
                    width: 23%;
                }
            }
        }
    }
</style>
