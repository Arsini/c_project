export default {
    service: 'player',
    functionName: [
        'authenticate',// 用于验证玩家webSocket链接是否有效。
        'logout',//退出登陆
        'get',//获取玩家基本信息get
        'getCreditDetail',//获取额度锁大厅等
        'getSMSCode',
        'sendSMSCodeToPlayer',
        'resetPassword',
        'getPlayerMonthStatus',
        'getPlayerDayStatus',
    ],
}