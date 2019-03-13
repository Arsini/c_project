export default {
    //TITLE_NAME
    TITLE_NAME(state, name) {
        state.titleName = name
    },
    
    //更新平台基础配置
    CONFIG(state, flag){
        state.config = flag
    },
    //获取游戏树
    GAME_TREE_INFO(state, flag){
        state.gameTreeInfo = flag
    },
    
    //账户余额
    ACCOUNT_BALANCE(state, obj){
        const data = obj.data;
        const gameCreditList = data.gameCreditList;
        const lockedCreditList =  data.lockedCreditList;
        lockedCreditList.unshift({
            nickName: '自由额度',
            lockCredit: data.credit,
        })
        state.gameCreditList = gameCreditList
        state.lockedCreditList = lockedCreditList
        state.accountBalance = all.tool.fixedNum(data.finalAmount, 2)
    },
    
    //是否登陆
    IS_SIGN_IN(state,flag){
        state.isSignIn = flag
        if(!flag){
            state.accountBalance = '' //账户余额
            state.gameCreditList = ''//游戏提供商
            state.lockedCreditList = ''//大厅锁定
        }
    },
    
    //整个窗口的loading windowLoading
    WINDOW_LOADING(state,flag){
        state.windowLoading = flag
        clearTimeout(state.loadingTimer)
        state.loadingTimer = setTimeout(() => {
            if (state.windowLoading) {
                window.alert('网络繁忙，请刷新后重试。')
                window.location.reload()
            }
        }, 30000)
    },

    //routerDirection
    ROUTER_DIRECTION(state, name){
        state.routerDirection = name
    },
    //
    ROUTER_ARR(state, obj){
        //go(-1)失效，未知原因，只能先这样做，希望后人能发现go(-1)是为什么
        const length = state.routerArr.length;
        if(length >= 20){
            state.routerArr.shift()
        }
        if(obj.type != -1){
            state.routerArr.push(obj.name)
        } else {
            state.routerArr.splice(length-2,2)
        }
    },

    //显示隐藏侧边栏
    IS_SIDEBAR(state, flag){
        state.isSidebar = flag
    }
}