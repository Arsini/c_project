<script>
export default {
    props: ['promoCodeData'],
    data(){
        const userName = all.tool.GetSession('user').name;
        return{
            userName,
            level: 0,//玩家当前等级
            keepLevel: '',//保级数据
            upLevel: [],//升级数据
            topUpLevel: [],//存款升级数据
            userInfo: '', //用户数据
        }
    },
    created(){
        const user = all.tool.GetSession('user');
        const level = user.playerLevel.value;
        const allLevel = all.tool.GetLocal('getAllLevel');
        const { phoneNumber, bankAccount, } = user;
        this.level = level
        if(allLevel){
            allLevel.forEach(e => {
                if(e.value == level) {
                    this.formatKeepLevel(e.levelDownConfig)//格式化保级数据
                } else if(e.value == level +1){
                    const list = e.list? e.list : [];
                    this.formatUpLevel(e.levelUpConfig, list)//格式化升级数据
                }
            });
            if(allLevel.length == level +1){ // 如果用户是顶级
                this.upLevel = [{
                    consumptionAmount: 0,
                    consumptionLimit: 0,
                    content: '已达最高等级',
                    percen: '100',
                }]
            }
        } else {
            this.msg('请刷新')
        }

        this.userInfo = {
            phoneNumber,
            bankAccount,
            playerLevel: user.playerLevel.name,
        }
    },

    methods:{
         /* API */
        //获取玩家当日状态
        _getPlayerDayStatus: data => all.net.send({
            service: 'player',
            functionName: 'getPlayerDayStatus',
            data,
        }),
        //获取玩家当周状态
        _getPlayerWeekStatus: data => all.net.send({
            service: 'player',
            functionName: 'getPlayerWeekStatus',
            data,
        }),
        //获取玩家当月状态
        _getPlayerMonthStatus: data => all.net.send({
            service: 'player',
            functionName: 'getPlayerMonthStatus',
            data,
        }),

        //格式化保级数据
        formatKeepLevel(data){
            if(data){
                const obj = {};
                const o = data[0];
                this.getPlayerStatus(o.consumptionPeriod, '').then(res=>{
                    const consumptionAmount = all.tool.fixedNum(res.consumptionAmount, 0)
                    obj.consumptionAmount = all.tool.formatNumber(consumptionAmount)
                    obj.consumptionMinimum = all.tool.formatNumber(o.consumptionMinimum)
                    obj.consumptionPeriod = this.consumptionPeriodName(o.consumptionPeriod)
                    obj.percen = (res.consumptionAmount/o.consumptionMinimum) * 100
                    this.keepLevel = obj
                },err=>{
                    this.msg(err.errorMessage)
                })
            } else {
                this.msg('数据异常')
            }
        },

        //格式化升级数据
        formatUpLevel(data, list){
            if(data){
                const arr = [];//投注
                const topUpArr = [];//充值
                data.forEach((e,k) => {
                    const obj = {};
                    const topUpObj = {};
                    this.getPlayerStatus(e.consumptionPeriod, e.consumptionSourceProviderId).then(res=>{
                        //投注
                        const consumptionAmount = all.tool.fixedNum(res.consumptionAmount, 0)
                        obj.consumptionAmount = all.tool.formatNumber(consumptionAmount)
                        obj.consumptionLimit = all.tool.formatNumber(e.consumptionLimit)
                        obj.consumptionPeriod = this.consumptionPeriodName(e.consumptionPeriod)
                        obj.percen = (res.consumptionAmount/e.consumptionLimit) * 100
                        obj.content = list[k]? list[k].displayTextContent : '请设置流水说明'
                        arr.push(obj)
                        
                        //存款
                        const topUpAmount = all.tool.fixedNum(res.topUpAmount, 0)
                        topUpObj.topUpAmount = all.tool.formatNumber(topUpAmount)
                        topUpObj.topupLimit = all.tool.formatNumber(e.topupLimit)
                        topUpObj.consumptionPeriod = this.consumptionPeriodName(e.consumptionPeriod)
                        topUpObj.percen = (res.topUpAmount/e.topupLimit) * 100
                        topUpObj.content = '充值存款要求'
                        topUpArr.push(topUpObj)
                    })
                });
                this.topUpLevel = topUpArr
                this.upLevel = arr
            } else {
                this.msg('数据异常')
            }
        },

        //获取流水 consumptionPeriod:周期；providerIds：大厅ID
        getPlayerStatus(consumptionPeriod, providerIds){
            return new Promise((resolve, reject) => {
                switch (consumptionPeriod) {
                    case "MONTH":
                        this._getPlayerMonthStatus({ providerIds }).then(res=>{
                            resolve(res.data)
                        },err=>{
                            reject(err)
                        })
                        break;
                    case "WEEK":
                        this._getPlayerWeekStatus({ providerIds }).then(res=>{
                            resolve(res.data)
                        },err=>{
                            reject(err)
                        })
                        break;
                    case "DAY":
                        this._getPlayerDayStatus({ providerIds }).then(res=>{
                            resolve(res.data)
                        },err=>{
                            reject(err)
                        })
                        break;
                }
            })
        },

        //消费周期中文
        consumptionPeriodName(name){
            switch (name) {
                case "MONTH":
                    return '月'
                    break;
                case "WEEK":
                    return '周'
                    break;
                case "DAY":
                    return '日'
                    break;
                default:
                    log('错误的东西。')
                    break;
            }
        },

        //退出登陆
        signOut(){
            const playerId = all.tool.GetSession('playerId');
            this.$api.logout({ playerId }).then(res=>{
                this.$store.commit('IS_SIGN_IN', false)//退出登陆
                all.tool.RemoveSession('user')
                all.tool.RemoveSession('playerId')
                all.tool.RemoveSession('token')
                this.$router.push('/')
                this.msg('成功登出', 'success')
            })
        },
    },
    computed:{
        noUseList(){
            let length = 0;
            if(this.promoCodeData){
                length =  this.promoCodeData.noUseList.length
            }
            return length
        }
    },
}
</script>

