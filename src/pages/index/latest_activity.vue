<template>
    <div class="latest-activity" v-if="show && activity.imgUrl" @touchmove.prevent="">
        <div class="mask"></div>
        <div class="centent">
            <div class="centent_box">
                <img class="bg" width="100%" :src="activity.imgUrl" alt="">
                <div class="img_btn" :style="item.position" v-for="(item,index) in activity.btnList" :key="index">
                    <img :src="item.imgUrl" :style="item.style"  @click="goto(item)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            show:1,
            activity:{}
        }
    },
    methods:{
        goto(item){
            //1跳转到详情，2跳转到具体页面，3跳转到其他网址，4关闭弹窗
            let code=item ?item.code:0;
            if(code==1){
                this.$router.push(item.result);
            }
            else if(code==2){
                if(item.result.charAt(0) == '#')item.result.replace('#','');
                this.$router.push(item.result);
            }
            else if(code==3){
                window.open(item.result)
            }
            this.show=0;
        },
    },
    mounted(){
        //获取弹窗活动数据
        this.$api.getFrontEndData({page:3}).then(res=>{
            let temp=JSON.parse(res.data);
            if(res.data && (this.$store.state.isTest || (!this.$store.state.isTest && !temp.isTest))){
                temp.btnList.map((item,index)=>{
                    item.style={
                        width: item.width / 75 + 'rem',
                        height: item.height / 75 + 'rem',
                    }
                    item.position={
                        left: item.left / 75 + 'rem',
                        top: item.top / 75 + 'rem',
                    }
                    item.imgUrl = item.imgUrl
                })
                this.activity=temp;
            }
        })

        if(location.search.includes('always')){
            this.show=0;
        }
    },
    components:{},
    computed:{
    }
}
</script>

<style lang="postcss" scoped>
.latest-activity{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: auto;
    height: auto;
    z-index: 1000;
    .mask {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: auto;
        height: auto;
        z-index: 999;
        background: rgba(0, 0, 0, 0.6);
        transform: translate3d(0, 0, 0);
    }
    .centent{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        .centent_box{
            width: 9rem;
            min-height: 6rem;
            position: relative;
            div{
                position: absolute;
                background-size:100% auto;
                cursor: pointer;
            }
            .img_btn{
                position: absolute;
                cursor: pointer;
                padding: 0.2rem 0.1rem;
            }
        }
    }
}
</style>
