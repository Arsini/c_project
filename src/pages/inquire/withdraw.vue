<script>
export default {
    data:()=>({
        startTime: '',
        endTime: '',
        type: '',
        pageNum: 0,
        options: {
            '全部': '',
            '审核中': [ 'Pending', 'CsPending', 'AutoAudit', ],
            '支付中': [ 'Approved', 'Processing', 'Undetermined', 'Recover'],
            '已支付': [ 'Success' ],
            '自助取消': [ 'Cancel' ],
            '已取消': [ 'Rejected', 'Fail' ],
            '系统异常': [ 'PrePending' ],
        },
        list:[],
        requestCount: 10,
        totalCount: 0,
        
    }),
    created(){
        this.$store.commit('TITLE_NAME', '账目查询')
        this.startTime = all.tool.getFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()))
        this.endTime = all.tool.getFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1))
        this.search()
    },

    methods:{
        /* api */
        //获取兑奖申请列表
        _getBonusRequestList: data => all.net.send({
            service: 'payment',
            functionName: 'getBonusRequestList',
            data,
        }),
        _cancelBonusRequest: data => all.net.send({
            service: 'payment',
            functionName: 'cancelBonusRequest',
            data,
        }),

        chioceDate() {
            const dStart = new Date(this.startTime).getTime();
            const dNow = new Date().getTime();
            const dEnd = new Date(this.endTime).getTime();
            const timeDifference = (dNow - dStart) / 1000 / 60 / 60 / 24;
            if(dStart > dEnd) {
                this.msg('结束时间不能小于开始时间', 'error')
                return false
            } else if(timeDifference > 14) {
                this.msg('只能查询当前时间之前14天内的所有数据', 'error')
                return false
            } else {
                return true
            }
        },
        search(){
            if(!this.chioceDate()) {
                return
            }
            if(this.type) {
                (this.type).forEach(val => {
                    this.getBonusRequestList(val)
                });
            } else {
                this.getBonusRequestList('')
            }
        },
        getBonusRequestList(status) {
            const userId = all.tool.GetSession('playerId')
            const data = {
                status,
                startIndex: this.pageNum,
                requestCount: this.requestCount,
                sort: false,
                startTime: this.startTime,
                endTime: this.endTime,
                playerId: userId,
            }
            this._getBonusRequestList(data).then(res=>{
                const list = [];
                const arr = res.data.records;
                arr.forEach(val => {
                    const createTime = (val.createTime).getDate()
                    let statusText
                    if(val.status == 'Cancel') {
                        if(val.data.cancelBy.indexOf('玩家')>=0) {
                            statusText = all.tool.chineseStatus(val.status)
                        } else {
                            statusText = '取消'
                        }
                    } else {
                        statusText = all.tool.chineseStatus(val.status)
                    }
                    const obj = {
                        createTime,
                        proposalId: val.proposalId,
                        amount: val.data.amount,
                        status: val.status.toLowerCase(),
                        statusText
                    }
                    list.push(obj)
                });
                this.totalCount = res.data.stats.totalCount
                this.list = list
            })
        },
        cancelBonusRequest(proposalId) {
            this._cancelBonusRequest({proposalId}).then(res=>{
                this.msg('取消成功', 'success')
                this.search()
            })
        },
        next(){
            this.pageNum += this.requestCount
            this.search()
        },
        pre(){
            this.pageNum -= this.requestCount
            this.search()
        },
        pageJump(index){
            this.pageNum = this.requestCount * index
            this.search()
        },
    }
}
</script>

<template>
    <div>
        <div class="search">
            <div class="prefix">
                <label>提款状态</label>
                <select class="input" v-model="type">
                    <option v-for="(val, key) in options" :value="val" :key="key">{{ key }}</option>
                </select>
            </div>
            <div class="prefix">
                <label>开始时间</label>
                <input v-model="startTime" type="datetime-local"  class="input">
            </div>
            <div class="prefix">
                <label>结束时间</label>
                <input v-model="endTime" type="datetime-local"  class="input">
            </div>
            <p class="tip">温馨提醒：只能查看到近14天的纪录</p>
            <div class="btn_center">
                <button @click="search" class="btn btn_primary">查询</button>
            </div>
        </div>
        <table class="table">
            <tr>
                <th>订单号</th>
                <th>提款金额</th>
                <th>状态</th>
                <th>操作</th>
            </tr>
            <tr v-for="item in list" :key="item.createTime">
                <td class="field">
                    <p>{{ item.proposalId }}</p>
                    <p class="time">{{ item.createTime }}</p>
                </td>
                <td class="amount">{{ item.amount }}</td>
                <td :class="item.status">{{ item.statusText }}</td>
                <td>
                    <button v-show='item.statusText == `审核中`'  @click="cancelBonusRequest(item.proposalId)" class="cancelBtn">取消</button>
                </td>
            </tr>
        </table>
        <Pagination
        :requestCount='requestCount'
        :totalCount='totalCount'
        :currentPage='pageNum/requestCount'
        @next='next'
        @pre='pre'
        @jump='pageJump'/>
    </div>
</template>

