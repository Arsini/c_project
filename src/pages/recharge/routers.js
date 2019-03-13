const RechargeAlipay = () => ({ component: import(/* webpackChunkName: "account_recharge" */ './recharge_alipay') });
const RechargeWechat = () => ({ component: import(/* webpackChunkName: "account_recharge" */ './recharge_wechat') });
const RechargeBank = () => ({ component: import(/* webpackChunkName: "account_recharge" */ './recharge_bank') });
const RechargeOnline = () => ({ component: import(/* webpackChunkName: "account_recharge" */ './recharge_online') });
const routers = [
    { 
        path: '/',
        redirect: 'recharge_alipay' 
    },
    {
        path: 'recharge_alipay',
        component: RechargeAlipay,
    },
    {
        path: 'recharge_wechat',
        component: RechargeWechat,
    },
    {
        path: 'recharge_bank',
        component: RechargeBank,
    },
    {
        path: 'recharge_online',
        component: RechargeOnline,
    },
]

export default routers