export default {
    titleName: '', //header 名称
    config: false, //更新平台基础配置
    gameTreeInfo: false,//更新游戏树
    isSignIn: false, //是否已登陆
    accountBalance: '', //账户余额
    gameCreditList: '',//游戏提供商
    lockedCreditList: '',//大厅锁定

    loadingTimer: '', //loading计数器
    windowLoading: false, //整个窗口的loading
    acLoading: false, //个人账户loading

    routerDirection: '',
    routerArr: [],

    isSidebar: false,//显示隐藏侧边栏

    isTest:location.host.includes("devtest")|| location.host.includes("-dev") || location.host.includes("-fpms") || location.port.length>3,
}