<template>
    <div class="account">
        <div class="vip">
            <img class="level_logo" :src="require(`./img/${level}.png`)">
            <p class="user_id">ID：{{ userName }}</p>
            <!-- 升级流水 -->
            <div v-for="(val, key) in upLevel" :key="key" class="progress_box">
                <h4>{{ val.consumptionPeriod }}{{ val.content }} <span v-show="val.percen != 100">({{ val.consumptionAmount }}/{{ val.consumptionLimit }})</span></h4>
                <div class="progress progress_yellow">
                    <div :style="{ width: `${val.percen}%`}" class="progress_bg"></div>
                </div>
            </div>

            <!-- 存款升级流水 -->
            <div v-for="value in topUpLevel" :key="value.consumptionMinimum" class="progress_box">
                <h4>{{ value.consumptionPeriod }}{{ value.content }}（{{ value.topUpAmount }}/{{ value.topupLimit }}）</h4>
                <div class="progress progress_yellow">
                    <div :style="{ width: `${value.percen}%`}" class="progress_bg"></div>
                </div>
            </div>
            
            <!-- 保级流水 -->
            <div v-show="level > 0" class="progress_box">
                <h4>{{ keepLevel.consumptionPeriod }}保级流水要求（{{ keepLevel.consumptionAmount }}/{{ keepLevel.consumptionMinimum }}）</h4>
                <div class="progress">
                    <div :style="{ width: `${keepLevel.percen}%`}" class="progress_bg"></div>
                </div>
            </div>
        </div>
        <ul class="function">
            <router-link v-track="`账户 游戏转帐`" to='/transfer' tag="li">
                <i class="icon transfer"></i>
                <p>游戏转帐</p>
            </router-link>
            <router-link v-track="`账户 优惠活动`" to='/reward' tag="li">
                <i class="icon reward"></i>
                <p>优惠活动</p>
            </router-link>
            <router-link v-track="`账户 优惠券`" to='/coupon' tag="li">
                <i class="icon coupon"></i>
                <p>优惠券</p>
                <div v-show='noUseList > 0' class="count">{{ noUseList }}</div>
            </router-link>
            <router-link v-track="`账户 帐目查询`" to='/inquire' tag="li">
                <i class="icon search"></i>
                <p>帐目查询</p>
            </router-link>
        </ul>

        <ul class="account_link">
            <router-link v-track="`账户 电话修改`" to="/modify_phone" tag="li">
                <div class="name">
                    <i class="iconfont icon-shouji"></i>
                    <span>电话修改</span>
                </div>
                <div class="data">
                    <span>{{ userInfo.phoneNumber }}</span>
                    <i class="iconfont icon-arrow"></i>
                </div>
            </router-link>

            <router-link v-track="`账户 银行卡修改`" to="/modify_bank" tag="li">
                <div class="name">
                    <i class="iconfont icon-card"></i>
                    <span>银行卡修改</span>
                </div>
                <div class="data">
                    <span>{{ userInfo.bankAccount }}</span>
                    <i class="iconfont icon-arrow"></i>
                </div>
            </router-link>
            <router-link v-track="`账户 基本资料`" to="/user_info" tag="li">
                <div class="name">
                    <i class="iconfont icon-zhanghu"></i>
                    <span>基本资料</span>
                </div>
                <div class="data">
                    <i class="iconfont icon-arrow"></i>
                </div>
            </router-link>
        </ul>

        <ul class="account_link">
            <router-link v-track="`账户 VIP升级`" to="/level_up" tag="li">
                <div class="name">
                    <i class="iconfont icon-vip"></i>
                    <span>VIP升级</span>
                </div>
                <div class="data">
                    <span>{{ userInfo.playerLevel }}</span>
                    <i class="iconfont icon-arrow"></i>
                </div>
            </router-link>
            <router-link v-track="`账户 修改密码`" to="/modify_password" tag="li">
                <div class="name">
                    <i class="iconfont icon-mima1"></i>
                    <span>修改密码</span>
                </div>
                <div class="data">
                    <i class="iconfont icon-arrow"></i>
                </div>
            </router-link>
        </ul>

        <ul class="account_link">
            <li @click="signOut" class="sign_out">登出</li>
        </ul>
    </div>
