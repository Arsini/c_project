<script>
export default {
    data:()=>({
        startTime: '',
        endTime: '',
        type: '',
        pageNum: 0,
        options: {
            '全部': '',
        },
        list: [],
        requestCount: 10,
        totalCount: 0,
    }),
    created(){
        this.$store.commit('TITLE_NAME', '账目查询')
        this.$api.getRewardList().then(res=>{
            (res.data).forEach(val => {
                this.$set(this.options, val.name, val.code)
            })
        })
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
            const playerId = all.tool.GetSession('playerId')
            const data = {
                sort: false,
                status: "Approved",
                startIndex: this.pageNum,
                requestCount: this.requestCount,
                eventCode: this.type,
                startTime: this.startTime,
                endTime: this.endTime,
                playerId,
            }
            this.$api.getPlayerRewardList(data).then(res=>{
                const list = [];
                const arr = res.data.records;
                arr.forEach(val => {
                    const createTime = (val.createTime).getDate();
                    const rewardAmount = all.tool.fixedNum(val.rewardAmount, 2) 
                    const obj = {
                        eventName: val.eventName,
                        createTime,
                        rewardAmount,
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
				<label>优惠类型</label>
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
                <th>优惠名称</th>
                <th>优惠金额</th>
            </tr>
            <tr v-for="item in list" :key="item.createTime">
                <td class="field">
                    <p>{{ item.eventName }}</p>
                    <p class="time">{{ item.createTime }}</p>
                </td>
                <td class="amount">{{ item.rewardAmount }}</td>
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
