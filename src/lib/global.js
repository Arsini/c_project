/*工具*/
import WS from 'lib/websocket'
import tool from 'lib/tool'
import store from '../store'
import msg from 'components/msg'
import router from '../routers'

; (function () {
    /* 全局 */
    window.log = console.log.bind(console)
    window.platformId = 5 //设置平台ID
    let url
    const protocolStr = document.location.protocol
    const host = window.location.host
    const w = protocolStr.length <= 5 ? 'ws' : 'wss'
    const port = window.location.port;
    
    if (process.env.NODE_ENV == 'production') {
        url = w + '://' + host + '/websocket'
        if(port) { url = 'ws://192.168.10.199:9280' }//本机打包后台的服务器模式
    } else {
        // url = 'ws://192.168.10.199:9280'
        url = 'wss://haomen-fpms-web.neweb.me/websocket'
        // url = 'wss://www.b6578.com/websocket' //正式
    }
    const net = new WS(window.platformId, url, store, router, msg);
    window.all = {
        net,
        tool,
    }

    //JAVA 时间格式转换
    String.prototype.getDate = function () {
        let date = new Date(this);
        return date.format("yyyy-MM-dd hh:mm:ss");
    }
    //扩展Date对象的属性  
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month  
            "d+": this.getDate(), //day  
            "h+": this.getHours(), //hour  
            "m+": this.getMinutes(), //minute  
            "s+": this.getSeconds(), //second  
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter  
            "S": this.getMilliseconds() //millisecond  
        }
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
})();