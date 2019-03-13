<script>
import Alipay from "../alipay_and_wechat_tpl";
export default {
    props:[
        'bankList',
        'aliPayStatus',
        'onlineList',
        'rewardList',
    ],
    components:{
        Alipay
    },
    data(){
        return{}
    },
}
</script>


<template>
    <Alipay
        :bankList='bankList'
        getRequestListApi='getAlipayTopupRequestList'
        depositMethod='4'
        :personStatus='aliPayStatus'
        :onlineList='onlineList'
        :rewardList='rewardList'
    />
</template>
