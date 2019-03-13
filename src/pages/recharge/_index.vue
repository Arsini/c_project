<script>
export default {
    data(){
        const prefix = '/recharge/';
        return{
            sidebar: [
                {
                    name: '支付宝',
                    link: `${prefix}recharge_alipay`,
                },
                {
                    name: '在线充值',
                    link: `${prefix}recharge_online`,
                },
                {
                    name: '银行卡',
                    link: `${prefix}recharge_bank`,
                },
                {
                    name: '微信',
                    link: `${prefix}recharge_wechat`,
                },
            ],
            bankList: [],//可使用的手工存款列表
            onlineList: [],//可使用的在线充值方式列表
            rewardList: [],//优惠列表
            aliPayStatus: '',//支付宝充值状态
            wechatPayStatus: '',//微信充值状态
            payTypeProcess: [],//支付方式渲染进度
        }
    },
    created(){
        this.requestBankTypeByUserName()//获取可用银行卡类型
        this.$store.commit('WINDOW_LOADING', true)
        this.getRewardList()
    },
    beforeDestroy(){
        all.tool.RemoveSession('promoCode')
    },
    methods:{
        /* API */
        //获取可用银行卡类型
        _requestBankTypeByUserName: data => all.net.send({
            service: 'payment',
            functionName: 'requestBankTypeByUserName',
            data,
        }),
        //获取有效在线充值方式
        _getOnlineTopupType: data => all.net.send({
            service: 'payment',
            functionName: 'getOnlineTopupType',
            data,
        }),
        //微信充值状态
        _getPlayerWechatPayStatus: data => all.net.send({
            service: 'payment',
            functionName: 'getPlayerWechatPayStatus',
            data,
        }),
        //支付宝充值状态
        _getPlayerAliPayStatus: data => all.net.send({
            service: 'payment',
            functionName: 'getPlayerAliPayStatus',
            data,
        }),

        //获取可用银行卡类型
        requestBankTypeByUserName(){
            const data = {
                clientType: 2,
                supportMode: 'new',
            }
            this._requestBankTypeByUserName(data).then(res=>{
                this.getOnlineTopupType()//获取有效在线充值方式
                this.bankList = res.data.data
                this.payTypeProcess.push('bank')
            },err => {
                this.$store.commit('WINDOW_LOADING', false)
            })
        },

        //获取有效在线充值方式
        getOnlineTopupType(){
            const data = {
                clientType: 2,
                bPMSGroup: true,
                merchantUse: 1,
            }
            this._getOnlineTopupType(data).then(res=>{
                const d = {
                    bPMSGroup: true,
                }
                this.getPlayerAliPayStatus(d)//支付宝充值状态
                this.onlineList = res.data
                this.payTypeProcess.push('online')
            },err => {
                this.$store.commit('WINDOW_LOADING', false)
            })
        },
        
        //支付宝充值状态
        getPlayerAliPayStatus(data){
            this._getPlayerAliPayStatus(data).then(res=>{
                const d = {
                    bPMSGroup: true,
                }
                this.getPlayerWechatPayStatus(d)//微信充值状态
                this.aliPayStatus = res.data
                this.payTypeProcess.push('alipay')
            },err => {
                this.$store.commit('WINDOW_LOADING', false)
            })
        },

        //微信充值状态
        getPlayerWechatPayStatus(data){
            this._getPlayerWechatPayStatus(data).then(res=>{
                this.wechatPayStatus = res.data
                this.payTypeProcess.push('wechat')
                this.$store.commit('WINDOW_LOADING', false)
            },err => {
                this.$store.commit('WINDOW_LOADING', false)
            })
        },

        //获取优惠列表
        getRewardList(){
            this.$api.getRewardList().then(res=>{
                const url = location.hostname;
				this.$api.getTemplateSetting({ url }).then(r=>{
                    const dataLength = r.data.length > 0;
                    const isHave = dataLength? (r.data[0].functionList).find(e => e.functionId == 1) : false;
                    const rewardList = [];
                    res.data.forEach(e => {
                        if(e.type.des == "PlayerTopUpReturnGroup" && all.tool.noShowReal(e.showInRealServer)){
                            if(e.name == "新手礼包"){
                                if(isHave){
                                    rewardList.push({
                                        code: e.code,
                                        name: e.name,
                                        minTopUpAmount : e.param.rewardParam[0].value[0].minTopUpAmount,
                                    })
                                }
                            }else {
                                rewardList.push({
                                    code: e.code,
                                    name: e.name,
                                    minTopUpAmount : e.param.rewardParam[0].value[0].minTopUpAmount,
                                })
                            }
                        }
                    });
                    this.rewardList = rewardList
				})
            })
        }
    },
    watch:{
        payTypeProcess(){
            if(this.payTypeProcess.length == 4){
                this.$store.commit('WINDOW_LOADING', false)
            }
        }
    }
}
</script>

