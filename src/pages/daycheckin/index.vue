<script>
    export default {
        data(){
            return{
                dayList:[],
                dayTopup : 0,
                egameBetting : 0,
                isActivity : false,
                needTopup:0,
                needEgameBetting :0,
                needRequested: 8,
                activityCode: '4848'
            }
        },
        created(){
            if(this.$store.state.lockedCreditList){
                this.init()
            } else {
                this.$store.commit('WINDOW_LOADING', true)
            }
        },
        methods:{

            _getSignInfo: data => all.net.send({
                service: 'reward',
                functionName: 'getSignInfo',
                data,
            }),

            //获取申请优惠相关信息
            _getRewardApplicationData: data => all.net.send({
                service: 'reward',
                functionName: 'getRewardApplicationData',
                data,
            }),

            getEgameProviderList(){
                const promise = new Promise((resolve, reject) => {
                    const providerIdList = [];
                    this._getRewardApplicationData({ code:self.activityCode }).then(res => {
                        const data = res.data;
                        const bet = data.condition.bet;//存送优惠
                        bet.gameGroup.forEach(e => {
                            providerIdList.push(e.providerId)
                        });
                        resolve(providerIdList);
                    });
                });
                return promise;
            },

            

            init(){
                this.getSignInfo();
                this.playerId = all.tool.GetSession('playerId');
                if(this.playerId){
                    this.getDayTopup();
                    this.getDayEgameBetting();
                }
            },

            setDayInfo(dataList){
                dataList.forEach(val => {
                    if(val.status=="0"){
                        val.text = "待领取";
                        val.className = "color_w";
                    }else if(val.status=="1"){
                        val.text = "可领取";
                        val.className = "color_y";
                    }else if(val.status=="2"){
                        val.text = "已领取";
                        val.className = "color_o";
                    }
                });
                return dataList;
            },

            getDayTopup(){
                this.$api.getPlayerDayStatus().then(res=>{
                    this.dayTopup = res.data.topUpAmount;
                });
            },

            getDayEgameBetting(){
                var thisObj = this;
                this.getEgameProviderList().then(function (providerIdList) {
                    this.$api.getPlayerDayStatus({providerIds:providerIdList}).then(res=>{
                        thisObj.egameBetting = res.data.consumptionAmount;
                    });
                });
            },

            getEgameProviderList(){
                const promise = new Promise((resolve, reject) => {
                    const providerIdList = [];
                    const egameList = (this.$store.state.lockedCreditList).find(e => e.nickName == "电子大厅");
                    (egameList.list).forEach(e => {
                        providerIdList.push(e.providerId)
                    });
                    resolve(providerIdList);
                });
                return promise;
            },

            getSignInfo(){
                this._getSignInfo({code: this.activityCode}).then(res => {
                    this.dayList = this.setDayInfo(res.data.list);
                    this.needTopup = res.data.deposit;
                    this.needEgameBetting =res.data.effectiveBet;
                });
            },

            getDayCheckInReward(){
                if(this.playerId){
                    const startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    const endTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
                    const param = {
                        startTime :startTime,
                        endTime: endTime,
                        playerId : this.playerId,
                        eventCode : this.activityCode
                    };
                    this.$api.getPlayerRewardList(param).then(res=>{
                        if(res.data.records && res.data.records.length>0){
                            this.msg('今日已领取签到礼金。', 'error');
                        }else{
                            this.$api.applyRewardEvent({code: this.activityCode}).then(res=>{
                                this.msg('恭喜您成功领取签到礼金', 'success');
                                this.getSignInfo()
                            })
                        }
                    })
                }else{
                    this.msg('帐号尚未登录，请登录。', 'warning');
                    all.tool.loginToshow(this.$store);
                    this.$store.commit('lOGIN_BEFORE_PAGE', this.$route.fullPath);
                }
            },
            close(){
                this.$emit('popFlag', 'isDayCheckIn', false)
            }
        },
        watch:{
            '$store.state.lockedCreditList'(){
                this.init()
                this.$store.commit('WINDOW_LOADING', false)
            }
        }
    }
</script>

