import Vue from "vue"
; (function () {
    Vue.directive('track', { // v-track="`导航 登录`"
        bind(el, val) {
            el.onclick = () => {
                const domain = window.location.host;
                const client = all.tool.isClients();
                let device;
                let type;
                if(client.indexOf('H5') != -1){
                    device = 'H5玩家'
                    type = 'registerClickH5'
                } else {
                    device = 'APP玩家'
                    type = 'registerClickApp'
                }
                const clickCount = data => all.net.send({
                    service: 'platform',
                    functionName: 'clickCount',
                    data,
                })
                const arr = val.value.split(' ')
                let _obj = {
                    device,
                    domain,
                    pageName: arr[0],
                    buttonName: arr[1],
                }
                if(arr[1] == '注册'){
                    _obj[type] = true
                }
                clickCount(_obj)
            }
        }
    })
})();