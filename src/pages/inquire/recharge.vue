<script>
export default {
    data:()=>({
        startTime: '',
        endTime: '',
        type: '',
        totalAmount: 0,
        pageNum: 0,
        options: {
            '全部': '',
            '手工充值': 1,
            '在线充值': 2,
            '支付宝支付': 3,
            '微信支付': 4,
        },
        list:[],
        requestCount: 10,
        totalCount: 0,
        
    }),
    computed:{
        depositMethod(){

        }
    },
    created(){
        this.$store.commit('TITLE_NAME', '账目查询')
        this.startTime = all.tool.getFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()))
        this.endTime = all.tool.getFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1))
        this.search()
    },
    methods:{
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
            const userId = all.tool.GetSession('playerId')
            const data = {
                topUpType: this.type,
                startIndex: this.pageNum,
                requestCount: this.requestCount,
                sort: false,
                startTime: this.startTime,
                endTime: this.endTime,
                playerId: userId,
            }
            this.$api.getTopupList(data).then(res=>{
                const arr = res.data.records;
                const list = [];
                arr.forEach(val => {
                    const topUpType = this.rechargeName(val.topUpType)
                    const createTime = (val.createTime).getDate()
                    const obj = {
                        topUpType,
                        createTime,
                        amount: val.amount,
                    }
                    list.push(obj)
                });
                this.totalCount = res.data.stats.totalCount
                this.list = list
            })
        },
        rechargeName(type) {
            let name
            switch(type) {
                case '1' : name = '手工充值'; break;
                case '2' : name = '在线充值'; break;
                case '3' : name = '支付宝支付'; break;
                case '4' : name = '微信支付'; break;
            }
            return name
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
				<label>充值类型</label>
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
                <th>充值方式</th>
                <th>充值金额</th>
            </tr>
            <tr v-for="item in list" :key="item.createTime">
                <td class="field">
                    <p>{{ item.topUpType }}</p>
                    <p class="time">{{ item.createTime }}</p>
                </td>
                <td class="amount">{{ item.amount }}</td>
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

