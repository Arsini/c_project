<script>
export default {
    props: [
        'orderData',
    ],
    data(){
        return{
            cancelOrder: false,
            sec:'--',
            playerId: '',
        }
    },
    created(){
        this.playerId = all.tool.GetSession('playerId')
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
        //取消订单
        cancel(){
            this.cancelOrder = true
        },
        confirmCancel(){
            api.cancelManualTopupRequest({ proposalId: this.orderData.proposalId }).then(res=>{
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
        //存款方式
        depositMethod(){
            return all.tool.payName(this.orderData.depositMethod)
        },

        //银行卡名称
        bankName(){
            return all.tool.bankName(this.orderData.bankTypeId)
        },

        bankCardNo(){
            const bankCardNo = this.orderData.bankCardNo;
            const re = new RegExp("\\d{1,"+ 4 +"}","g");
            const ma = bankCardNo.match(re)
            return ma.join(" ")
        },

        formatRestTime(){
            const time = all.tool.sec_to_time(this.sec)
            return time
        },
    },
}
</script>


<template>
    <div class="transfer_bank_order_tpl">
        <div v-show="orderData.depositMethod == 6" class="QR_code">
            <p>{{ bankName }}</p>
            <img :src="orderData.codeAddress">
        </div>

        <div class="transfer_bank_order_tpl_block">
            <div class="pay_info">
                <ul class="info_list info_list_wrap">
                    <li>申请单号<span class="proposal_id">{{ orderData.proposalId }}</span></li>
                    <li>存款金额<span class="amount primary_text_color">{{ orderData.amount }}</span>元</li>
                    <li>存款方式<span class="deposit_method"><img :src="require(`./img/${orderData.depositMethod}.png`)" height="28">{{ depositMethod }}</span></li>
                    <li v-show="orderData.depositMethod == 3">转账编号<span class="proposal_id">{{ playerId }}</span></li>
                </ul>
                <div class="sec">
                    <p class="text primary_text_color">剩余时间</p>
                    <p>{{ formatRestTime }}</p>
                </div>
            </div>
            <p class="tip focus">* 以下卡号仅限本次有效，下次存款请重新获取</p>
        </div>
        <div class="bank_card">
            <p class="bank_info clearfix">
                <i class="iconfont icon-jiansheyinxing"></i>
                <span>{{ bankName }}</span>
            </p>
            <div class="bank_info_num">
                <p ref="bankCardNo" class="bankCard_no">{{ bankCardNo }}</p>
                <p class="user_bank_info">
                    <span ref="cardOwner">{{ orderData.cardOwner }}</span>
                    <span>{{ orderData.openingPoint}}</span>
                </p>
            </div>
            <i class="iconfont iconfont_bg icon-jiansheyinxing"></i>
        </div>
        <div class="btn_center">
            <button @click="copyToClipBoard('cardOwner')" class="btn btn_primary">复制姓名</button>
            <button @click="copyToClipBoard('bankCardNo')" class="btn btn_primary">复制卡号</button>
        </div>
        <p class="focus" style="padding-bottom: 12px;">* 支付时，请务必再次确认存款姓名以及卡号，避免存款无法即时添加。</p>
        <!-- <ul class="info_list">
            <li>
                <span>收款人姓名: <i ref="cardOwner">{{ orderData.cardOwner }}</i></span>
                <button @click="copyToClipBoard('cardOwner')" class="copy_btn">复制姓名</button>
            </li>
            <li>
                <span>收款卡号: <i ref="bankCardNo">{{ orderData.bankCardNo }}</i></span>
                <button @click="copyToClipBoard('bankCardNo')" class="copy_btn">复制卡号</button>
            </li>
            <li>银行名称：{{ bankName }}</li>
            <li v-show="orderData.depositMethod == 6">
                温馨提示：<br/>
                使用云闪付需要下载云闪付APP，下载完后打开云闪付APP扫一扫二维码即可付款。
                为了方便您快速到账，订单金额调整为{{ orderData.amount }}元，存款此金额将无需审核，5分钟内到账。
                请在指定时间内转帐至以下银行卡，卡号仅限本次有效，下次存款前请重新获取。
            </li>
        </ul> -->
        <div class="yun_text">
            <h4>温馨提示：</h4>
            <p>使用云闪付需要下载云闪付APP，下载完后打开云闪付APP扫一扫二维码即可付款。</p>
            <p>为了方便您快速到账，订单金额调整为{{ orderData.amount }}元，存款此金额将无需审核，5分钟内到账。</p>
            <p>请在指定时间内转帐至以下银行卡，卡号仅限本次有效，下次存款前请重新获取。</p>
        </div>
        <div class="btn_center">
            <button @click="cancel" class="btn btn_cancel">取消订单</button>
        </div>
        <Dialog
		title='提示' 
		:visible='cancelOrder' 
		@close="cancelOrder = false">
			<div class="dialog_text" slot="body">
                <p class="cancel_order">是否确认取消存款？</p>
            </div>
            <div slot="footer">
				<div class="btn_center btn_dialog">
                    <button @click="confirmCancel" class="btn btn_secondary">确定</button>
                    <button @click="cancelOrder = false" class="btn btn_pop_cancel">取消</button>
                </div>
			</div>
        </Dialog>
    </div>
</template>

<style lang="postcss">
    .transfer_bank_order_tpl{
        .proposal_id, .amount, .deposit_method{
            padding-left: 16px;
        }
        .info_list{
            margin-bottom: 10px;
            li{
                border-bottom: 1px solid #333;
                line-height: 34px;
                margin-bottom: 10px;
                display: flex;
            }
        }
        .info_list_wrap{
            flex: 1;
            margin-bottom: 0;
        }
        .sec{
            padding-top: .75rem;
            width: 2.5rem;
            height:2.5rem;
            border-radius: 50%;
            text-align: center;
            border: 1px solid #ffaa0d;
            margin: .3rem 0 0 .3rem;
            p{
                font-size: .4rem;
                line-height: 20px;
                font-weight: bold;
            }
            .text{
                font-size: 14px;
                font-weight: normal;
            }
        }
        .tip{
            clear: both;
        }
        .dialog_text{
            color: #000;
        }
        .focus{
            color: #ff4747;
        }
        .copy_btn{
            color: #fff;
            background-color:#ffaa0d;
            padding: 3px 8px;
            margin-left: 8px;
            border-radius: 4px;
            height: 28px;;
        }
        .pay_info{
            display: flex;
        }
        .QR_code{
            text-align: center;
            p{
                padding-bottom: 6px;
            }
            img{
                width: 50%;
            }
        }
        .cancel_order{
            text-align: center;
            min-height: 40px;
        }
        .transfer_bank_order_tpl_block{
            background-color: #282828;
            padding: 10px;
            border-radius: .1rem;
            width: 96%;
            margin: 14px auto;
        }
        .bank_card{
            padding: 20px 14px 0 14px;
            width: 96%;
            max-width: 340px;
            height: 168px;
            background: linear-gradient(to bottom right,#ff9743, #cc0885);
            border-radius: 10px;
            position: relative;
            margin: 0 auto;
            .bank_info{
                display: flex;
                line-height: 42px;
                margin-bottom: 32px;
                span{
                    font-size: 24px;
                    line-height: 38px;
                    padding-left: 10px;
                }
            }
            .iconfont{
                font-size: 40px;
            }
            .iconfont_bg{
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 140px;
                opacity: .15;
            }
            .bankCard_no{
                text-align: center;
                font-size: .6rem;
                margin-bottom: 12px;
            }
            .user_bank_info{
                display: flex;
                justify-content: space-between;
            }
        }
        .yun_text{
            width: 96%;
            margin: 0 auto;
            h4{
                margin-bottom: 6px;
            }
            p{
                line-height: 22px;
                margin-bottom: 10px;
                text-indent: 6px;
                background: url(./img/text_bg.png) no-repeat 0 5px;

            }
        }
    }
</style>

