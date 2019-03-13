<script>
export default {
    props: ['promoCodeData'],
    data:()=>({
        promoCodeSide: [
            '未使用',
            '已领取',
            '已过期',
            '说明',
        ],
        current: '未使用',
        promoCodeRender: [],
        inputCode: '',
    }),
    created(){
        if(this.$store.state.isSignIn){
            if(this.promoCodeData){
                this.tab('未使用')
            }
        } else {
            this.$router.push('/sign_in')
            this.msg('请先登陆')
        }
        
    },
    watch:{
        promoCodeData(){
            this.tab('未使用')
        }
    },
    methods:{
        /* API */
        //领取优惠券
        _applyPromoCode: data => all.net.send({
            service: 'reward',
            functionName: 'applyPromoCode',
            data,
        }),
        
        tab(name) {
            this.current = name
            switch(name) {
                case '未使用':
                    const noUseList = this.promoCodeData.noUseList? (this.promoCodeData.noUseList).reverse() : [];
                    this.promoCodeRender = noUseList;
                    break;
                case '已领取':
                    const usedList = this.promoCodeData.usedList? (this.promoCodeData.usedList).reverse() : [];
                    this.promoCodeRender = usedList;
                    break;
                case '已过期':
                    const expiredList = this.promoCodeData.expiredList? (this.promoCodeData.expiredList).reverse() : [];
                    this.promoCodeRender = expiredList;
                    break;
                default: this.promoCodeRender = [];
                    break;
            }
        },
        applyPromoCode(promoCode, index, other) {
            const isRealPlayer = all.tool.GetSession('user').isRealPlayer;
            let btn = '立即领取';
            if(index){
                const btn =  this.$refs['apply'][index].innerText;
            }
            if(isRealPlayer && btn == '立即领取'){
                if(this.inputCode && other){
                    this.$refs['otherApply'].innerText = '正在领取...'
                } else if(other) {
                    this.msg('请填写优惠代码', 'error')
                    return false
                } else if(!all.tool.isUndefined(index) && !other){
                    this.$refs['apply'][index].innerText = '正在领取...'
                }
                this._applyPromoCode({promoCode}).then(res=>{
                    let rewardAmount
                    if(res.data){
                        if(res.data.maxRewardAmount) {
                            rewardAmount = res.data.amount <= res.data.maxRewardAmount? res.data.amount : res.data.maxRewardAmount
                        } else {
                            rewardAmount = res.data.amount
                        }
                        this.msg('成功领取优惠'+ rewardAmount +'元', 'success')
                    } else {
                        this.msg('成功领取优惠', 'success')
                    }
                    if(!all.tool.isUndefined(index)){
                        this.$emit('applyCoupon', index)
                    }
                    this.$refs['apply'][index].innerText = '立即领取'
                },err=>{
                    all.tool.SetSession('promoCode', promoCode)
                    this.$router.push({ path: '/recharge' })
                })
            }
        },
    },
}
</script>