<template>
    <div class="recharge">
        <ul class="tab">
            <router-link
            v-for="item in sidebar"
            :key="item.name"
            :to="item.link"
            tag="li">{{ item.name }}</router-link>
        </ul>
        <router-view
        class="wrap recharge_box"
        :rewardList='rewardList'
        :bankList='bankList'
        :onlineList='onlineList'
        :aliPayStatus='aliPayStatus'
        :wechatPayStatus='wechatPayStatus'/>
    </div>
</template>

<style lang="postcss">
    .recharge{
        .recharge_box{
            padding-bottom: 18px;
        }
        .pay_type{
            display: flex;
            flex-wrap: wrap;
            /* padding-top: .2rem;
            padding-bottom: .3rem; */
            li{
                width: 31.2%;
                text-align: center;
                margin: 0 1% .2rem 1%;
                padding: 10px 0;
                .iconfont{
                    font-size: .8rem;
                    display: block;
                    padding-bottom: .1rem;
                }
                p{
                    font-size: .35rem;
                }
            }
            .select_alipay{
                background: linear-gradient(to bottom right,#23d6bf, #1448be);
            }
            .select_wechat{
                background: linear-gradient(to bottom right,#23d69d, #1f8b21);
            }
            .select_bank{
                background: linear-gradient(to bottom right,#ff9743, #cc0885);
            }
            .select_online{
                background: linear-gradient(to bottom right,#43cbff, #9708cc 135px);
            }
        }

        .pay_type_bg{
            background: #333;
            border-radius: .2rem;
            padding: 8px 0;
            margin-bottom: .1rem;
        }
        .pay_type_title{
            padding-top: .4rem;
            padding-bottom: .2rem;
        }
        .dialog_content{
            color: #000;
            overflow: hidden;
            table{
                width: 100%;
                margin: 14px auto;
                text-align: center;
            }
            table{
                .bg{
                    background-color: #c8c8c8;
                }
                .red{
                    color: red;
                }
            }
            table, th, td{
                border: 1px solid #a2a2a2;
                line-height: 24px;
            }
            label{
                line-height: 20px;
            }
        }
        .confirm_ui{
            border: 2px solid red;
        }
        .no_pay_type{
            width: 100%;
            padding-top: 6.5rem;
            background-image: url(./img/maintain.png);
            background-size: 100%;
            background-repeat: no-repeat;
            margin: 30px auto;
            text-align: center;
            h4{
                font-size: 16px;
            }
            p{
                color: #999;
            }
        }
        .input_wrapper{
            input{
                font-size: 32px;
                font-weight: bold;
            }
            input::-webkit-input-placeholder { /* WebKit browsers */
                font-size: 18px;
            }
            input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                font-size: 18px;
            }
            input::-moz-placeholder { /* Mozilla Firefox 19+ */
                font-size: 18px;
            }
            input:-ms-input-placeholder { /* Internet Explorer 10+ */
                font-size: 18px;
            }
        }
    }
</style>

