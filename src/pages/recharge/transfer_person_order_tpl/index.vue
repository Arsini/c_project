<script>
export default {
    props: ['orderData'],
    data(){
        return{
            cancelOrder: false,
            sec:'--',
            depositName: '',
        }
    },
    created(){
        this.depositName = this.orderData.depositMethod == '4'? '支付宝' : '微信';
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
    computed:{
        formatRestTime(){
            const time = all.tool.sec_to_time(this.sec)
            return time
        }
    },
    methods:{
        cancel(){
            this.cancelOrder = true
        },
        cancelAlipayTopup(){
            const cancelApi = this.orderData.depositMethod == '4'? 'cancelAlipayTopup' : 'cancelWechatTopup';
            api[cancelApi]({ proposalId: this.orderData.proposalId }).then(res=>{
                this.cancelOrder = false
                this.$emit('cancelOrderStatus')
                this.msg('取消订单成功。', 'success')
            }, err=>{
                this.cancelOrder = false
            })
        }
    },
}
</script>

<template>
    <div class="transfer_person_order_tpl">
        <img :src="orderData.QRCode" class="rq_code">
        <p class="transfer_person">向个人用户 <span class="focus">{{ orderData.account }}</span> 转帐</p>
        <p class="pay_info">存款金额: <span class="focus">{{ orderData.amount }}</span>元</p>
        <p class="pay_info">付款说明: <span class="focus">{{ orderData.playerName }}</span></p>
        <ul class="tips">
            <li>1. 请在<span class="focus"> {{ formatRestTime }} </span>时间内扫描上方二维码</li>
            <li>2. 打开{{ depositName }}扫一扫</li>
            <li>3. 向宝运莱个人{{ depositName }}号<span class="focus"> {{ orderData.account }} </span>转帐 [昵称]<span class="focus"> {{ orderData.name }} </span>，（注意{{ depositName }}帐号不定期更换，每笔充值前请确实核对订单信息）</li>
            <li>4. 转帐金额请填写<span class="focus"> {{ orderData.amount }} </span>元。</li>
            <li>5. 添加留言请填写：<span class="focus"> {{ orderData.playerName }} </span>（注意：此为核实转帐依据，请务必填写以免耽误您的时间）</li>
            <li>6. 点击转帐，输入您个人转帐密码。</li>
            <li>7. 转帐成功后金額将在 5 分钟内自动添加至会员帐号。</li>
        </ul>
        <div class="btn_center">
            <button @click="cancel" class="btn btn_cancel">取消订单</button>
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
    .transfer_person_order_tpl{
        padding-top: 10px;
        .transfer_person{
            text-align: center;
        }
        .rq_code{
            width: 256px;
            height: 256px;
            display: block;
            margin: 0 auto;
        }
        .dialog_text{
            color: #000;
            line-height: 60px;
            text-align: center ;
        }
        .pay_info{
            text-align: left;
            line-height: 40px;
            border-bottom: 1px solid #fff;
        }
        .tips{
            padding: 20px 0;
            li{
                text-align: left;
                line-height: 30px;
            }
        }
        .cancel_box{
            padding: 30px 0;
        }
    }
</style>

