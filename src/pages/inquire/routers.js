export default [
    { 
        path: '/',
        redirect: 'inquire_betting' 
    },
    {
        path: 'inquire_betting',
        component: () => ({ component: import(/* webpackChunkName: "inquire" */ './betting') }),
    },
    {
        path: 'inquire_reward',
        component: () => ({ component: import(/* webpackChunkName: "inquire" */ './reward') }),
    },
    {
        path: 'inquire_recharge',
        component: () => ({ component: import(/* webpackChunkName: "inquire" */ './recharge') }),
    },
    {
        path: 'inquire_withdraw',
        component: () => ({ component: import(/* webpackChunkName: "inquire" */ './withdraw') }),
    },
]