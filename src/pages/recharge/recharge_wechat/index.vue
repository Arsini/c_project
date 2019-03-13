<script>
import Wechat from "../alipay_and_wechat_tpl";
export default {
    props:[
        'bankList',
        'wechatPayStatus',
        'onlineList',
        'rewardList',
    ],
    components:{
        Wechat
    },
    data(){
        return{}
    },
}
</script>


<template>
    <Wechat
        :bankList='bankList'
        getRequestListApi='getWechatTopupRequestList'
        depositMethod='5'
        :personStatus='wechatPayStatus'
        :onlineList='onlineList'
        :rewardList='rewardList'
    />
</template>
