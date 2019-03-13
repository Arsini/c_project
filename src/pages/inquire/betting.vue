<script>
export default {
    data:()=>({
        startTime: '',
        endTime: '',
        type: '',
        pageNum:0,
        options: {
            '全部': '',
        },
        list: [],
        requestCount: 10,
        totalCount: 0,
        
    }),
    created(){
        this.$store.commit('TITLE_NAME', '账目查询')
        this.$api.getProviderList().then(res=>{
            const options = { '全部': '' };
            (res.data).forEach(val => {
                options[all.tool.chineseName(val.providerId, val.name)] = val.providerId
            })
            this.options = options
        })
        this.startTime = all.tool.getFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()))
        this.endTime = all.tool.getFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1))
        this.search()
    },

    methods:{
        /* api */
        //查询消费记录
        _search: data => all.net.send({
            service: 'consumption',
            functionName: 'search',
            data,
        }),

        chioceDate() {
            const dStart = new Date(this.startTime).getTime();
            const dNow = new Date().getTime();
            const dEnd = new Date(this.endTime).getTime()
            const timeDifference = (dNow - dStart) / 1000 / 60 / 60 / 24
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
            const playerId = all.tool.GetSession('playerId')
            const data = {
                sort: false,
                startTime: this.startTime,
                endTime: this.endTime,
                startIndex: this.pageNum,
                requestCount: this.requestCount,
                providerId: this.type,
                playerId
            }
            this._search(data).then(res=>{
                const arr = res.data.records;
                const list = [];
                arr.forEach(val => {
                    const validAmount = all.tool.fixedNum(val.validAmount, 2);
			    	const bonusAmount = all.tool.fixedNum(val.bonusAmount, 2);
                    const createTime = (val.createTime).getDate();
                    const obj = {
                        name: val.name,
                        createTime,
                        validAmount,
                        bonusAmount,
                    }
                    list.push(obj)
                });
                this.totalCount = res.data.stats.totalCount
                this.list = list
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
                <label>大厅类型</label>
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
                <th>游戏大厅</th>
                <th>流水</th>
                <th>派彩金额</th>
            </tr>
            <tr v-for="item in list" :key="item.createTime">
                <td class="field">
                    <p>{{ item.name }}</p>
                    <p class="time">{{ item.createTime }}</p>
                </td>
                <td class="amount">{{ item.validAmount }}</td>
                <td>{{ item.bonusAmount }}</td>
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