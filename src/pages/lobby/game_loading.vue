<script>
export default {
    data(){
        return{
            text: '正在加载游戏,请稍等...',
        }
    },
    created(){
        const {
            api,
            clientDomainName,
            clientType,
            gameId,
        } = this.$route.query;
        const data = {
            clientDomainName,
            clientType,
            gameId,
        }
        this[api](data).then(res=>{
            window.location.href = res.data.gameURL
        },err=>{
            this.text = err.errorMessage + '。如果有疑问，请联系客服。'
        })
    },
    methods:{
        //api
        getLoginURL: data => all.net.send({
            service: 'game',
            functionName: 'getLoginURL',
            data,
        }),
        getTestLoginURL: data => all.net.send({
            service: 'game',
            functionName: 'getTestLoginURL',
            data,
        }),
    },
}
</script>

<template>
    <div class="window_open">
        <h2>{{ text }}</h2>
    </div>
</template>

<style lang="postcss">
    .window_open{
        text-align: center;
        h2,p{
            color:#fff;
        }
        h2{
            padding: 2rem 0 30px 0;
            font-size: 20px;
        }
        button{
            width: 60%;
        }
    }
</style>

