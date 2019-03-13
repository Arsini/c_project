<script>
export default {
    props:['rewardList'],
    data(){
        return{
            reward: '',
            code: '',
        }
    },
    created(){
        const code = all.tool.GetSession('promoCode');
        if(code){
            this.code = code
        }
    },
    methods:{
        rewardCode(){
            this.reward = ''
            this.$emit('rewardCode', this.code)
        },
        rewardGift(type){
            this.code = ''
            this.$emit('rewardGift', this.reward)
        },
        reset(){
            this.reward = ''
            this.rewardGift()
        },
    }
}
</script>

<template>
    <div class="reward_item">
        <h3 class="pay_type_title">请选择优惠</h3>
        <ul class="account_recharge_reward">
            <li>
                <input v-model="code" @keyup="rewardCode" type="tel" placeholder="输入优惠代码">
                <div class="flag" :class="{ 'open' : code }"></div>
            </li>
            <li>
                <select v-model="reward" @change="rewardGift" class="account_select" :class="{ 'open' : reward }">
                    <option value="">请选择存送优惠</option>
                    <option v-for="item in rewardList" :key="item.code" :value="item.code">{{ item.name }}</option>
                </select>
                <!-- <div class="flag"  :class="{ 'open' : reward }"></div> -->
            </li>
        </ul>
    </div>
</template>

<style lang="postcss">
    .reward_item{
        .account_recharge_reward{
            li{
                height: 42px;
                border-bottom: 1px solid #404040;
                margin-bottom: 24px;
                display: flex;
                input,select{
                    flex: 1;
                    font-size: 14px;
                    color: #fff;
                }
                
            }
            .flag{
                width: 70px;
                height: 35px;
                margin-top: 2px;
                background-image: url(../img/off.png)
            }
            
            .account_select{
                background-image: url(../img/off.png);
                background-repeat: no-repeat;
                background-position: center right;
            }
            .open{
                background-image: url(../img/open.png)
            }
        }
    }
</style>

