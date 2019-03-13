<script>
export default {
    data(){
        return{
            iframe: '',
            visible: false,
            rewardTips: '',
            link: '*',
            deposit: '',//是否是存送优惠
            zhuDan: '',//注单号
            playGame:{},// 进入游戏列表
        }
    },
    created(){
        this.initPlayGameData()
        this.$store.commit('TITLE_NAME', '优惠活动')
        this.$store.commit('WINDOW_LOADING', true)
        window.addEventListener("message", this.listenerFn, false);
        const iframe = document.createElement('iframe');
        const str = JSON.stringify(new Date());
        const hash = str.slice(0,14);
        iframe.src = this.$route.query.link + '?' + hash
        iframe.height = window.innerHeight - 100 // 设置ifr高度
        this.iframe = iframe
        this.link = this.$route.query.link
    },
    mounted(){
        window.scrollTo(0,0)
        this.$refs.reward_detail.appendChild(this.iframe)
        if(this.iframe.attachEvent){
            this.iframe.attachEvent("onload",() => {
                this.requestData()
            }); 
        } else {
            this.iframe.onload = () => {
                this.requestData()
            }
        }
    },
    beforeDestroy(){
        window.removeEventListener("message", this.listenerFn)
    },
    methods: {
        /* API */
        //获取申请优惠相关信息
        _getRewardApplicationData: data => all.net.send({
            service: 'reward',
            functionName: 'getRewardApplicationData',
            data,
        }),
        //申请优惠
        _applyRewardEvent: data => all.net.send({
            service: 'reward',
            functionName: 'applyRewardEvent',
            data,
        }),
        //获取今日输值
        _getPlayerAnyDayStatus: data => all.net.send({
            service: 'player',
            functionName: 'getPlayerAnyDayStatus',
            data,
        }),

        listenerFn(e){
            const data = e.data;
            if(data && data.source == 'reward_page'){
                const _event = data.payload.event;
                switch (_event) {
                    case 'apply': this.applyRewardEvent(data.payload);break;//申请优惠
                    case 'close': this.$router.push('/reward');break;//关闭页面
                    case 'sms': this.sendSMSCodeToPlayer();break;//发送验证码
                    case 'service24': all.tool.service24();break;//客服
                    case 'play_game':this.goPlayGame(data.payload);break;
                    case 'jump': this.$router.push(data.payload.payload.page);break;//跳转页面？？？？
                    default: log('未知事件：' + _event); break;
                }
            }
        },


        //发送验证码
        sendSMSCodeToPlayer(){
            if(this.$store.state.isSignIn){
                this.$api.sendSMSCodeToPlayer({ purpose: 'freeTrialReward' }).then(res=>{
                    this.msg('已发送等待60秒后可重新发送','success')
                })
            } else {
                this.msg('请先登陆')
                this.$emit('popFlag', 'isSignInPop', true)
            }
        },

        //领取优惠
        //申请优惠出现问题，现在请求数据不通过静态页面拿，直接在主站整理
        applyRewardEvent(data){
            const payload = data.payload;
            if(this.$store.state.isSignIn){
                this.$store.commit('WINDOW_LOADING', true)
                const smsCode = payload.data.smsCode;
                const type = this.$route.query.type;
                const req_data = {
                    code: this.$route.query.code,
                    data: {},
                }

                if(this.deposit){
                    req_data.data.topUpRecordId = this.deposit
                }
                if(type == 'PlayerFreeTrialRewardGroup'){
                    req_data.data.smsCode = payload.data.smsCode
                }
                if(this.zhuDan){
                    req_data.appliedObjIdList = [this.zhuDan]
                }
                this._applyRewardEvent(req_data).then(res=>{
                    this.msg('优惠领取成功。', 'success')
                    this.$store.commit('WINDOW_LOADING', false)
                    this.$store.dispatch('GET_CREDIT_DETAIL')//更新账户余额
                    this.iframe.contentWindow.postMessage({ success: res.data.amount }, this.link)
                    if(this.$route.query.type == 'PlayerRetentionRewardGroup'){
                        setTimeout(()=>{
                            window.location.reload()
                        },1000)
                    }
                },err=>{
                    this.$store.commit('WINDOW_LOADING', false)
                })
            } else {
                this.msg('请先登陆')
                this.$router.push('/sign_in')
            }
        },

        //开始请求数据
        requestData(){
            if(this.$store.state.isSignIn){
                const code = this.$route.query.code
                this._getRewardApplicationData({ code }).then(res=>{
                    const data = res.data;
                    const bet = data.condition.bet;
                    const type = this.$route.query.type;
                    if(type == 'PlayerTopUpReturnGroup' || type == 'PlayerRetentionRewardGroup' && data.condition.deposit.details.length > 0){
                        this.deposit = data.condition.deposit.details[0].id
                    }
                    if(type == 'PlayerConsumptionSlipRewardGroup'){
                        if(bet){
                            let rewardAmount = 0;
                            bet.list.forEach(e => {
                                if(e.rewardAmount >= rewardAmount){
                                    rewardAmount = e.rewardAmount
                                    this.zhuDan = e.id
                                }
                            });
                        }
                    }
                    if(bet && bet.gameGroup){
                        const providerIds = [];
                        bet.gameGroup.forEach(e => {
                            providerIds.push(e.providerId)
                        });
                        this._getPlayerAnyDayStatus({ providerIds }).then(r=>{
                            const obj = Object.assign(data, { playerAnyDayStatus : r.data})
                            this.iframe.contentWindow.postMessage(obj, this.link)
                            this.$store.commit('WINDOW_LOADING', false)
                        })
                    } else {
                        this.iframe.contentWindow.postMessage(data, this.link)
                        this.statusTips(data)
                        this.$store.commit('WINDOW_LOADING', false)
                    }
                },err => {
                    this.$store.commit('WINDOW_LOADING', false)
                })
            } else {
                this.$store.commit('WINDOW_LOADING', false)
            }
        },

        //优惠状态提示
        statusTips(data){
            const type = this.$route.query.type;
            const status = data.status//1满足,2不满足 3，已领取到上限
            const deposit = data.condition.deposit;
            const SMSCode = data.condition.SMSCode;
            if(status != 1 && deposit && !SMSCode && type == 'PlayerTopUpReturnGroup'){
                this.visible = true
                switch (status) {
                    case 2: 
                        this.rewardTips = `您需要有新存款${ deposit.allAmount }元以上，并且总存款笔数${ deposit.times }才能领取优惠。`
                        break;
                    case 3: 
                        this.rewardTips = `您已经申请过此优惠啰！`
                        break;
                    case 4: 
                        this.rewardTips = `您需要有新存款${ deposit.allAmount }元以上，才能申请优惠。`
                        break;
                }
            }
        },

        //
        closeDialog(){
            this.$router.push('/recharge/recharge_alipay')
        },

        initPlayGameData(){
            //平台类型都要小写  type = url || gameId
            this.playGame = {
                ebetlive : {url: '', gameId: "0B60D369-F338-40E3-B5C6-0FE462E840D7", type: "gameId"}
            }
        },

        goPlayGame(data){
            let playGameItem = this.playGame[data.platform];
            if(playGameItem){
                if(playGameItem.type=="url"){
                    this.$router.push(playGameItem.url);
                }else if(playGameItem.type=="gameId"){
                    if(this.$store.state.isSignIn){
                        const origin = window.location.origin;
                        const host = `http://${window.location.host}`
                        const query = {
                            clientDomainName: host,
                            clientType: 2,
                            gameId: playGameItem.gameId,
                        }
                        const api = "_getLoginURL"
                        const url = `${origin}/#/game_loading?api=${api}&gameId=${query.gameId}&clientType=2&clientDomainName=${query.clientDomainName}`;
                        if(this.client != '苹果APP'){
                            let windowOpen = window.open();
                            windowOpen.location.href = url
                        } else {
                            window.location.href = url
                        }
                    } else {
                        this.$router.push('/sign_in')
                        this.msg('请先登陆')
                    }
                }
            }
        }
    },
}
</script>

<template>
    <div ref="reward_detail">
        <!-- 不符合领取资格通知 -->
        <Dialog
        title='提示' 
        :visible='visible' 
        @close="visible = false">
            <div slot="body" class="reward_tips">{{ rewardTips }}</div>
            <div slot="footer">
                <div class="btn_center btn_dialog">
                    <button @click="closeDialog" class="btn btn_secondary">前往充值</button>
                    <button @click="visible = false" class="btn btn_pop_cancel">再看看</button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

