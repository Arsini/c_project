<script>
export default {
    data(){
        return{

        }
    },
    created(){
        const client = all.tool.isClients();
        if(client.indexOf('苹果') != -1){
            window.location.href = 'https://td99-ios.neweb.me/IOS/byl_ios/byl_official/download.html'
        } else if(client.indexOf('安卓') != -1){
            window.location.href = 'http://app.bao1618.com/'
        }
    }
}
</script>


<template>
    <div></div>
</template>