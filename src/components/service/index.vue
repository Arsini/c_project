<script>
export default {
    data(){
        return{
            qqList: [],
            live800: [],
            wechatQRUrl: [],
            client: '',
        }
    },
    created(){
        this.client = all.tool.isClients();
        this.formatQQ()
        this.formatLive800()
        this.formatWechat()
    },
    methods:{
        service(link){
            this.$emit('popFlag', 'serviceComponent', false)
            const open = window.open('', '', 'width=800,height=600');
            open.location.href = link + '&s=1' + '&enterurl=' + window.location.hostname
        },
        qq(num) {
            this.$emit('popFlag', 'serviceComponent', false)
            // let open = window.open("", "_blank"); //首先打开一个新页面
            let url = `mqq://im/chat?chat_type=wap&uin=${num}&version=1&src_type=web`
            window.location.href = url
        },
        formatLive800(){
            const data = all.tool.GetLocal('getConfig');
            if(data){
                const live800 = [];
                data.live800.forEach(e => {
                    live800.push(e.content)
                });
                this.live800 = live800
            }
        },
        formatQQ(){
            const data = all.tool.GetLocal('getConfig');
            if(data){
                const qqList = [];
                data.qqList.forEach(e => {
                    qqList.push(e.content)
                });
                this.qqList = qqList
            }
        },
        formatWechat(){
            const data = all.tool.GetLocal('getConfig');
            if(data){
                const wechatQRUrl = [];
                data.wechatQRUrl.forEach(e => {
                    wechatQRUrl.push(e.content)
                });
                this.wechatQRUrl = wechatQRUrl
            }
        },
        //显示弹窗
        openPop(name){
            this.$emit('popFlag', 'serviceComponent', false)
            this.$emit('popFlag', name, true)
        },
        openWechat(url){
            this.$emit('popFlag', 'serviceComponent', false)
            this.$emit('openWechat', url)
        },
        close(){
            this.$emit('popFlag', 'serviceComponent', false)
        },
    },
}
</script>


<template>
    <div class="service_component" @click="close">
        <ul class="service_component_list">
            <li v-for="(val, key) in live800" :key="`live${key}`" @click="service(val)">
                <i class="iconfont icon-24xiaoshidianhua primary_text_color"></i>
                <p>在线客服{{ key? key : ''}}</p>
            </li>
            <!-- <li v-for="(val, key) in qqList" @click="qq(val)" :key="`qq${key}`">
                <i class="iconfont icon-qq primary_text_color"></i>
                <div class="text_qq">
                    <p>QQ公众号{{ key? key : ''}}</p>
                    <p>{{ val }}</p>
                </div>
            </li> -->
            <li v-for="(val, key) in wechatQRUrl" :key="`wechat${key}`" @click="openWechat(val)">
                <i class="iconfont icon-weixin primary_text_color"></i>
                <p>微信客服{{ key? key : ''}}</p>
            </li>
            <li @click="openPop('showPhone')">
                <i class="iconfont icon-dianhua primary_text_color"></i>
                <p>申请回电</p>
            </li>
            <router-link to="free_play" tag="li">
                <i class="iconfont icon-iconfontyouxihudong primary_text_color"></i>
                <p>免费试玩</p>
            </router-link>
        </ul>
    </div>
</template>

<style lang="postcss">
    .service_component{
        padding-top: 88px;
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        z-index: 9;
        display: flex;
        justify-content: flex-end;
        transition: transform 1s;
    }
    .service_component_list{
        background-color: rgba(0, 0, 0, .8);
        width: 260px;
        text-align: center;
        border-radius: 8px;
        padding-bottom: 8px;
        li{
            padding: 20px 0;
            width: 80%;
            background-color: #222;
            text-align: center;
            margin: 20px auto 0 auto;
            border-radius: 4px;
            display: inline-block;
            &:last-child{
                margin-bottom: 10px;
            }
            .iconfont{
                font-size: 60px;
                display: block;
                margin-bottom: 2px;
            }
            p{
                line-height: 36px;
            }
        }
    }
</style>
