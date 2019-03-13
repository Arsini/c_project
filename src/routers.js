import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import rechargeChild from 'pages/recharge/routers'
import inquireChild from 'pages/inquire/routers'
Vue.use(VueRouter)

/*pages*/
const routes = [
    {
        path: '/',
        name: 'index',
        component: () => ({ component: import(/* webpackChunkName: "index" */ 'pages/index') }),
    },
    {
        path: '/lobby',
        name: '大厅',
        component: () => ({ component: import(/* webpackChunkName: "lobby" */ 'pages/lobby') }),
    },
    {
		path: '/lobby/:gamename',
		component: () => ({ component: import(/* webpackChunkName: "lobby" */ 'pages/lobby/games') }),
    },
    {
        path: '/game_loading',
        name: '游戏加载中...',
		component: () => ({ component: import(/* webpackChunkName: "lobby" */ 'pages/lobby/game_loading') }),
	},
    {
        path: '/sign_in',
        name: '登录',
        component: () => ({ component: import(/* webpackChunkName: "sign_in" */ 'pages/sign_in') }),
    },
    {
        path: '/sign_up',
        name: '注册',
        component: () => ({ component: import(/* webpackChunkName: "sign_up" */ 'pages/sign_up') }),
    },
    {
        path: '/reward',
        name: '优惠活动',
        component: () => ({ component: import(/* webpackChunkName: "reward" */ 'pages/reward') }),
    },
    {
        path: '/reward_detail',
        component: () => ({ component: import(/* webpackChunkName: "reward" */ 'pages/reward/reward_detail') }),
    },
    {
        path: '/recharge',
        component: () => ({ component: import(/* webpackChunkName: "recharge" */ 'pages/recharge') }),
        children: rechargeChild,
    },
    {
        path: '/withdraw',
        name: '提款',
        component: () => ({ component: import(/* webpackChunkName: "withdraw" */ 'pages/withdraw') }),
    },
    {
        path: '/account',
        name: '账户',
        component: () => ({ component: import(/* webpackChunkName: "account" */ 'pages/account') }),
    },
    {
        path: '/transfer',
        name: '游戏转账',
        component: () => ({ component: import(/* webpackChunkName: "transfer" */ 'pages/transfer') }),
    },
    {
        path: '/coupon',
        name: '优惠劵',
        component: () => ({ component: import(/* webpackChunkName: "coupon" */ 'pages/coupon') }),
    },
    {
        path: '/inquire',
        component: () => ({ component: import(/* webpackChunkName: "inquire" */ 'pages/inquire') }),
        children: inquireChild,
    },
    {
        path: '/modify_phone',
        name: '电话修改',
        component: () => ({ component: import(/* webpackChunkName: "modify_phone" */ 'pages/modify_phone') }),
    },
    {
        path: '/modify_bank',
        name: '银行卡修改',
        component: () => ({ component: import(/* webpackChunkName: "modify_bank" */ 'pages/modify_bank') }),
    },
    {
        path: '/user_info',
        name: '基本资料',
        component: () => ({ component: import(/* webpackChunkName: "user_info" */ 'pages/user_info') }),
    },
    {
        path: '/level_up',
        name: 'VIP升级',
        component: () => ({ component: import(/* webpackChunkName: "level_up" */ 'pages/level_up') }),
    },
    {
        path: '/modify_password',
        name: '修改密码',
        component: () => ({ component: import(/* webpackChunkName: "modify_password" */ 'pages/modify_password') }),
    },
    {
        path: '/vip',
        name: 'vip俱乐部，独享顶级特权',
        component: () => ({ component: import(/* webpackChunkName: "vip" */ 'pages/vip') }),
    },
    {
        path: '/daycheckin',
        name: '签到礼金',
        component: () => ({ component: import(/* webpackChunkName: "daycheckin" */ 'pages/daycheckin') }),
    },
    {
        path: '/mail',
        name: '站内信',
        component: () => ({ component: import(/* webpackChunkName: "mail" */ 'pages/mail') }),
    },
    {
        path: '/recharge_guide',
        name: '注册优惠',
        component: () => ({ component: import(/* webpackChunkName: "recharge_guide" */ 'pages/recharge_guide') }),
    },
    {
        path: '/free_play',
        name: '免费试玩',
        component: () => ({ component: import(/* webpackChunkName: "free_play" */ 'pages/free_play') }),
    },
    {
        path: '/down_app',
        name: 'app下载',
        component: () => ({ component: import(/* webpackChunkName: "down_app" */ 'pages/down_app') }),
    },
]

//添加页面loading
routes.forEach(e => {
    e.beforeEnter = (to, from, next) => {
        store.commit('WINDOW_LOADING', true)
        next()
    }
});

export default new VueRouter({
    routes,
    scrollBehavior(){
		return { x: 0, y: 0 }
	},
 })