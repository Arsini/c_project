<script>
import HeadMarquee from './marquee'

export default {
    components:{
        HeadMarquee,
    },
    data(){
        return{
        }
    },
}
</script>

<template>
    <router-link to="/mail" v-track="`顶部固定栏 公告`" class="notice pointer" tag="div">
        <i class="iconfont icon-notice primary_text_color"></i>
        <HeadMarquee/>
    </router-link>
</template>

<style lang="postcss">
    .notice{
        background: #0f0f10;
        height: 50px;
        display: flex;
        padding: 0 2%;
        .icon-notice{
            font-size: 40px;
            padding-right: 10px;
            line-height: 52px;
        }
    }
</style>


