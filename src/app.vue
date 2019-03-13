<script>
import PageHeader from 'components/header';
import FooterNav from 'components/footer_nav';
import Service from 'components/service';
import Sidebar from 'components/sidebar'

const CallbackToUser = () => ({ component: import(/* webpackChunkName: "callback_to_user" */ 'components/callback_to_user') });
const ForgetAccount = () => ({ component: import(/* webpackChunkName: "forget_account" */ 'components/forget_account') });
const ForgetPassword = () => ({ component: import(/* webpackChunkName: "forget_password" */ 'components/forget_password') });
export default {
    components:{
        PageHeader,
        FooterNav,
        Service,
        CallbackToUser,//申请回电
        ForgetAccount,//忘记账号
        ForgetPassword,//忘记密码
        Sidebar, //侧边导航
    },
    data(){
        return {
            promoCodeData: '',
            mailList: [],
            showPhone: false,
            serviceComponent: false,
            isWechat: false,
            wechatUrl: '',
            dialogTitle: '',
            dialogContent: '',
            visible: false,
            isForgetAccount: false,//忘记账号
            isForgetPassword: false,//忘记密码
        }
    },
    created(){
        const domain = location.hostname;
        this._addIpDomainLog({ domain })
        this.submitDXCode()
        this.getConfig()//获取平台基础配置
        this.getAllLevel()//获取等级配置
        this.isSignIn()//判断是否登陆
        this.notifyNewMail()//通知玩家有新的站内信
        this.notifyLiveGameStatus()
        this.$api.getBankTypeList()//获取银行列表
    },
    watch:{
        '$store.state.isSignIn'(){
            this.getMailList()//获取站内信
            this.getPromoCode()//获取优惠券
        },
    },
    methods: {
        /* API */
        //通知玩家有新的站内信
        _notifyNewMail: fun => all.net.from({
            service: 'player',
            functionName: 'notifyNewMail',
            fun,
        }),

        _notifyLiveGameStatus: fun => all.net.from({
            service: 'player',
            functionName: 'notifyLiveGameStatus',
            fun,
        }),
        
        //获取平台设置
        _getConfig: data => all.net.send({
            service: 'platform',
            functionName: 'getConfig',
            data,
        }),
        //获取游戏树
        _getGameGroupTreeInfo: data => all.net.send({
            service: 'game',
            functionName: 'getGameGroupTreeInfo',
            data,
        }),
        //获取全部玩家等级
        _getAllLevel: data => all.net.send({
            service: 'playerLevel',
            functionName: 'getAllLevel',
            data,
        }),

        //获取优惠券
        _getPromoCode: data => all.net.send({
            service: 'reward',
            functionName: 'getPromoCode',
            data,
        }),

        //获取未读取站内信
        _getMailList: data => all.net.send({
            service: 'player',
            functionName: 'getMailList',
            data,
        }),

        //获取未读取站内信
        _addIpDomainLog: data => all.net.send({
            service: 'platform',
            functionName: 'addIpDomainLog',
            data,
        }),

        //提交电销代码(自动登录)
        _submitDXCode: data => all.net.send({
            service: 'dxmission',
            functionName: 'submitDXCode',
            data,
        }),

        //通知玩家有新的站内信
        notifyNewMail(){
            this._notifyNewMail(res=>{
                const data = res.data;
                const couponFlag = (data.title).indexOf("优惠券") != -1;
                const rechargeFlag = (data.title).indexOf("存款成功通知") != -1;
                this.getMailList()//获取站内信
                
                if(couponFlag){
                    this.getPromoCode()//获取优惠券
                }
                // if(rechargeFlag){

                // }
                // if(couponFlag || rechargeFlag){
                //     this.visible = true
                //     this.dialogTitle = data.title
                //     this.dialogContent = data.content
                // }
                this.visible = true
                this.dialogTitle = data.title
                this.dialogContent = data.content
            })
        },

        //
        notifyLiveGameStatus(){
            this._notifyLiveGameStatus(res=>{
                log(res)
            })
        },

        //获取站内信
        getMailList(){
            if(this.$store.state.isSignIn){
                this._getMailList().then(res=>{
                    let mailList = [];
                    res.data.forEach(e => {
                        mailList.push({
                            _id: e._id,
                            title: e.title,
                            content: e.content,
                            createTime: e.createTime,
                            hasBeenRead: e.hasBeenRead,
                        })
                    });
                    this.mailList = mailList.reverse()
                })
            } else {
                this.mailList = []
            }
        },

        //获取平台基础配置
        getConfig(){
            this._getConfig({ device: 3 }).then(res=>{
                this.getGameGroupTreeInfo()//获取游戏树
                all.tool.SetLocal('getConfig', res.data)
                this.$store.commit('CONFIG', true)
            })
        },

        //获取游戏树
        getGameGroupTreeInfo(){
            this._getGameGroupTreeInfo({ containGames: false }).then(res=>{
                const obj = (res.data.gameGroups).find(o => o.name == "手机端")
                all.tool.SetLocal('getGameGroupTreeInfo', obj)
                this.$store.commit('GAME_TREE_INFO', true)
            })
        },

        //获取等级配置
        getAllLevel(){
            this._getAllLevel().then(res=>{
                all.tool.SetLocal('getAllLevel', res.data)
            })
        },

        //判断是否登陆
        isSignIn(){
            const isSignIn = all.tool.GetSession('user');
            if(isSignIn){
                this.$store.dispatch('GET_CREDIT_DETAIL')//获取账户余额
                this.$store.commit('IS_SIGN_IN', true)//登陆
            }
        },

        //获取优惠券
        getPromoCode(){
            const playerId = all.tool.GetSession('playerId');
            const user = all.tool.GetSession('user');
            const isRealPlayer = user? user.isRealPlayer : false;
            if(user && isRealPlayer){
                this._getPromoCode({ playerId }).then(res=>{
                    this.promoCodeData = res.data
                })
            }
        },

        //已领取优惠券
        applyCoupon(key){
            const used =  this.promoCodeData.noUseList[key];
            this.promoCodeData.usedList.push(used)
            this.promoCodeData.noUseList.splice(key, 1)
        },

        //开启/关闭 弹窗
        popFlag(name, flag){
            this[name] = flag
        },

        //
        openWechat(url){
            this.wechatUrl = url
            this.isWechat = true
        },
        //
        closeWechat(){
            this.isWechat = false
        },

        //电销自动登录
        submitDXCode(){
            const code = sessionStorage.getItem('tm');
            if(code){
                const domain = window.location.origin
                this.msg('正在登录...', 'success')
                this.$store.commit('WINDOW_LOADING', true)
                this._submitDXCode({ code, domain }).then(res=>{
                    const obj = this.getValue(res.data.redirect);
                    this.$api.authenticate(obj).then(res=>{
                        this.$api.get({ playerId: obj.playerId }).then(res=>{
                            all.tool.SetSession('user',res.data)
                            all.tool.SetSession('token',obj.token)
                            all.tool.SetSession('playerId',res.data.playerId)
                            this.$store.commit('IS_SIGN_IN', true)//登陆
                            sessionStorage.removeItem('tm')
                            this.msg('登录成功', 'success')
                            this.$store.commit('WINDOW_LOADING', false)
                        },err=>{
                            this.$store.commit('WINDOW_LOADING', false)
                        })
                    },err=>{
                        this.$store.commit('WINDOW_LOADING', false)
                    })
                })
            }
        },

        getValue(url){
            //首先获取地址
            var url = url || window.location.href;
            //获取传值
            var arr = url.split("?");
            //判断是否有传值
            if(arr.length == 1){
                return null;
            }
            //获取get传值的个数
            var value_arr = arr[1].split("&");
            //循环生成返回的对象
            var obj = {};
            for(var i = 0; i < value_arr.length; i++){
                var key_val = value_arr[i].split("=");
                obj[key_val[0]]=key_val[1];
            }
            return obj;
        },

        //关闭dialog
        closeDialog(){
            this.visible = false
            if((this.dialogTitle).indexOf("存款成功通知") != -1){
                window.location.reload()
            }
            this.dialogTitle = ''
            this.dialogContent = ''
        },

        //readMail
        readMail(key){
            this.mailList[key].hasBeenRead = true
        },
        //bDelete
        bDelete(key){
            this.mailList.splice(key, 1);
        },
    }
}
</script>

