<script>
export default {
    data(){
        const validateAmount = (value, cb) => {
            if(value<100 || value >200000){
                cb('提款金额 100元～200,000元')
                return false
            } else {
                cb()
            }
        }
        return{
            btnName: '提款',
            form:{
                amount: '',
                bonusId: 1,
            },
            rules: {
                amount: {
                    required: '请输入提款金额',
                    validator: validateAmount,
                },
            },
            data: '',
            lockList: [],
            refreshBtn: '刷新流水',
            isWithdraw: false,
        }
    },
    created(){
        const user = all.tool.GetSession('user');
        const isbindbankCard = user? user.bankAccount : false;
        if(isbindbankCard){
            this.getWithdrawalInfo()
        } else {
            this.msg('你尚未绑定银行卡，请绑定。', 'info')
			this.$router.push('/modify_bank')
        }
    },

    methods:{
        /* API */
        //登入后获取提款信息
        _getWithdrawalInfo: data => all.net.send({
            service: 'player',
            functionName: 'getWithdrawalInfo',
            data,
        }),
        //提款
        _applyBonus: data => all.net.send({
            service: 'payment',
            functionName: 'applyBonus',
            data,
        }),

        //
        getWithdrawalInfo(){
            this.lockList = []
            this.refreshBtn = '刷新中...'
            this._getWithdrawalInfo().then(res=>{
                const data = res.data;
                const currentFreeAmount = all.tool.fixedNum(data.currentFreeAmount, 0);
                const freeAmount = all.tool.fixedNum(data.freeAmount, 0);
                this.data = data;
                if(data.freeAmount > data.currentFreeAmount || data.lockList.length > 0) { //有锁大厅 或者 没有达到 流水时
                    if(freeAmount > currentFreeAmount){
                        this.lockList.push({
                            currentLockAmount: all.tool.formatNumber(currentFreeAmount),
                            lockAmount: all.tool.formatNumber(freeAmount),
                            name: '全大厅流水要求',
                            percent: (data.currentFreeAmount / data.freeAmount) * 100,
                        })
                    }
                    this.formatLockList(data.lockList)
                } else {
                    this.isWithdraw = true
                }
                this.refreshBtn = '刷新流水'
            })
        },

        //
        formatLockList(lockList){
            const arr = [];
            lockList.forEach(e => {
                const percent = all.tool.fixedNum(e.currentLockAmount / e.lockAmount, 2) * 100;
                const lockAmount = all.tool.fixedNum(e.lockAmount, 0);
                const currentLockAmount = all.tool.fixedNum(e.currentLockAmount, 0);
                arr.push({
                    currentLockAmount: all.tool.formatNumber(currentLockAmount),
                    lockAmount: all.tool.formatNumber(lockAmount),
                    name: e.name,
                    percent,
                })
            });
            this.lockList = this.lockList.concat(arr)
        },

        //onSubmit
        onSubmit(){
            if(all.tool.validateForm(this) && this.btnName == '提款'){
                this.btnName = '提交中...'
                this._applyBonus(this.form).then(res=>{
                    this.$store.dispatch('GET_CREDIT_DETAIL')
                    this.form.amount = ''
                    this.msg('提款申请成功，请等待审核出款。', 'success')
                    this.btnName = '提款'
                },err=>{
                    this.btnName = '提款'
                })
            }
        }
    },
    computed:{
        //服务费
        serviceCharge(){
            return all.tool.fixedNum(this.data.serviceCharge * 100, 2)
        }
    },
}
</script>

<template>
    <div class="account_withdraw wrap">
        <div class="withdraw_info clearfix">
            <div class="amount_box">
                <div class="amount">
                    <h4>账户余额</h4>
                    <i class="iconfont icon-qianqian-"></i>
                    <span>{{ $store.state.accountBalance }}</span>
                </div>
                <div class="amount withdraw_amount">
                    <h4>可提款额度</h4>
                    <i class="iconfont icon-qianqian-"></i>
                    <span>{{ isWithdraw? $store.state.accountBalance : 0 }}</span>
                </div>
            </div>
        </div>
        <ul class="withdraw_progress">
            <li v-for="item in lockList" :key="item.name">
                <h4>{{ item.name }}</h4>
                <div class="progress" :class="{ 'progress_yellow' : item.name == '全大厅流水要求'}">
                    <div :style="{ width: item.percent + '%' }" class="progress_bg"></div>
                    <p>{{ item.currentLockAmount }}/{{ item.lockAmount }}</p>
                </div>
            </li>
        </ul>
        <p class="tips" v-show="!isWithdraw">注：流水进度条需要“全部完成”方可提款，今日免费提款次数<span class="primary_text_color">还剩{{ data.freeTimes }}次</span>，免费提款次数为零时需要<span class="primary_text_color">{{ serviceCharge }}%</span>服务费</p>
        <form v-show="isWithdraw">
            <p>请输入提款金额</p>
            <FormItem
            icon='icon-qianqian-'
            :rule='rules.amount'
            ref='amount'
            type='tel'
            placeholder='金额 100元～200,000元'
            v-model.number="form.amount"/>
            <div class="btn_center account_btn">
                <button @click.prevent="onSubmit" class="btn btn_primary">{{ btnName }}</button>
            </div>
        </form>
    </div>
</template>

<style lang="postcss">
    .account_withdraw{
        .amount_box{
            display: flex;
            padding: 20px 0;
            h4{
                font-size: 34px;
                padding-top: .2rem;
                padding-bottom: .95rem;
                font-weight: normal;
            }
        }
        .amount{
            width: 50%;
            height: 2.8rem;
            background-image: url('./img/accountBalance_bg.png');
            background-size: 100% 100%;
            padding-top: 0px;
            padding-left: 10px;
            color: #a17823;
            font-size: .6rem;
            font-weight: bold;
            margin: 0 1%;
            color: #fff;
            overflow: hidden;
        }
        .withdraw_amount{
            background-image: url('./img/withdrawLimit_bg.png');
        }
        .withdraw_info{
            ul{
                width: 400px;
                text-align: center;
                li{
                    font-size: 18px;
                }
                button{
                    color: #fff;
                    padding: 10px 20px;
                    margin-top: 20px;
                    border-radius: 4px;
                }
            }
        }
        .withdraw_progress{
            li{
                background-color: #202020;
                margin-bottom: 24px;
                padding: 10px;
                border-radius: 4px;
                h4{
                    padding-bottom: 6px;
                }
            }
        }
        .tips{
            background-color: #202020;
            margin-bottom: 14px;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
            line-height: 40px;
        }
        .free_times{
            font-size: 26px;
        }
        form{
            padding-top: 20px;
        }
    }
</style>