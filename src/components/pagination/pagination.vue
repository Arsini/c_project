<script>
export default {
    props:[
        'currentPage',
        'totalCount',
        'requestCount',
    ],
    data(){
        return{
            disabledNext: false,
            totle: 0,
        }
    },
    created(){
    },
    methods:{
        next(){
            if(this.totle > this.currentPage && this.totalCount > this.requestCount){
                this.$emit('next')
            }
        },
        pre(){
            if(this.currentPage > 0){
                this.$emit('pre')
            }
        },
        pageJump(e){
            this.$emit('jump', e.target.value - 1)
        },
    },
    watch:{
        totalCount(){
            this.totle = parseInt(this.totalCount/this.requestCount);
        }
    }
}
</script>

<template>
    <div class="pagination">
        <!-- <span>共{{totalCount}}条记录，每页{{ requestCount }}条，当前{{ currentPage + 1 }}/{{ totle + 1 }}页 | </span> -->
        <span @click='pre' class="pre" :class="{'disabled' : currentPage <= 0}">
            <i class="iconfont icon-arrow"></i>
        </span>
        <select @change="pageJump" :value="currentPage + 1">
            <option v-for="n in totle + 1" :value="n" :key="n">{{ n }}</option>
        </select>
        <span @click='next' class="next" :class="{'disabled' : totle <= currentPage || totalCount <= requestCount }">
            <i class="iconfont icon-arrow"></i>
        </span>
    </div>
</template>

<style lang="postcss">
    .pagination{
        text-align: center;
        padding-top: 20px;
        padding-bottom: 40px;
        display: flex;
        justify-content: center;
        span{
            color: #fff;
        }
        select{
            background: #fff;
            color: #000;
            border-radius: 8px;
            min-width: 15%;
        }
        .pre,.next{
            display: flex;
            align-items: center;
            background-color: #ffaa0d;
            font-size: 18px;
            border-radius: 4px;
            margin: 0 10%;
            line-height: 0;
            height: 50px;
            padding:0 30px;
        }
        .next{
            transform: scaleX(-1);
        }
    }
</style>