</template>

<style lang="postcss">
    .account{
        .vip{
            background-image: url(./img/bg.jpg);
            background-size: 100%;
            padding: 20px 2% 0 2%;
        }
        .level_logo{
            width: 35%;
            margin: 0 auto;
            display: block;
        }
        .user_id{
            text-align: center;
            padding: 20px 0;
        }

        .progress_box{
            padding-bottom: 20px;
            h4{
                padding-bottom: 8px;
                color: #ffad17;
            }
        }
        .function{
            display: flex;
            background-color: #222;
            padding: 20px 0;
            li{
                text-align: center;
                flex: 1;
                position: relative;
            }
            .icon{
                display: inline-block;
                width: 80px; 
                height: 80px;
                margin-bottom: 10px;
                background-size: 100%;
            }
            .transfer{
                background-image: url(./img/transfer.png);
            }
            .reward{
                background-image: url(./img/reward.png);
            }
            .reward{
                background-image: url(./img/reward.png);
            }
            .coupon{
                background-image: url(./img/coupon.png);
            }
            .search{
                background-image: url(./img/search.png);
            }
        }

        .account_link{
            padding-top: 20px;
            &:last-child{
                padding-bottom: 30px;
            }
            li{
                display: flex;
                justify-content: space-between;
                background-color: #222;
                padding: 0 2%;
                line-height: 80px;
                border-bottom: 1PX solid #333;
                &:last-child{
                    border: none;
                }
                i{
                    font-size: 30px;
                    transform: scaleX(-1);
                }
                span{
                    padding: 0 18px;
                }
                .name,.data{
                    display: flex;
                }
                .name .iconfont{
                    color: #666;
                    font-size: 40px;
                    width: 42px;
                }
            }
            .sign_out{
                display: block;
                text-align: center;
            }
        }
        .count{
            position: absolute;
            top: 0;
            right: .6rem;
            padding: 0 10px;
            height: 30px;
            min-width: 30px;
            background: red;
            font-size: 24px;
            line-height: 30px;
            border-radius: 50%;
        }
        
    }
</style>

