<script>
import RewardItem from '../reward_item';
import TransferBankOrder from '../transfer_bank_order_tpl';//转 银行卡
import TransferPersonOrder from '../transfer_person_order_tpl';//转 个人
import AlipayOrder from '../alipay_order';//转 个人
export default {
    components:{
        RewardItem,
        TransferBankOrder,
        TransferPersonOrder,
        AlipayOrder,
    },
    props:[
        'bankList',
        'getRequestListApi',
        'depositMethod',
        'personStatus',// 转个人
        'onlineList',
        'rewardList',
    ],
    data(){
        //存款金额
        const validateAmount = (value, cb) => {
            const obj = this.rewardList.find(e => e.code == this.topUpReturnCode);
            const minTopUpAmount = obj? obj.minTopUpAmount : 0;
            if(!all.tool.isNumber(value)){
                let temp = /[^0-9]/g;
                this.form.amount = this.form.amount.replace(temp, "")
                cb(' ')
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
            isHaveOrder: '',//1：无订单；2：有订单,手工充值；3：有订单,转个人; 4：转个人支付宝；
            payType: [],
            payTypeProcess: [],//支付方式渲染进度 bank: 转银行卡；person：转个人；online: 在线支付
            depositName: '',
            currentSelectType: '',
            form: {
                amount: '',
                alipayName: '',
            },
            rules: {
                amount: {
                    required: '请输充值金额',
                    validator: validateAmount,
                },
                alipayName:{
                    required: '请填写支付宝昵称/支付宝姓名'
                }
            },

            bonusCode: '',//优惠代码
            topUpReturnCode: '',//优惠礼包

            orderData: '',//订单信息

            orderTips: false,//订单确认
            checkOrder: false,//再次确认

            confirmUi: false,

            noPayType: '',// 1、无支付方式； 2；有支付方式

            alipayTip: false,
            alipayTip_msg: '',

            serviceCharge: false,
            serviceCharge_msg: '',

            onlinePaymentURL: '',
        }
    },
    created(){
        this.$store.commit('TITLE_NAME', '充值')
        this.depositName = this.depositMethod == '4'? '支付宝' : '微信'
        Promise.all([
            this.getCashRechargeStatus(), //获取手工充值状态，查看是否有订单
            this.getTopupRequestList(),//获取转个人申请单列表, 查看是否有订单
        ]).then(res=>{
            const transferPersonStatus = res.find((v,k) => k == 1 && v.data);//获取转个人申请单列表, 查看是否有订单
            const transferBankStatus = res.find((v,k) => k == 0 && v.data);//获取手工充值状态，查看是否有订单
            if(transferPersonStatus){//有订单,转个人
                const { 
                    proposalId,
                    data,
                    restTime,
                } = transferPersonStatus.data;
                const {
                    amount,
                    playerName,
                } = data;
                const orderData = {
                    proposalId,
                    amount,
                    playerName,
                    restTime,
                    depositMethod: this.depositMethod,
                }
                let _data;
                if(this.depositMethod == '4'){
                    const alipay_data = transferPersonStatus.data.data;
                    this.orderData = {
                        qrcodeAddress: alipay_data.qrcodeAddress,
                        alipayName: alipay_data.alipayName,
                        playerName,
                        proposalId,
                        amount,
                        restTime,
                        alipayAccount: alipay_data.alipayAccount
                    }
                    this.isHaveOrder = '4'
                } else {
                    _data = {
                        QRCode: data.weChatQRCode,
                        account: data.weChatAccount,
                        name: data.nickname,
                    }
                    this.orderData = Object.assign(orderData, _data)
                    this.isHaveOrder = '3'
                }
            } else if(transferBankStatus) { //有订单,手工充值
                this.formatTransferBankData(transferBankStatus.data)
                this.isHaveOrder = '2'
            } else {//无订单
                this.isHaveOrder = '1'
            }
            this.renderBankCard()//渲染手工存款  
            this.renderPersonPay()//渲染 转个人 支付方式                           
            this.renderOnlinePay()//渲染 支付宝||微信 在线支付方式
        })
    },
    methods:{
        //获取手工充值状态，查看是否有订单
        getCashRechargeStatus(){
            return new Promise((resolve, reject) => {
                this.$api.getCashRechargeStatus().then(res=>{
                    resolve(res)
                })
            })
        },

        //获取支付宝||微信存款申请单列表, 查看是否有订单
        getTopupRequestList(){
            return new Promise((resolve, reject) => {
                this.$api[this.getRequestListApi]().then(res=>{
                    resolve(res)
                })
            })
        },

        //渲染手工存款
        renderBankCard(){
            if(this.bankList){
                const obj = this.bankList.find(e => e.depositMethod == this.depositMethod);
                if(this.payTypeProcess.indexOf('bank') == -1 && obj){
                    this.payType.push({
                        name: this.depositName + '转银行卡',
                        maxDepositAmount: obj.maxDepositAmount,
                        minDepositAmount: obj.minDepositAmount || 100,
                    })
                    this.payTypeProcess.push('bank')
                }
            }
        },

        //渲染 转个人 支付方式
        renderPersonPay(){
            const data = this.personStatus;
            if(this.payTypeProcess.indexOf('person') == -1 && data){
                const platformMin = all.tool.GetLocal('getConfig').minDepositAmount;
                const min = data.minDepositAmount;
                const minDepositAmount = min? (min>platformMin? 50 : platformMin) : platformMin;
                this.payType.push({
                    name: this.depositName + '转' + this.depositName,
                    maxDepositAmount: data.maxDepositAmount,
                    minDepositAmount,
                })
                if(data.lastNicknameOrAccount){ this.form.alipayName = data.lastNicknameOrAccount } else { this.form.alipayName = '' }//自动填充支付宝姓名
                this.payTypeProcess.push('person')
            }
        },

        //渲染 支付宝||微信 在线支付方式
        renderOnlinePay(){
            if(this.payTypeProcess.indexOf('online') == -1 && this.onlineList.length > 0){
                this.onlineList.forEach(e => {
                    const { maxDepositAmount, minDepositAmount, type, status, } = e;
                    const obj = {
                        maxDepositAmount,
                        minDepositAmount,
                        type,
                    }
                    if(status == 1){
                        if(this.depositMethod == '4'){
                            switch (type) {
                                case 3: 
                                    obj.name = this.depositName + '扫码';
                                    this.payType.push(obj)
                                    break;
                                case 5: 
                                    obj.name = this.depositName + 'APP';
                                    this.payType.push(obj)
                                    break;
                                case 11: 
                                    obj.name = this.depositName + 'wap';
                                    this.payType.push(obj)
                                    break;
                            }
                        } else if(this.depositMethod == '5'){
                            switch (type) {
                                case 2: 
                                    obj.name = this.depositName + '扫码';
                                    this.payType.push(obj)
                                    break;
                                case 4: 
                                    obj.name = this.depositName + 'APP';
                                    this.payType.push(obj)
                                    break;
                                case 10: 
                                    obj.name = this.depositName + 'wap';
                                    this.payType.push(obj)
                                    break;
                                case 15: 
                                    obj.name = this.depositName + '条码';
                                    this.payType.push(obj)
                                    break;
                            }
                        }
                    }
                });
                this.payTypeProcess.push('online')
            }
        },

        //选择支付类型
        selectPayType(name){
            this.currentSelectType = this.payType.find(e => e.name == name);
        },

        //格式化 转银行卡页面数据
        formatTransferBankData(data){
            const {
                proposalId,
                result,
                inputData,
                restTime,
            } = data;
            const {
                depositMethod,
                amount,
            } = inputData;
            const {
                changeAmount,
                cardOwner,
                bankCardNo,
                bankTypeId,
                openingPoint,
            } = result;
            const orderData = {
                proposalId,
                amount: changeAmount? changeAmount : amount,
                depositMethod,
                cardOwner,
                bankCardNo,
                bankTypeId,
                restTime,
                openingPoint,
            }
            if(data.inputData.depositMethod == 6){
                orderData.codeAddress = data.result.codeAddress
            }
            this.orderData = orderData
        },

        //提交
        onSubmit(){
            if(all.tool.validateForm(this) && this.btnName == '下一步'){
                this.btnName = '正在生成订单...'
                const { amount, alipayName, } = this.form;
                const data = {
                    amount,
                    bPMSGroup: true,
                    clientType: 2,
                };
                if(this.bonusCode){
                    data.bonusCode = this.bonusCode
                } else if(this.topUpReturnCode){
                    data.topUpReturnCode = this.topUpReturnCode
                }
                if(this.currentSelectType.name == this.depositName + '转银行卡'){
                    const _data = {
                        supportMode: 'new',
                        depositMethod: this.depositMethod,
                    }
                    const obj = Object.assign(data, _data);
                    api.requestManualTopup(obj).then(res=>{
                        this.formatTransferBankData(res.data)
                        this.orderTips = true
                        this.btnName = '下一步'
                    },err=>{
                        this.$refs['reward_item'].reset()
                        this.btnName = '下一步'
                    })
                } else if(this.currentSelectType.name == this.depositName + '转' + this.depositName) {
                    if(this.depositMethod == '4'){
                        this.alipayTip = true
                        this.alipayTip_msg = '备注栏位需填写会员帐号'
                    } else {
                        this.transferPerson()
                    }
                } else { //在线充值
                    this.rechargeOnline()
                }
            }
        },

        //
        onSubmitRecharge(){
            this.transferPersonAlipay()
            // this.transferPerson()
        },

        //
        rechargeOnline(){
            const { amount, alipayName, } = this.form;
            const data = {
                amount,
                clientType: 2,
            };
            if(this.bonusCode){
                data.bonusCode = this.bonusCode
            } else if(this.topUpReturnCode){
                data.topUpReturnCode = this.topUpReturnCode
            }
            const _data = {
                merchantUseType: 1,
                topupType: this.currentSelectType.type,
                bPMSGroup: true,
                clientType: 2,
            }
            const obj = Object.assign(data, _data)
            api.createOnlineTopupProposal(obj).then(res=>{
                // open.location.href = res.data.topupDetail.paymentURL
                const serviceCharge = res.data.serviceCharge;
                let _amount = res.data.amount - (res.data.amount * serviceCharge);
                _amount = all.tool.fixedNum(_amount, 2)
                this.btnName = '下一步'
                this.onlinePaymentURL = res.data.topupDetail.paymentURL
                this.serviceCharge = true
                this.serviceCharge_msg = `1.支付时，备注栏位<span class='focus'>不需</span>填写信息。<br/>2.手续费<span class='focus'>${serviceCharge * 100}</span>％，实际到账金额<span class='focus'>${_amount}</span>元`
            },err=>{
                this.$refs['reward_item'].reset()
                // open.close()
                this.btnName = '下一步'
            })
        },

        //转个人支付宝
        transferPersonAlipay(){
            this.alipayTip = false
            const playerName = all.tool.GetSession('user').name;
            const { amount, alipayName, } = this.form;
            const data = {
                amount,
                clientType: 2,
            };
            if(this.bonusCode){
                data.bonusCode = this.bonusCode
            } else if(this.topUpReturnCode){
                data.topUpReturnCode = this.topUpReturnCode
            }
            const _data = {
                alipayName,
            }
            const obj = Object.assign(data, _data);
            this.$store.commit('WINDOW_LOADING', true)
            api.requestAlipayTopup(obj).then(res=>{
                this.alipayTip = false
                const {
                    proposalId,
                    result,
                    restTime,
                } = res.data;
                const {
                    amount,
                    alipayName,
                    qrcodeAddress,
                    alipayAccount,
                } = result;
                const orderData = {
                    proposalId,
                    playerName,
                    amount,
                    alipayName,
                    qrcodeAddress,
                    restTime,
                    depositMethod: this.depositMethod,
                    alipayAccount,
                }
                this.orderData = orderData
                this.isHaveOrder = '4'
                this.btnName = '下一步'
                this.$store.commit('WINDOW_LOADING', false)
            },err=>{
                this.$refs['reward_item'].reset()
                this.alipayTip = false
                this.btnName = '下一步'
                this.$store.commit('WINDOW_LOADING', false)
            })
        },

        //转个人微信
        transferPerson(){
            const { amount, alipayName, } = this.form;
            const data = {
                amount,
                clientType: 2,
            };
            const a = this.depositMethod == '4'? 'requestAlipayTopup' : 'requestWechatTopup';
            const _data = {
                alipayName,
                notUseQR: true,
            }
            const obj = Object.assign(data, _data);
            api[a](obj).then(res=>{
                this.alipayTip = false
                const playerName = all.tool.GetSession('user').name;
                const {
                    proposalId,
                    result,
                    restTime,
                } = res.data;
                const {
                    amount,
                } = result;
                const orderData = {
                    proposalId,
                    amount,
                    playerName,
                    restTime,
                    depositMethod: this.depositMethod,
                }
                let _data;
                if(this.depositMethod == '4'){
                    _data = {
                        QRCode: result.alipayQRCode,
                        account: result.alipayAccount,
                        name: result.alipayName,
                    } 
                } else {
                    _data = {
                        QRCode: result.weChatQRCode,
                        account: result.weChatAccount,
                        name: result.nickname,
                    } 
                }
                this.orderData = Object.assign(orderData, _data)
                this.isHaveOrder = '3'
                this.btnName = '下一步'
            },err=>{
                this.$refs['reward_item'].reset()
                this.alipayTip = false
                this.btnName = '下一步'
            })
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

        //取消手工存款申请单
        cancelManualTopupRequest(){
            this.orderTips = false
            this.btnName = '正在取消订单...'
            api.cancelManualTopupRequest({ proposalId: this.orderData.proposalId }).then(res=>{
                this.confirmUi = false
                this.btnName = '下一步'
                this.msg('取消订单成功。', 'success')
            })
        },

        confirmOrder(){
            if(this.checkOrder){
                this.isHaveOrder = '2'
                this.orderTips = false
                this.confirmUi = false
                this.btnName = '下一步'
            } else {
                this.msg('请勾选我明白。')
                this.confirmUi = true
            }
        },

        cancelAlipayTip(){
            this.alipayTip = false
            this.btnName = '下一步'
        },

        onSubmitServiceCharge(){
            const clients = all.tool.isClients()
            this.serviceCharge = false
            window.open(this.onlinePaymentURL)
        },
    },
    watch:{
        //手工存款
        bankList(){
            this.renderBankCard()
        },
        //转个人
        personStatus(){
            this.renderPersonPay()//渲染 转个人 支付方式
        },
        //在线充值
        onlineList(){
            this.renderOnlinePay()
        },

        //默认选择的支付方式
        payTypeProcess(){
            if(this.payType.length > 0){
                this.noPayType = 2
                for (let i = 0; i < this.payType.length; i++) {
                    const e = this.payType[i];
                    if(e.name == this.depositName + '转银行卡'){
                        this.selectPayType(e.name)
                        break;
                    }
                    this.selectPayType(this.payType[0].name)
                }
            } else {
                this.noPayType = 1
            }
        },
    },
}
</script>

<template>
    <div class="alipay_and_wechat_tpl">
        <!-- 无支付方式 -->
        <div v-show='noPayType == 1 && isHaveOrder != "2"  && isHaveOrder != "3" && !$store.state.windowLoading' class="no_pay_type">
            <h4>此充值渠道维护中，请先使用其他充值方式</h4>
            <p>This Recharge Channel Maintenance Please Use Other Charging Methods First</p>
        </div>

        <!-- 有支付方式 -->
        <div v-show="isHaveOrder == '1' && noPayType == 2" class="pay_type_box clearfix">
            <h3 class="pay_type_title">请选择支付方式</h3>
            <ul class="pay_type clearfix">
                <li
                v-for="(val, key) in payType"
                :key="key"
                @click="selectPayType(val.name)">
                    <div
                    :class="{
                        'select_alipay' : val.name == currentSelectType.name && depositMethod == 4,
                        'select_wechat' : val.name == currentSelectType.name && depositMethod == 5,
                    }"
                    class="pay_type_bg">
                        <i v-show="depositMethod == 4" class="iconfont icon-zhifubao1"></i>
                        <i v-show="depositMethod == 5" class="iconfont icon-weixinzhifu"></i>
                        <p>{{ val.name }}</p>
                    </div>
                    <p class="primary_text_color" v-show="val.name == '支付宝wap' || val.name == '微信wap'">手续费2％</p>
                </li>
            </ul>
            <form class="account_form" autocomplete="off">
                <h3 class="pay_type_title">请输入存款金额</h3>
                <FormItem
                icon='icon-qianqian-'
                :rule='rules.amount'
                :placeholder='`充值金额 ${ currentSelectType.minDepositAmount } - ${ currentSelectType.maxDepositAmount }`'
                ref='amount'
                type='tel'
                v-model="form.amount"/>
                <FormItem
                v-if="currentSelectType.name == '支付宝转支付宝'"
                :rule='rules.alipayName'
                placeholder='支付宝昵称/支付宝姓名'
                ref='alipayName'
                v-model="form.alipayName"/>
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

        <!-- 转 银行卡 -->
        <TransferBankOrder
        @cancelOrderStatus="isHaveOrder = '1'; checkOrder = false"
        v-if="isHaveOrder == '2'"
        :orderData='orderData'/>

        <!-- 转 个人 -->
        <TransferPersonOrder
        @cancelOrderStatus="isHaveOrder = '1'"
        v-if="isHaveOrder == '3'"
        :orderData='orderData'/>

        <!-- 转个人支付宝 -->
        <AlipayOrder
        @cancelOrderStatus="isHaveOrder = '1'"
        v-if="isHaveOrder == '4'"
        :orderData='orderData'
        />

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
            <div class="btn_center" slot="footer">
				<button @click="confirmOrder" class="btn btn_secondary">确定</button>
                <button @click="cancelManualTopupRequest" class="btn btn_pop_cancel">取消订单</button>
			</div>
        </Dialog>

        <!-- 支付宝提示提示 -->
        <Dialog
		title='温馨提示' 
		:visible='alipayTip' 
		@close="cancelAlipayTip">
			<div class="dialog_content" slot="body">
                <p class="alipay_tip">{{ alipayTip_msg }}</p>
            </div>
            <div class="btn_center" slot="footer">
				<button @click="onSubmitRecharge" class="btn btn_secondary">确定</button>
                <button @click="cancelAlipayTip" class="btn btn_pop_cancel">取消</button>
			</div>
        </Dialog>

        <!-- 手续费提示 -->
        <Dialog
		title='温馨提示' 
		:visible='serviceCharge' 
		@close="serviceCharge = false">
			<div class="dialog_content" slot="body">
                <p class="alipay_tip" v-html="serviceCharge_msg"></p>
            </div>
            <div class="btn_center" slot="footer">
				<button @click="onSubmitServiceCharge" class="btn btn_secondary">确定</button>
                <button @click="serviceCharge = false" class="btn btn_pop_cancel">取消</button>
			</div>
        </Dialog>
    </div>
</template>

<style lang="postcss">
    .alipay_tip{
        text-align: center;
        padding: 20px 0;
    }
</style>