<template>
    <div class="daycheckin">
        <div class="daycheckin_content">

            <div class="dayState">
                <img src="./img/daycheckin_status.png" />
                <div class="dayState_text">
                    <div v-for="(val, key) in dayList" :class="val.className" :key="key">{{ val.text }}</div>
                </div>
                <div class="dayMoney">
                    <div class="dayTopup">
                        <span>今日存款：{{dayTopup}}</span>
                    </div>
                    <div class="dayBetting">
                        <span>今日电子流水：{{egameBetting}}</span>
                    </div>
                </div>
            </div>

            <div class="dayCheckinBtn">
                <img src="./img/daycheckin_btn.png" @click="getDayCheckInReward" />
            </div>
            <div class="dayCheckinRule_title">
                <img src="./img/daycheckin_rule_bg.png" />
                <div class="dayCheckinRule_title_text">签到礼金优惠说明</div>
            </div>

            <div class="dayCheckinRule">
                <div class="dayCheckinRule_bottom">适用大厅：所有电子大厅</div>
                <div>签到条件：</div>
                <div class="dayCheckinRule_bottom">单日总存款300元+单日电子有效投注额3000，方可签到。</div>
                <div>注意事项：</div>
                <div class="dayCheckinRule_text">(1)领取奖金后需在『电子大厅』完成{{needRequested}}倍有效投注额方可提款。</div>
                <div class="dayCheckinRule_text">(2)存款以及有效投注额的累积时间为每日00:00:00到23:59:59。</div>
                <div class="dayCheckinRule_text">(3)签到礼金一周一循环，每周一0点重置。</div>
            </div>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
    .daycheckin{
        background: url("./img/daycheckin_bg.jpg") no-repeat;
        background-size: cover;
        width: 100%;
        position: absolute;
        padding-bottom: 55px;
        min-height: 100%;
    }
    .daycheckin_content{
        font-family:Microsoft Yahei, Arial, Helvetica Neue, Helvetica, STHeiTi, sans-serif;
        font-size: 15px;
        color:#fff;
        .dayState{
            width: 90%;
            margin: 0.4rem auto 0 auto;
            text-align: center;
            max-width: 683px;
            max-height: 1075px;
            position: relative;
            .dayState_text{
                position: absolute;
                bottom: 1.05rem;
                width: 2rem;
                right: 0.5rem;
            }
            .dayState_text div{
                height:1.2rem;
                line-height: 1.2rem;
                text-align: center;
                font-style: oblique;
                font-weight: bold;
                &.color_o{

                     color: #f7941d;
                }
                &.color_y{

                     color: #ffff00;
                }
                &.color_w{

                     color: #ebebeb;
                }
            }
            .dayMoney{
                position: absolute;
                bottom: 0px;
                height: 1.1rem;
                width: 100%;
                line-height: normal;
                display: flex;
                >div{
                    width: 50%;
                    float: left;
                    margin: auto;
                }
            }
        }
        .dayCheckinBtn{
            width: 90%;
            margin: 0.7rem auto 0 auto;
            max-width: 323px;
            max-height: 74px;
            text-align: center;
            img{
                width: 4.4rem;
            }
        }

        .dayCheckinRule_title{
            width: 90%;
            margin: 0.5rem auto 0 auto;
            max-width: 470px;
            max-height: 113px;
            position: relative;
            text-align: center;
            color: #e6d19c;
            img{
                width: 6.7rem;
            }
            .dayCheckinRule_title_text{
                position: absolute;
                top: 0px;
                line-height: 0.8rem;
                width: 100%;
            }
        }
        .dayCheckinRule{
            margin: 0.5rem auto 0.6rem auto;
            text-align: left;
            color:#e6d19c;
            padding-left: 0.3rem;
            padding-right: 0.3rem;
            .dayCheckinRule_bottom{
                margin-bottom: 0.2rem;
            }
            .dayCheckinRule_text{
                text-align: left;
            }
        }

    }

    /* Small Devices, Tablets */
    @media only screen and (min-width : 768px) {
        .daycheckin_content{
            .dayState .dayState_text{
                bottom: 1.52rem;
            }
            .dayState .dayState_text div{
                height: 1.69rem;
                line-height: 1.69rem;
                font-size: 0.4rem;
            }
            .dayState .dayMoney{
                height: 1.55rem;
            }
            .dayState .dayMoney span{
                font-size: 0.4rem;
            }
            .dayCheckinRule_title_text{
                font-size: 0.3rem;
            }
            .dayCheckinRule{
                width: 60%;
                padding-left: 0rem;
                padding-right: 0rem;
                >div{
                    font-size: 0.3rem;
                }
            }
        }
    }
</style>