<template>
    <div class="coupon">
        <ul class="tab">
            <li 
            v-for="item in promoCodeSide" 
            :key='item'
            @click="tab(item)"
            :class="{'current': item == current}">{{ item }}</li>
        </ul>
        <!-- 优惠代码列表 -->
        <ul class="coupon_list">
            <li v-for="(val, key) in promoCodeRender" :key="key">
                <div class="left_content">
                    <h3>{{ val.tag }}</h3>
                    <p>存款返利：{{ val.title }}</p>
                    <p>所需流水：{{ val.bonusLimit? ( `存款+优惠的${val.validBet}倍流水` ) : `${val.validBet}有效投注额`}}<span v-show='!val.isSharedWithXIMA'>(不享受洗码)</span></p>
                    <p>指定游戏：{{val.groupName? `${val.groupName}游戏` : '全部游戏'}}</p>
                    <p>领取条件：<i v-html='val.condition'></i>{{val.bonusLimit? `，优惠上限${val.bonusLimit}元` : ''}}</p>
                    <p>使用期限：{{ (val.expireTime).getDate() }}</p>
                </div>
                <div class="right_content">
                    <div class="right_content_box" :class="{'no_apply': current != '未使用'}">
                        <h4>优惠代码</h4>
                        <p>{{ val.bonusCode }}</p>
                        <button v-show='current == "未使用"' @click='applyPromoCode(val.bonusCode, key)' :ref="`apply`">立即领取</button>
                    </div>
                    <div class="top_radius"></div>
                    <div class="bottom_radius"></div>
                </div>
                <div class="bg_font"></div>
            </li>
        </ul>

        <!-- 没有优惠劵 -->
        <div v-show="current == '未使用' && promoCodeRender.length == 0" class="no_coupon">
            <img src="./img/no_coupon.png">
            <p>抱歉 当前没有可领优惠券哦~</p>
        </div>
        
        <!-- 说明 -->
        <div v-show="current == '说明'" class="wrap">
            <div class="coupon_tip_title">使用攻略</div>
                <div class="coupon_tip_content">
                <div>
                    <h4>什么是优惠代码？</h4>
                    <p>会员在获得优惠代码后，可以当做兑换券使用，并且可立刻获得专属优惠奖金。</p>
                </div>
                <div>
                    <h4>如何查询优惠代码？</h4>
                    <p>会员可在登入帐号后，查看站内信息或是查看您绑定联系电话中的短信。</p>
                </div>
                <div>
                    <h4>如何获得优惠代码？</h4>
                    <p>每天由系统随机抽选，会员只要持续参与游戏，将有机会不断中奖。</p>
                </div>
                <div>
                    <h4>优惠代码的有效期是多久？</h4>
                    <p>每一个优惠代码都有使用期限，到期日皆不同，请把握提交时间。</p>
                </div>
            </div>
        </div>

        <!-- 优惠代码输入框 -->
        <div v-show='current == "未使用"' class="input_code">
            <input v-model="inputCode" type="tel"  placeholder="优惠代码">
            <button @click='applyPromoCode(inputCode, "", "other")' ref="otherApply" class="btn btn_secondary fr">立即领取</button>
        </div>
    </div>
</template>

<style lang="postcss">
    .coupon{
        .coupon_list{
            padding-bottom: .5rem;
            li{
                width: 96%;
                margin: 0 auto;
                border-radius: .1rem;
                margin-top: 20px;
                display: flex;
                overflow: hidden;
                background: linear-gradient(to bottom right, #fe6464, #a83131);
                position: relative;
                .bg_font{
                    width: 210px;
                    height: 210px;
                    background-size: cover;
                    position: absolute;
                    top: 1.9rem;
                    right: 28%;
                    background-image: url(./img/bg.png);
                }
                .right_content{
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px 0 26px 0;
                    position: relative;
                    .right_content_box{
                    }
                    .no_apply{
                        height: 58px;
                    }
                    h4{
                        font-size: 30px;
                        font-weight:normal;
                        color: #fff;
                    }
                    p{
                        font-size: 1rem;
                        font-weight: bold;
                        line-height: 80px;
                        font-size: 60px;
                    }
                    button{
                        color: #fff;
                        border: 1PX solid #fff;
                        border-radius: 0.1rem;
                        padding: 10px 20px;
                        margin-top: 0.3rem;
                    }
                    .top_radius,.bottom_radius{
                        width:12px;
                        height:6px;
                        background:#000;
                        position: absolute;
                        left: -7px;
                    }
                    .top_radius{
                        border-radius:0 0 50px 50px;
                        top: 0;
                    }
                    .bottom_radius{
                        border-radius:50px 50px 0 0;
                        bottom: 0;
                    }
                }
                .left_content{
                    padding: 16px 0 20px 2.5%;
                    width: 64%;
                    border-right: 1px dotted #fff;
                    h3{
                        font-size: 50px;
                        padding-bottom: 12px;
                        color:#ffcb6c;
                    }
                    p{
                        padding: 6px 0;
                        font-size: .35rem;
                        .c_color{
                            color: #ffcb6c;
                        }
                    }
                }
            }
        }
        .input_code{
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            position: fixed;
            width: 100%;
            bottom: 98px;
            input{
                flex:1;
                padding-left:2%;
            }
            .btn{
                margin: 0;
                width: 220px;
                border-radius: 0;
            }
        }
        .coupon_tip_title{
            color:#ffaa0d;
            line-height: 250%;
            font-size: 40px;
            font-weight: bold;
        }
        .coupon_tip_content{
            div{
                margin-bottom: 0.3rem;
                border-bottom: 1PX solid #333333;
                padding-bottom: 0.2rem;
                h4{
                    color:#fff;
                    line-height: 200%;
                    font-size: 28px;
                }
                p{
                    color:#999999;
                    line-height: 150%;
                }
            }
        }

        .no_coupon{
            text-align: center;
            img{
                width: 60%;
            }
            p{
                font-size: 18px;
                margin-top: .5rem;
                color: #999;
            }
        }
    }
</style>

