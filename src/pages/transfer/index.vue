<script>
export default {
    data(){
        return{
            table: [],
            disabled: true,
        }
    },
    created(){
        this.$store.commit('WINDOW_LOADING', true)
    },
    computed:{
        lockedCreditList(){
            this.table = [];
            const list = this.$store.state.lockedCreditList;
            const lockedCreditList = [];
            let freeAmount = 0;//"自由额度"
            if(list && list.length > 0){
                list.forEach(e => {
                    let transferToProvider;
                    if(e.nickName == "自由额度"){ freeAmount = e.lockCredit }
                    lockedCreditList.push({
                        nickName: e.nickName,
                        lockCredit: all.tool.fixedNum(e.lockCredit, 2)
                    })
                    if(freeAmount >= 1 || e.lockCredit >= 1){
                        transferToProvider = true
                    }
                    this.formatTable(e.list, e.nickName, transferToProvider)//格式化表格数据
                });
            }
            if(lockedCreditList.length > 0 && this.disabled){
                this.$store.commit('WINDOW_LOADING', false)
            }
            return lockedCreditList
        },
    },
    methods:{
        /* API */
        //转入
        _transferToProvider: data => all.net.send({
            service: 'game',
            functionName: 'transferToProvider',
            data,
        }),
        //转出
        _transferFromProvider: data => all.net.send({
            service: 'game',
            functionName: 'transferFromProvider',
            data,
        }),
        
        //格式化表格数据
        formatTable(arr,  name, transferToProvider){
            if(arr && arr.length > 0){
                this.table.push({
                    name,
                    title: true,
                })
                arr.forEach(e => {
                    const num = parseFloat(e.validCredit);
                    const validCredit = isNaN(num)? 0 : all.tool.fixedNum(num);
                    this.table.push({
                        providerId: e.providerId,
                        validCredit,
                        name: all.tool.chineseName(e.providerId, e.nickName),
                        status: e.status,
                        transferToProvider,
                    })
                });
            }
        },

        //转入
        transferToProvider(providerId, flag){
            if(flag){
                const playerId = all.tool.GetSession('playerId');
                const data = {
                    providerId,
                    playerId,
                }
                this.$store.commit('WINDOW_LOADING', true)
                this.disabled = false
                this._transferToProvider(data).then(res=>{
                    this.$store.dispatch('GET_CREDIT_DETAIL').then(()=>{//获取账户余额
                        this.disabled = true
                    })
                    this.msg(`转入成功`, 'success')
                    this.$store.commit('WINDOW_LOADING', false)
                },err=>{
                    this.disabled = false
                    this.$store.dispatch('GET_CREDIT_DETAIL').then(()=>{//获取账户余额
                        this.disabled = true
                    })
                    this.msg(`转入失败，如有疑问请联系客服`, 'error')
                    this.$store.commit('WINDOW_LOADING', false)
                })
            }
        },

        //转出
        transferFromProvider(providerId, flag){
            if(flag){
                const playerId = all.tool.GetSession('playerId');
                const data = {
                    providerId,
                    playerId,
                }
                this.$store.commit('WINDOW_LOADING', true)
                this.disabled = false
                this._transferFromProvider(data).then(res=>{
                    this.$store.dispatch('GET_CREDIT_DETAIL').then(res=>{ //获取账户余额
                        this.disabled = true
                    })
                    this.msg(`转出成功`, 'success')
                    this.$store.commit('WINDOW_LOADING', false)
                },err=>{
                    this.disabled = false
                    this.$store.dispatch('GET_CREDIT_DETAIL').then(res=>{ //获取账户余额
                        this.disabled = true
                    })
                    this.msg(`转出失败，如有疑问请联系客服`, 'error')
                    this.$store.commit('WINDOW_LOADING', false)
                })
            }
        },
    },
}
</script>

<template>
    <div class="transfer">
        <ul class="transfer_lobby">
            <li v-for="(val, key) in lockedCreditList" :key="key">
                <h4>{{ val.nickName }}</h4>
                <p>
                    <i class="iconfont icon-qianqian-"></i>
                    <span>{{ val.lockCredit }}</span>
                </p>
            </li>
        </ul>
        <table class="table">
            <tr>
                <th>大厅</th>
                <th>额度</th>
                <th>状态</th>
                <th>操作</th>
            </tr>
            <tr v-for="item in table" :key="item.providerId" v-if="!item.title">
                <td>{{ item.name }}</td>
                <td>{{ disabled? item.validCredit : '更新中...' }}</td>
                <td :class="{'focus' : item.status != 1}">{{ item.status == 1? '开启' : '维护' }}</td>
                <td>
                    <button 
                    @click="transferToProvider(item.providerId, item.transferToProvider && item.status == 1 && disabled)"
                    :class="{ 'activation' : item.transferToProvider && item.status == 1 && disabled }">转入</button>
                    <button 
                    @click="transferFromProvider(item.providerId, item.validCredit >= 1 && item.status == 1 && disabled)"
                    :class="{ 'activation' : item.validCredit >= 1 && item.status == 1 && disabled, 'red' : item.validCredit >= 1 && item.status == 1 && disabled}">转出</button>
                </td>
            </tr>
            <tr v-else>
                <td class="lobby_title primary_text_color" colspan="4">
                    <span><i>∎</i>{{ item.name }}</span>
                </td>
            </tr>
        </table>
    </div>
</template>

<style lang="postcss">
    .transfer{
        .transfer_lobby{
            display: flex;
            flex-wrap: wrap;
            padding-top: 14px;
            padding-left: 1%;
            li{
                width: 30%;
                background-color: #333;
                margin: 0 1.5% .35rem 1.5%;
                background-image: url(./img/1.png);
                background-size: 100% 100%;
                &:nth-child(2){
                    background-image: url(./img/2.png);
                }
                &:nth-child(3){
                    background-image: url(./img/3.png);
                }
                &:nth-child(4){
                    background-image: url(./img/4.png);
                }
                &:nth-child(5){
                    background-image: url(./img/5.png);
                }
                h4{
                    font-weight: normal;
                    padding-left: 6%;
                    padding-top: 12px;
                    padding-bottom: .5rem;
                    font-size: 28px;
                }
                p{
                    padding-left: 5%;
                    font-size: 18px;
                    padding-bottom: 8px;
                    display: flex;
                }
                i{
                    font-size: 24px;
                    margin-top: 6px;
                }
                span{
                    line-height: 39px;
                    font-size: 30px;
                }
            }
        }
        button{
            color: #666;
            border: 1px solid #666;
            line-height: 45px;
            padding: 0 8px;
            margin-left: 6%;
        }
        .activation{
            border-color: #3b9537;
            color: #3b9537;
            &:hover{
                background-color: rgba(59,149,55,.2);
            }
        }
        .red{
            border-color: red;
            color: red;
        }
        .table{
            padding-bottom: 40px;
            .lobby_title{
                text-align: left;
                span{
                    display: inline-block;
                    background-image: url(./img/lobby_title_bg.png);
                    background-repeat: no-repeat;
                    line-height: 60px;
                    padding: 0  60px 0 20px;
                    font-size: 24px;
                    margin-top: 40px;
                    margin-bottom: 30px;
                    i{
                        position: relative;
                        top: -4px;
                        padding-right: 8px;
                    }
                }
            }
        }
    }
</style>
