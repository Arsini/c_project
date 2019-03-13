<script>
export default {
    props: ['orderData'],
    data(){
        return{
            btnName: '取消订单',
            sec:'--',
            cancelOrder: false,
        }
    },
    created(){
        this.sec = this.orderData.restTime;
        const timeFn = () => {
            this.sec --
            if(this.sec > 0){
                setTimeout(timeFn, 1000)
            }  else {
                this.$emit('cancelOrderStatus')
            }
        }
        timeFn()
    },
    methods:{
        goingTo(){
            window.open(this.orderData.qrcodeAddress)
        },
        cancelAlipayTopup(){
            api.cancelAlipayTopup({ proposalId: this.orderData.proposalId }).then(res=>{
                this.cancelOrder = false
                this.$emit('cancelOrderStatus')
                this.msg('取消订单成功。', 'success')
            }, err=>{
                this.cancelOrder = false
            })
        },
        //
        copyToClipBoard:function(ref){ //复制到剪切板
            const text = this.$refs[ref]
            if (document.body.createTextRange) {
                var range = document.body.createTextRange()
                range.moveToElementText(text)
                range.select()
            } else if (window.getSelection) {
                var selection = window.getSelection()
                var range = document.createRange()
                range.selectNodeContents(text)
                selection.removeAllRanges()
                selection.addRange(range)
            } else {
                this.msg('复制失败，请手动复制。', 'error')
            }
            document.execCommand("Copy")
            this.msg('复制成功。', 'success')
        },
    },
    computed:{
        formatRestTime(){
            const time = all.tool.sec_to_time(this.sec)
            return time
        }
    },
}
</script>


<template>
    <div class="alipay_order">
        <div class="alipay_info_box">
            <div class="alipay_info">
                <div class="img_info">
                    <div class="alipay_name primary_text_color">{{orderData.alipayName}}</div>
                    <div class="amount primary_text_color">￥{{orderData.amount}}</div>
                    <div class="player_name primary_text_color">{{orderData.playerName}}</div>
                </div>
                <div class="img_info_tip">
                    <img src="./img/alipay_logo.png" width="100">
                    <p class="tips_text">请勿输入不同金额</p>
                    <p class="tips_text">请输入宝运莱帐号</p>
                </div>
            </div>
        </div>
        
        <h4 class="primary_text_color alipay_order_title">充值流程</h4>
        <p>1. 付款备注请填写：<span class="focus" ref="copy_player_name">{{ orderData.playerName }}</span>（游戏账号）<button @click="copyToClipBoard('copy_player_name')" class="copy_btn">复制姓名</button></p>
        <p>2. 宝运莱支付宝收款账号：<span class="focus">{{ orderData.alipayAccount }}</span>（仅限此笔订单，系统不支持重复转账，请勿保留账号。）</p>
        <p>3. 请在 <span class="focus">{{ formatRestTime }}</span> 时间内付款，完成后请勿取消订单。</p>
        <p>4. 付款成功后将会在<span class="focus">5-10</span>分钟内添加到账。</p>
        <div class="btn_center">
            <button @click="cancelOrder = true" class="btn btn_cancel">{{ btnName }}</button>
            <button @click="goingTo" class="btn btn_primary">前往存款</button>
        </div>
        <Dialog
		title='提示' 
		:visible='cancelOrder' 
		@close="cancelOrder = false">
			<div class="dialog_text" slot="body">是否确认取消存款？</div>
            <div slot="footer">
				<div class="btn_center btn_dialog">
                    <button @click="cancelAlipayTopup" class="btn btn_secondary">确定</button>
                    <button @click="cancelOrder = false" class="btn btn_pop_cancel">取消</button>
                </div>
			</div>
        </Dialog>
    </div>
</template>

<style lang="postcss">
    .alipay_order{
        padding-top: 10px;
        .alipay_info_box{
            display: flex;
            justify-content: center;;
        }
        .alipay_info{
            display: flex;
        }
        .img_info{
            background-image: url(./img/phone.png);
            background-size: 100%;
            background-repeat: no-repeat;
            position: relative;
        }
        .alipay_name, .amount, .player_name{
            font-weight: bold;
            position: absolute;
        }
        p{
            padding-bottom: 4px;
            font-size: .34rem;
        }
        .img_info_tip{
            flex: 1;
            img{
                display: block;
            }
            .tips_text{
                font-size: .35rem;
                padding-left: 45px;
                margin-bottom: 10px;
                background-image: url(./img/arrow.png);
                background-repeat: no-repeat;
                background-position-y: center;
                background-size: auto 100% ;
            }
        }
        .alipay_order_title{
            font-size: 20px;
            padding-top: 10px;
        }
        
        .btn{
            width: 40%;
        }
        .copy_btn{
            background-color: #ffaa0d;
            color: #fff;
            border-radius: 4px;
            padding: 2px .3rem;
        }
        .dialog_text{
            color: #000;
            line-height: 60px;
            text-align: center ;
        }
        @media (min-width:319px){
            .alipay_name{
                top: 121px;
                right: 17px;
            }
            .amount{
                top: 164px;
                left: 16px;
                font-size: 12px;
            }
            .player_name{
                top: 182px;
                left: 18px;
                font-size: 12px;
            }
            .img_info{
                width: 140px;
                height: 280px;
            }
            .img_info_tip{
                img{
                    margin:28px auto;
                }
            }
        }
         @media (min-width:414px){
            .alipay_name{
                top: 130px;
                right: 24px;
            }
            .amount{
                top: 177px;
                left: 16px;
                font-size: 12px;
            }
            .player_name{
                top: 194px;
                left: 18px;
                font-size: 12px;
            }
            .img_info{
                width: 150px;
                height: 300px;
            }
            .img_info_tip{
                img{
                    margin: 34px auto;
                }
            }
        }
        
    }
</style>
