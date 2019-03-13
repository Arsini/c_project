<script>
    export default {
        data(){
            return{
                activityList:[],
                detailShow: false,
                detailTitle: '',
                cancelDialog : false,
                customerServiceShow : true,
                rgOpenBtnShow : true,
            }
        },

        created(){
            this.user = all.tool.GetSession('user')
            if(Boolean(this.user)){
                this.getRewardList()
            }else{
                this.$router.push('/sign_in')
            }
        },

        methods:{
            getRewardList(){
                this.$api.getRewardList().then(res=>{
                    const activityList = [];
                    res.data.forEach(e => {
                        if(e.list && e.list.length > 0){
                            const code = e.code;
                            const link = e.list[0].btnOrImageList[1].btnSourceFrom;
                            const name = e.list[0].displayTitle;
                            if(e.name.indexOf("首存") != -1){
                                activityList.push({
                                    imgsrc: e.condition.imageUrl[0],
                                    code,
                                    link,
                                    name
                                })
                            }
                            if(e.name.indexOf("体验金") != -1){
                                this.experience = {
                                    code,
                                    link,
                                    name
                                }
                            }
                        }
                    });
                    this.activityList = activityList
                })
            },
            showDetail(code, link, name){
                const str = JSON.stringify(new Date());
                const hash = str.slice(0,14);
                link = link + '?' + Math.random()
                const query = {
                    code,
                    link,
                    name
                }
                this.$router.push({ path:`/reward_detail`, query, })
            },
            service24() {
                all.tool.service24()
            },
            cancelDialogYes(){
                this.cancelDialog = false;
                this.$router.push('/')
            },
            rgOpenDialog(){
                this.cancelDialog = true;
            }
        }
    }
</script>
<template>
    <div>
        <div class="rg_bg">
        </div>
        <div class="rg_wrap">
            <img src="./img/customer_service.png" v-show="customerServiceShow" @click="service24" class="rg_customerService" />
            <img src="./img/rg_open_btn.png" v-show="rgOpenBtnShow" @click="rgOpenDialog" class="rg_open_dialog" />
            <img src="./img/rg_user_bg.png" />
            <div class="rg_info">
                <span class="rg_username">尊敬的用户{{ Boolean(user) ? user.name : '' }}<br/>恭喜您成功开户！</span>
                <router-link to="/account/discount/006" tag="img" :src="require('./img/receive_btn.png')" class="rg_receive" />
                <router-link to="/recharge/recharge_alipay" tag="img" :src="require('./img/recharge_btn.png')" class="rg_recharge" />
                <div class="rg_method_info">
                    <span class="rg_text">全充值渠道100%支持</span>
                    <img src="./img/rg_alipay.png" class="rg_method " />
                    <img src="./img/rg_wechat.png" class="rg_method " />
                    <img src="./img/rg_qq.png" class="rg_method " />
                    <img src="./img/rg_union.png" class="rg_method rg_method_union" />
                </div>
            </div>
            <div class="rg_new_activity_title">
                <img src="./img/rg_newplay.png" />
            </div>
            <div class="rg_new_activity">
                <div v-for="item in activityList" :key="item.imgsrc" @click="showDetail(item.code, item.link, item.name)" class="rg_activity_item">
                    <img :src="item.imgsrc"/>
                </div>
            </div>
            <div class="rg_cancel_dialog" v-show="cancelDialog">
                <div class="rg_cancel_bg">
                </div>
                <div class="rg_cancel">
                    <img src="./img/rg_dialog.png" />
                    <div class="rg_cancel_info">
                        <span class="rg_cancel_text">新手引导页面关闭将无法再次开启 是否要确认关闭页面？</span>
                        <div class="rg_cancel_btn">
                            <button @click="cancelDialogYes" class="rg_cancel_btnyes">是</button>
                            <button @click="cancelDialog = false" class="rg_cancel_btnno">否</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
    .rg_bg{
        background: url("./img/bg.jpg") no-repeat fixed;
        background-size: 100% 100%;
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        bottom: 55px;
    }
    .rg_wrap{
        margin-top: -50px;
        position: relative;
        z-index: 1;
        text-align: center;
        .rg_open_dialog{
            position: absolute;
            top:8px;
            right:8px;
            width: 0.4rem;
            z-index: 5;
        }
        .rg_customerService{
            position: absolute;
            top:8px;
            left:8px;
            width:2rem;
            z-index: 5;
        }
        .rg_cancel_dialog{
            top: 0px;
            width: 100%;
            height: 100%;
            position: fixed;
            text-align: center;
            z-index: 10;
            .rg_cancel_bg{
                opacity: 0.5;
                background-color: #000;
                position: absolute;
                height: 100%;
                width: 100%;
            }
            .rg_cancel{
                width: 8rem;
                left: 50%;
                margin-left: -4rem;
                margin-top: 2rem;
                position: absolute;
                .rg_cancel_info{
                    position: absolute;
                    top: 1.6rem;
                    padding: 15px;
                    color:#666666;
                    .rg_cancel_text{
                        font-size: 12px;
                    }
                    .rg_cancel_btn{
                        margin-top: 0.3rem;
                        button{
                            color:#fff;
                            font-size: 14px;
                            background-color: #ffc80b;
                            padding: 3px;
                            display: inline-block;
                            background-color: #ffc80b;
                            width: 1.2rem;
                            margin-left: 0.5rem;
                            margin-right: 0.5rem;
                            border-radius: 0.2rem;
                        }
                    }
                }
            }
        }
    }
    .rg_info{
        position: absolute;
        top:0px;
        width: 100%;
        text-align: center;
        .rg_username{
            font-size: 0.4rem;
            text-align: center;
            height: 0.6rem;
            line-height: 0.6rem;
            margin-top: 4.1rem;
            display: inline-block;
            color: #000;
        }
        .rg_receive{
            width: 3rem;
            display: block;
            margin: 5px auto 0px auto;
        }
        .rg_recharge {
            width: 5rem;
            display: block;
            margin: 35px auto 0px auto;
        }
        .rg_method_info{
            line-height: 0.4rem;
            margin-top: -15px;
            text-align: center;
            .rg_text{
                color:#fff;
                font-size: 15px;
            }
            .rg_method{
                width: 0.4rem;
                margin-left: 0.1rem;
                margin-right: 0.1rem;

                &.rg_method_union{
                    margin-top: 3px;
                }
            }
        }
    }
    .rg_new_activity_title{
        text-align: center;
        margin-top: -1.1rem;
        display: block;
        img{
            width: 5.5rem;
            max-width: 371px;
        }
    }
    .rg_new_activity{
        margin-top:0.2rem;
        margin-bottom:0.3rem;
        .rg_activity_item{
            margin-top: 0.4rem;
        }
        img{
            width: 80%;
            max-width: 541px;
        }
    }
    @media only screen and (min-width : 768px) {
        .rg_info{
            .rg_username{
                margin-top:6.3rem;
            }
            .rg_recharge{
                margin-top: 130px;
            }
        }
    }
</style>