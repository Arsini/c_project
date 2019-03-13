<script>
    export default {
        data(){
            return{}
        },
        mounted(){
            const cdnOrFtpLink = all.tool.GetLocal('getConfig').cdnOrFtpLink;
            const iframe = document.createElement('iframe');
            iframe.src = `${cdnOrFtpLink}hm/NNew/NewMobile/Index/VIP/h5/index.html`
            iframe.height = document.body.clientHeight - (46 + 56) // 设置ifr高度
            this.$refs.vip.appendChild(iframe)
        }
    }
</script>
<template>
    <div ref="vip"></div>
</template>


