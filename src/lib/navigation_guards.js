export default function (router, store, msg) {
    router.beforeEach((to, from, next) => {
        const isLogin = all.tool.GetSession('user');
        const _form = from.fullPath || '/';
        if(from.path != '/sign_in' && from.path != '/sign_up') {
            store.commit('ROUTER_ARR', { type: 1, name: _form})
        }
        if(to.path != '/sign_in' && to.path != '/sign_up') {
            all.tool.SetSession('beforeSign', to.fullPath)
        }
        const isRealPlayer = isLogin? isLogin.isRealPlayer : false;
        if(!isLogin){
            switch (to.path) {
                case "/withdraw": next('/sign_in'); break;
                case "/recharge/recharge_alipay": next('/sign_in'); break;
                case "/account": next('/sign_in'); break;
                case "/coupon": next('/sign_in'); break;
                case "/daycheckin": next('/sign_in'); break;
                // case "/mail": next('/sign_in'); break;
                default: next(); break;
            }
        } else {
            if(!isRealPlayer){
                switch (to.path) {
                    case "/withdraw": next(from.path); msg('试玩账号无此权限，请登陆真钱账号或者注册。'); break;
                    case "/recharge/recharge_alipay": next('/sign_in'); msg('试玩账号无此权限，请登陆真钱账号或者注册。'); break;
                    case "/account": next(from.path); msg('试玩账号无此权限，请登陆真钱账号或者注册。'); break;
                    case "/coupon": next(from.path); msg('试玩账号无此权限，请登陆真钱账号或者注册。'); break;
                    case "/daycheckin": next(from.path); msg('试玩账号无此权限，请登陆真钱账号或者注册。'); break;
                    default: next(); break;
                }
            } else {
                next()
            }
        }
        next()
    })
    router.afterEach((to, from) => {
        // if(from.name){
        //     if(store.state.router == to.fullPath){
        //         store.commit('ROUTER_DIRECTION', 'transitionright')
        //     } else {
        //         store.commit('ROUTER_DIRECTION', 'transitionleft')
        //     }
        // }
        store.commit('WINDOW_LOADING', false) //关闭全局loading
        store.commit('TITLE_NAME', to.name)
        store.commit('IS_SIDEBAR', false)
    })
}
