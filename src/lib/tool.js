/**
 * 一些公共的方法工具 （仅支持IE10及以上浏览器）
 */
export default {
    /* promise 对象返回数据 */
    promise(data) {
        return new Promise((resolve, reject) => {
            if (data) {
                resolve(data);
            } else {
                reject("数据异常");
            }
        });
    },
/********************** 数据存储 **********************/
    // localStorage
    SetLocal(key, value) {
        if (key && value) {
            const val = JSON.stringify(value)
            localStorage.setItem(key, val)
        } else {
            throw new Error(`Missing 'key' or 'value'`)
        }
    },
    GetLocal(key) {
        return JSON.parse(localStorage.getItem(key))
    },
    RemoveLocal(key) {
        localStorage.removeItem(key);
    },

    // sessionStorage
    SetSession(key, value) {
        if (key && value) {
            const val = JSON.stringify(value)
            sessionStorage.setItem(key, val)
        } else {
            throw new Error(`Missing 'key' or 'value'`)
        }
    },
    GetSession(key) {
        return JSON.parse(sessionStorage.getItem(key))
    },
    RemoveSession(key) {
        sessionStorage.removeItem(key);
    },

    // 需本地存储的数据调取方式
    findLocal(sendDate, data) {
        let functionName = sendDate.functionName;
        let promise, localData = this.GetLocal(functionName, data);
        if (localData) {
            promise = this.promise(localData);
        } else {
            promise = all.net.send(sendDate);
            promise.then(res => {
                this.SetLocal(functionName, res, data);
            });
        };
        return promise;
    },

    // 需本地暂存的数据调取方式
    findSession(sendDate) {
        let functionName = sendDate.functionName;
        let promise, localData = this.GetSession(functionName);
        if (localData) {
            promise = this.promise(localData);
        } else {
            promise = all.net.send(sendDate);
            promise.then(res => {
                this.SetSession(functionName, res);
            });
        };
        return promise;
    },

/********************** 数据存储 end **********************/

    //客服
    service24() {
        const open = window.open('', '', 'width=800,height=600');
        const data = all.tool.GetLocal('getConfig');
        if(data){
            if(data.live800.length > 0){
                open.location.href = data.live800[0].content + '&s=1' + '&enterurl=' + window.location.hostname
            } else {
                alert('没有设置在线客服。')
            }
        }
    },

    /**
     * 字符串数组转BASE64
     * @param  {Array} buffer
     * @return {base64}     
     */
    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return 'data:image/png;base64,' + window.btoa(binary);
    },

    /**
     * 验证整个表单
     * @param  {obj}        this环境
     * @param  {str}        特殊的rules名
     * @return {[type]}     [布尔]
     */
    validateForm(obj, rule){
        const flagArr = [];
        const rules = rule ? rule : 'rules';
        Object.keys(obj[rules]).forEach(val => {
            if (obj.$refs[val]) {
                flagArr.push(obj.$refs[val].validate())
            }
        })
        const flag = flagArr.find(o => o == false)
        if (all.tool.isUndefined(flag)) {
            return true
        } else {
            return false
        }
    },

    /********************** 判断数据类型 **********************/

    isObj:obj => Object.prototype.toString.call(obj) === "[object Object]",

    isArr:obj => Object.prototype.toString.call(obj) === "[object Array]",

    isNull:obj => Object.prototype.toString.call(obj) === "[object Null]",

    isUndefined:obj => Object.prototype.toString.call(obj) === "[object Undefined]",

    /********************** 判断数据类型 END **********************/

    /********************** 验证类 **********************/
    /**
     * 判断中国电话号码
     * @param  {nuber} val 号码   
     * @return {[type]}     [description]
     */
    isPhoneNum(val) {
        if (/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(val)) {
            return true
        } else {
            return false
        }
    },

    specialWord(value) {
        const regEn = /[ `~=!@#$%^&*()\-_+<>?:"{},.\/;'[\]]/im,
            regCn = /[ ·！=#￥（——）：；“”‘、，|《。》？、【】[\]]/im
        if (regEn.test(value) || regCn.test(value)) {
            return true
        } else {
            return false
        }
    },

    isChinese(val) {
        const reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        if (reg.test(val)) {
            return true
        } else {
            return false
        }
    },

    chinese(val) {
        const re = /[^\u4e00-\u9fa5]/
        if (re.test(val)) {
            return false
        } else {
            return true
        }
    },

    abc123(val) {
        const re = /^[a-zA-Z\d]+$/
        if (re.test(val)) {
            return true
        } else {
            return false
        }
    },
    /**
     * 判断是否未纯数字
     * @param  {all} val
     * @return {boolean}
     */
    isNumber(val) {
        if ((/^[1-9]+[0-9]*]*$/.test(val))) {
            return true
        } else {
            return false
        }
    },
    /********************** 验证类 END **********************/

    /********************** 杂项 **********************/

    /**
     * 是否不在真实环境显示
     * @param {number} show 0 || 1
     */
    noShowReal(show) {
        const h = (document.location.protocol).length <= 5;
        const showInRealServer = show != '0';
        const hostname = document.location.hostname == "haomen-fpms-web.neweb.me" || (document.location.hostname).indexOf('dev') >= 0;
        if(h || showInRealServer || hostname){
            return true
        } else {
            return false
        }
    },

    //手工存款充值方式 名字
    payName(DepositMethod){
        switch (parseInt(DepositMethod)) {
            case 1: return '网银转账';
            case 2: return 'ATM';
            case 3: return '柜台存款';
            case 4: return '支付宝转银行卡';
            case 5: return '微信转银行卡';
            case 6: return '云闪付转银行卡';
            default: return `未知支付方式: (${ DepositMethod })`;
        }
    },

    //银行卡名称
    bankName(bankTypeId){
        const bankList = all.tool.GetSession('getBankTypeList').data;
        let name = '未知银行卡 ' + bankTypeId;
        bankList.forEach(e => {
            if(parseFloat(e.bankTypeId) == parseFloat(bankTypeId)){
                name = e.name
            }
        });
        return name
    },
    /**
     * 时间秒数格式化
     * @param s 时间戳（单位：秒）
     * @returns {*} 格式化后的时分秒
     */
    sec_to_time(s){
        var t;
        if (s > -1) {
            var hour = Math.floor(s / 3600);
            var min = Math.floor(s / 60) % 60;
            var sec = s % 60;
            if (hour < 10) {
                t = '0' + hour + ":";
            } else {
                t = hour + ":";
            }

            if (min < 10) { t += "0"; }
            t += min + ":";

            if (sec < 10) { t += "0"; }

            t += sec;
        }
        return t;
    },

    // 游戏名字转中文
    chineseName(providerId, name) {
        let chinese
        switch (parseInt(providerId)) {
            case 16: chinese = 'AG真人'; break;
            case 18: chinese = 'PT电子'; break;
            case 20: chinese = 'AG捕鱼'; break;
            case 41: chinese = 'MG电子'; break;
            case 42: chinese = 'GG捕鱼'; break;
            case 45: chinese = 'DT电子'; break;
            case 47: chinese = 'BBIN电子'; break;
            case 50: chinese = 'EA真人'; break;
            case 52: chinese = 'LB彩票'; break;
            case 56: chinese = 'eBet真人'; break;
            case 57: chinese = 'ISB电子'; break;
            case 70: chinese = 'AG体育'; break;
            case 72: chinese = 'eBet电子'; break;
            case 81: chinese = 'QT电子'; break;
            case 83: chinese = 'KY棋牌'; break;
            case 85: chinese = 'AG电子'; break;
            case 86: chinese = 'SABA体育'; break;
            case 95: chinese = 'AV电子'; break;
            default: chinese = name; break;
        }
        return chinese
    },

    //提案状态转中文
    chineseStatus(str) {
        let chinese
        switch (str) {
            case 'Pending': chinese = '审核中'; break;
            case 'CsPending': chinese = '审核中'; break;
            case 'AutoAudit': chinese = '审核中'; break;

            case 'Approved': chinese = '支付中'; break;
            case 'Processing': chinese = '支付中'; break;
            case 'Undetermined': chinese = '支付中'; break;
            case 'Recover': chinese = '支付中'; break;

            case 'Success': chinese = '已支付'; break;

            case 'Cancel': chinese = '自助取消'; break;

            case 'Rejected': chinese = '已取消'; break;
            case 'Fail': chinese = '已取消'; break;

            case 'PrePending': chinese = '系统异常，请联系客服'; break;

            default: chinese = '系统异常，请联系客服'; break;
        }
        return chinese
    },

    /**
     * 保留2位小数且不四舍五入
     * @param  {string || number} num   要转换的数字
     * @param  {Number} point 需要保留小数几位  
     * @return {number}
     */
    fixedNum(num, point) {
        if (num) {
            num = JSON.stringify(num)
            let arr = []
            if (num.indexOf('.') > 0) {
                arr = num.split('.')
            } else {
                arr.push(num)
                arr.push('00')
            }
            const dec = arr[1].slice(0, point)
            return parseFloat(arr[0] + '.' + dec)
        } else {
            return num
        }
    },

    //浅拷贝
    copy(arr) {
　　　　let res = []
        for (let i = 0; i < arr.length; i++) {
            res.push(arr[i])
        }
        return res
    },

    /**
     * 乘法
     * @param  {[type]} arg1 [description]
     * @param  {[type]} arg2 [description]
     * @return {[num]}      牛逼的数字
     */
    accMul(arg1, arg2) {
        if (arg1 && arg2) {
            var m = 0, s1 = JSON.stringify(arg1), s2 = JSON.stringify(arg2);
            try { m += s1.split(".")[1].length } catch (e) { };
            try { m += s2.split(".")[1].length } catch (e) { };
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        }
    },

    /** 
    * 将数值四舍五入后格式化. 
    * @param num 数值(Number或者String) 
    * @param cent 要保留的小数位(Number) 
    * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型); 
    * @return 格式的字符串,如'1,234,567.45' 
    * @type String 
    */
    formatNumber(num, cent=0, isThousand=1) {
        num = num.toString().replace(/\$|\,/g, '');

        // 检查传入数值为数值类型  
        if (isNaN(num))
            num = "0";

        // 获取符号(正/负数)  
        let sign = (num == (num = Math.abs(num)));

        num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);  // 把指定的小数位先转换成整数.多余的小数位四舍五入  
        let cents = num % Math.pow(10, cent);              // 求出小数位数值  
        num = Math.floor(num / Math.pow(10, cent)).toString();   // 求出整数位数值  
        cents = cents.toString();               // 把小数位转换成字符串,以便求小数位长度  

        // 补足小数位到指定的位数  
        while (cents.length < cent)
            cents = "0" + cents;

        if (isThousand) {
            // 对整数部分进行千分位格式化.  
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        }

        if (cent > 0)
            return (((sign) ? '' : '-') + num + '.' + cents);
        else
            return (((sign) ? '' : '-') + num);
    },

    //转UTC
    getFormat(nTime) {
        let format = "";
        format += nTime.getFullYear() + "-";
        format += (nTime.getMonth() + 1) < 10
            ? "0" + (
                nTime.getMonth() + 1)
            : (nTime.getMonth() + 1);
        format += "-";
        format += nTime.getDate() < 10
            ? "0" + (
                nTime.getDate())
            : (nTime.getDate());
        format += "T";
        format += nTime.getHours() < 10
            ? "0" + (
                nTime.getHours())
            : (nTime.getHours());
        format += ":";
        format += nTime.getMinutes() < 10
            ? "0" + (
                nTime.getMinutes())
            : (nTime.getMinutes());
        format += ":00";
        return format;
    },
    //区分设备
    isClients() {
        const u = navigator.userAgent, app = navigator.appVersion;
        const isAndroidH5 = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;//android终端或者uc浏览器
        const isiOSH5 = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);//ios终端
        const isAndroidApp = window.native;//安卓APP
        const isIosApp = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);//苹果APP
        if (isAndroidApp){
            return '安卓APP'
        } else if (isIosApp){
            return '苹果APP'
        } else if (isAndroidH5){
            return '安卓H5'
        } else if (isiOSH5) {
            return '苹果H5'
        } else {
            return '未知设备'
        }
    },

    /********************** 杂项 END **********************/

    /**
     * isTEST
     * 自动判断是否是测试添加数组元素
     * arr==>需要处理的数组
     * realShow==》根据后台设置的是否在正式站展示
     * temp==》添加到数组中的元素
     */
    isTest(arr=[],realShow=0,temp, store) {
        if(store.state.isTest || (!store.state.isTest && realShow)){
            arr.push(temp)
        }
    },

    isShow(arr=[],store) {
        let temp=[];
        arr.map((item,index)=>{
            if(item && (store.state.isTest || !item.isTest)){
                temp.push(item)
            }
        })
        return temp;
    }
}