<template>
    <div class="app">
        <!-- 头部 -->
        <PageHeader
        @popFlag='popFlag'
        :mailList='mailList'
        :serviceComponent='serviceComponent'/>
        <!-- 主体 -->
        <transition name="fade">
            <router-view
            @readMail='readMail'
            @bDelete='bDelete'
            @applyCoupon='applyCoupon'
            :promoCodeData='promoCodeData'
            :mailList='mailList'
            @popFlag='popFlag'
            class="page_layout wrapper"/>
        </transition>
        <!-- 底部 -->
        <FooterNav />
        <!-- 侧边栏 -->
        <Sidebar />
        <!-- 客服工具 -->
        <transition name="slide">
            <Service
            @popFlag='popFlag'
            @openWechat='openWechat'
            v-if="serviceComponent"/>
        </transition>
        <!-- 申请回电 -->
        <CallbackToUser
        v-if='showPhone'
        @popFlag='popFlag'/>
        <!-- 微信客服 -->
        <Dialog
		title='微信客服' 
		:visible='isWechat' 
		@close="closeWechat">
			<div slot="body" class="wechat_box">
                <p>微信客服长按下载</p>
                <img :src="wechatUrl">
                <p>下载后，微信扫码选择『相册』扫码</p>
            </div>
        </Dialog>
        <!-- 忘记账号 -->
        <ForgetAccount
        v-if="isForgetAccount"
        @popFlag='popFlag'/>
        <!-- 忘记密码 -->
        <ForgetPassword
        v-if="isForgetPassword"
        @popFlag='popFlag'/>
        <!-- 服务器通知弹窗 -->
        <Dialog
		:title='dialogTitle' 
		:visible='visible' 
		@close="closeDialog">
			<div slot="body" class="server_msg" v-html="dialogContent"></div>
            <div slot="footer">
				<div class="btn_center btn_dialog">
                    <button @click="closeDialog" class="btn btn_primary">确定</button>
                </div>
			</div>
        </Dialog>
        <!-- 全屏loading -->
        <Loading :isShow='$store.state.windowLoading' type='window'/>
    </div>
</template>

<style lang="postcss">
    .app{
        height: 100%;
    }
    .wrapper{
        max-width: 750PX;
    }
    .page_layout{
        position: absolute;
        top: 88px;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
        padding-bottom: 98px;
    }
    .wechat_box{
        text-align: center;
        padding: 10px 0 20px 0;
        img{
            margin: 10px 0;
        }
    }
    .server_msg{
        line-height: 38px;
    }

    /* 客服动画 */
    .slide-enter, .slide-leave-to{
        transform:translate3d(50%,0,0);
    }
    .slide-enter-to, .slide-leave{
        transform:translate3d(0,0,0);
    }
    .slide-enter-active, .fade-leave-active{
        transition: transform .5s;
    }
</style>
