<script>
export default {
    data(){
        const validateAmount = (val, cb) => {
            const max = this.minMaxCommonTopupAmount.max;
            const min = this.minMaxCommonTopupAmount.min;
             if(!all.tool.isNumber(val)){
                let temp = /[^0-9]/g;
                this.form.amount = this.form.amount.replace(temp, "")
                cb(' ')
                return false
            } else if(val <= max && val >= min) {
                cb()
            } else {
                cb(`存款金额必须 ${min} - ${max}`)
                return false
            }
        }
        return{
            form: {
                amount: '',
                clientType: 2,
                bonusCode: '',
                topUpReturnCode: '',
                limitedOfferObjId: '',
            },
            rules: {
                amount: {
                    required: '请输入存款金额',
                    validator: validateAmount,
                },
            },
            rewardList: [],
            selectReward: '',//
            minMaxCommonTopupAmount: '',
            visible: false,
            rep: {},
        }
    },
    created(){
        this.$store.commit('WINDOW_LOADING', true)
        this.getRewardList()
        this.$api.getMinMaxCommonTopupAmount().then(res=>{
            const min = all.tool.GetLocal('getConfig').minDepositAmount;
            const { maxDepositAmount, minDepositAmount } = res.data;
            const realMin = minDepositAmount >= min? minDepositAmount : min;
            this.minMaxCommonTopupAmount = {
                max: maxDepositAmount,
                min: realMin,
            }
            this.$store.commit('WINDOW_LOADING', false)
        })
    },
    methods: {
         /* API */
        _createCommonTopupProposal: data => all.net.send({
            service: 'payment',
            functionName: 'createCommonTopupProposal',
            data,
        }),
        
        //获取优惠列表
        getRewardList(){
            this.$api.getRewardList().then(res=>{
                const url = location.hostname;
				this.$api.getTemplateSetting({ url }).then(r=>{
                    const dataLength = r.data.length > 0;
                    const isHave = dataLength? (r.data[0].functionList).find(e => e.functionId == 1) : false;
                    const rewardList = [{
                        id: -1,
                        name: "优惠代码",
                    }];
                    res.data.forEach(e => {
                        if(e.type.des == "PlayerTopUpReturnGroup" && all.tool.noShowReal(e.showInRealServer)){
                            if(e.name == "新手礼包"){
                                if(isHave){
                                    rewardList.push({
                                        id: e.code,
                                        name: e.name,
                                    })
                                }
                            }else {
                                rewardList.push({
                                    id: e.code,
                                    name: e.name,
                                })
                            }
                        }
                    });
                    this.rewardList = rewardList
				})
            })
        },

        onSubmit(){
            if(all.tool.validateForm(this)){
                this.$store.commit('WINDOW_LOADING', true)
                this._createCommonTopupProposal(this.form).then(res=>{
                    this.visible = true
                    this.rep = res.data
                    this.$store.commit('WINDOW_LOADING', false)
                })
            }
        },

        confirm(){
            window.open(this.rep.url)
            this.visible = false
        },

        cancel(){
            this.visible = false
        }
    },
    watch: {
        selectReward(){
            if(this.selectReward != -1){
                this.form.topUpReturnCode = this.selectReward
                this.form.bonusCode = ''
            } else {
                this.form.topUpReturnCode = ''
            }
        }
    }
}
</script>

<template>
    <div class="recharge">
        <form class="wrap white_form">
            <div class="recharge_head">
                <img src="./img/head_bg_left.png" height="100%">
                <img src="./img/head_bg_right.png" height="100%">
            </div>
            <FormItem
            icon='icon-deposit'
            :rule='rules.amount'
            :placeholder='`请输入存款金额 ${minMaxCommonTopupAmount.min} - ${minMaxCommonTopupAmount.max}`'
            ref='amount'
            type='tel'
            v-model="form.amount"/>
            <FormSelect
            icon='icon-youhui'
            :options='rewardList'
            v-model="selectReward"
            placeholder='请选择优惠'/>
            <FormItem
            v-if="selectReward == -1"
            icon='icon-haoma'
            :rule='rules.bonusCode'
            :placeholder='`请输入优惠代码`'
            ref='bonusCode'
            type='tel'
            v-model="form.bonusCode"/>
            <div class="btn_center">
                <button @click.prevent="onSubmit" class="btn btn_secondary">确认</button>
            </div>  
        </form>
        <Dialog
		title='温馨提示' 
		:visible='visible' 
		@close="cancel">
			<div slot="body">
                <p class="recharge_p">金额：{{ rep.amount }}</p>
                <p class="recharge_p">提案号：{{ rep.proposalId }}</p>
            </div>
            <div slot="footer">
				<div class="btn_center btn_dialog">
                    <button @click="confirm" class="btn btn_secondary">确定</button>
                    <button @click="cancel" class="btn btn_pop_cancel">取消</button>
                </div>
			</div>
        </Dialog>
    </div>
</template>

<style lang="postcss">
    .recharge{
        background-image: url(~img/form_bg.jpg);
        background-repeat: no-repeat;
        padding-top: 10px;
        .captcha_zoom{
            display: flex;
            justify-content: space-between;
        }
        .sms_box{
            position: relative;
            flex: 1;
        }
        .service24{
            position: absolute;
            top: 0;
            right: 0;
            line-height: 42px;
        }
        .get_sms{
            height: 42px;
            width: 110px;
            margin-right: 0;
            text-align: center;
        }
        form{
            width: 90%;
            margin: 0 auto;
            padding-top: .5rem;
            background-color: #fff;
            border-radius: 4px;
            margin-top: 3vh;
            position: relative;
            padding-top: 75px;
            padding-bottom: 10px;
        }

        .recharge_head{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background-color: #ffaa0d;
            height: 60px;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
        }

        .recharge_p{
            text-align: center;
            padding: 5px 0;
        }
    }
</style>
