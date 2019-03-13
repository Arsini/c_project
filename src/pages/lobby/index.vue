<script>
export default {
    data(){
        return{
            navArr: '',//导航数据
            firstNum: null,//一级导航下标
            useLocalGameTreeInfo: false,
            secondArrGames: [],//二级导航为空时，直接显示该组游戏
            gameData: '',
            isShow: false,
            isRealPlayer: false,
            providerStatus: [],
            windowOpen: '',
            client: '',
            groupId: '',
            page: '', // 首页lobby || 大厅lobby
        }
    },
    created(){
        this.$api.getProviderList().then(res=>{
            this.providerStatus = res.data
            const data = all.tool.GetLocal('getGameGroupTreeInfo');
            if(data){
                this.useLocalGameTreeInfo = true
                this.getGameGroupTreeInfo(data)
            }
        })
        this.page = this.$route.path
        const isLogin = all.tool.GetSession('user');
        if(isLogin) {
            this.isRealPlayer = all.tool.GetSession('user').isRealPlayer
        }
        this.client = all.tool.isClients();
    },
    watch:{
        '$store.state.gameTreeInfo'(){
            if(!this.useLocalGameTreeInfo){
                const data = all.tool.GetLocal('getGameGroupTreeInfo');
                this.getGameGroupTreeInfo(data)
            }
        }
    },
    methods: {
        //获取游戏树
        getGameGroupTreeInfo(res){
            this.groupId = res.code
            this.initNav(res.children)//抽出API中所需要的数据
        },

        //抽出API中所需要的数据
        initNav(arr){
            const _array = [];
            const cdnOrFtpLink = all.tool.GetLocal('getConfig').cdnOrFtpLink;
            const str = JSON.stringify(new Date());
            const hash = str.slice(0,14);
            arr.forEach(firstArr => { //循环一级导航
                const firstChildren = [];
                (firstArr.children).forEach(secondArr => { //循环二级导航
                    const secondChildren = [];
                    secondArr.children.forEach(thirdArr => {//循环三级导航
                        secondChildren.push({
                            code: thirdArr.code,
                            displayName: thirdArr.displayName,
                            children: [],
                        })
                    });
                    let gameGroupIconUrl = '';
                    if(this.page == '/lobby'){
                        gameGroupIconUrl = secondArr.gameGroupIconUrl
                    } else {
                        gameGroupIconUrl = `${cdnOrFtpLink}hm/NNew/NewMobile/Index/other/${secondArr.code}.png?${hash}`
                    }
                    firstChildren.push({
                        code: secondArr.code,
                        displayName: secondArr.displayName,
                        children: secondChildren,
                        gameGroupIconUrl,
                    })
                });
                _array.push({
                    code: firstArr.code,
                    displayName: firstArr.displayName,
                    children: firstChildren,
                });
            });
            this.navArr = _array
            const session = parseInt(all.tool.GetSession('lobbyFirstNum'));
            const query = this.$route.query.firstNum;
            if(query){
                this.firstNum = query
            } else if(session){
                this.firstNum = session
            } else {
                if(_array.length > 0){
                    this.selectFirstNav(0)
                }
            }
        },

        //选择一级导航
        selectFirstNav(firstNum){
            const num = firstNum.toString()
            all.tool.SetSession('lobbyFirstNum', num);
            this.firstNum = firstNum
        },

        //去游戏
        gotoGame(displayName, code) {
            const flag = (this.navArr[this.firstNum].displayName).indexOf('真人') != -1 || 
            (this.navArr[this.firstNum].displayName).indexOf('体育') != -1  || 
            (this.navArr[this.firstNum].displayName).indexOf('彩票') != -1;
            const url = `/lobby/${displayName}?id=${code}&groupid=${this.groupId}`;
            if(flag){//如果是真人大厅 和体育大厅
                const data = {
                    requestCount: 2,
                    startIndex: 0,
                    code,
                }
                if(this.client != '苹果APP'){
                    this.windowOpen = window.open();
                }
                //检测游戏内如果只有1个游戏直接打开游戏
                this.$api.getGameGroupInfo(data).then(res=> {
                    const gameList = res.data.games.gameList;
                    if(gameList.length == 1){
                        const game = gameList[0].game;
                        this.startGame(game.gameId, game.canTrial, game.status)
                    } else {
                        if(this.client != '苹果APP'){
                            this.windowOpen.close()
                        }
                        this.$router.push(url)
                    }
                }, err=>{
                    this.loading = false
                })
            } else {
                this.$router.push(url)
            }
        },

        /**
         * 开始游戏
         * @param  {string} id   游戏ID
         * @param  {number} type 0：免费试玩  1：开始游戏
         */
        startGame(id, canTrial, status) {
            if(status == 1){
                const host = `http://${window.location.host}`
                const query = {
                    clientDomainName: host,
                    clientType: 2,
                    gameId: id,
                }
                this.gameData = query
                
                if(canTrial && !this.isRealPlayer) {
                    this.windowOpen.close()
                    this.isShow = true
                } else {
                    this.getLoginURL('getLoginURL')
                }
            }
        },

        /**
         * 开始正式游戏:api=getLoginURL || 开始试玩游戏:api=getTestLoginURL
         */
        getLoginURL(api) {
            if(this.$store.state.isSignIn){
                const origin = window.location.origin;
                const url = `${origin}/#/game_loading?api=${api}&gameId=${this.gameData.gameId}&clientType=2&clientDomainName=${this.gameData.clientDomainName}`;
                if(this.client != '苹果APP'){
                    this.windowOpen.location.href = url
                } else {
                    window.location.href = url
                }
            } else {
                this.windowOpen.close()
                this.$router.push('/sign_in')
                this.msg('请先登陆')
            }
        },
        
        downDT(){
            switch (this.client) {
                case '苹果APP': window.location.href = 'http://down.dreamtech.asia/BYL/ios.html'; break;
                case '安卓APP': window.location.href = 'http://down.dreamtech.asia/BYL/android.html'; break;
                case '安卓H5': window.open('http://down.dreamtech.asia/BYL/android.html'); break;
                case '苹果H5': window.open('http://down.dreamtech.asia/BYL/ios.html'); break;
                default: alert('未知设备, 无法下载'); break;
            }
        },
        downEBET(){
            switch (this.client) {
                case '苹果APP': ; break;
                case '安卓APP': ; break;
                case '安卓H5': window.open('https://www.ebetapp.com/baoylai'); break;
                case '苹果H5': this.msg("此客户端仅提供给安卓系统用户，苹果用户欲使用手机登入宝运莱，请直接在手机浏览器上直接输入宝运莱网址即可"); break;
                default: alert('未知设备, 无法下载'); break;
            }
        },
        defaultImg(e){
            e.target.parentNode.style.display = 'none'
            // e.target.style.display = 'none'
        },

        downLb(){
            switch (this.client) {
                case '苹果APP': ; break;
                case '安卓APP': ; break;
                case '安卓H5': window.open('http://download.lb-keno-game.com/byl/android/'); break;
                case '苹果H5': window.open('http://download.lb-keno-game.com/byl'); break;
                default: alert('未知设备, 无法下载'); break;
            }
        }
    },
    computed:{
        // navComputed(){
        //     let arr = [];
        //     if(this.navArr && !all.tool.isNull(this.firstNum)){
        //         arr = this.navArr[this.firstNum].children
        //     }
        //     return arr
        // }
    },
}
</script>

<template>
    <div class="lobby">
        <ul class="tab" :class="{ 'index_tab' : page == '/'}">
            <li 
            v-for="(val, key) in navArr"
            v-track="`首页游戏区 ${val.displayName}`"
            :key="key"
            @click="selectFirstNav(key)"
            :class="{'current': key == firstNum }">{{ val.displayName }}</li>
        </ul>

        <h3 class="type_title wrap" v-show="page == '/lobby'">
            <i class="iconfont icon-wangzhan"></i>
            <span>网页版</span>
        </h3>
        <!-- 游戏大厅 -->
        <ul
        v-for="(val, key) in navArr"
        v-show="key == firstNum"
        :key="key"
        :class="{ 'provider_smart' : page == '/' && (firstNum == 1 || firstNum == 3)}"
        class="provider">
            <li 
            v-for="(v, k) in val.children"
            :key="k" 
            @click="gotoGame(v.displayName, v.code)">
                <img :src="v.gameGroupIconUrl" @error='defaultImg'>
            </li>
        </ul>
        <!--  -->
        <h3 class="type_title wrap" v-show="page == '/lobby' && (firstNum == 0 || firstNum == 1 || firstNum == 4)">
            <i class="iconfont icon-kehuduan"></i>
            <span>手机客户端</span>
        </h3>
        <!-- 电子 -->
        <ul class="provider" v-show="page == '/lobby' && firstNum == 0">
            <li>
                <a target="_blank" href="http://m.mp176588.com/download.html">
                    <img src="./img/ptapp.png">
                </a>
            </li>
            <li @click="downDT">
                <img src="./img/dtapp.png">
            </li>
        </ul>
        <!-- 真人 -->
        <ul class="provider" v-show="page == '/lobby' && firstNum == 1">
            <li @click="downEBET">
                <img src="./img/eBet_app.png">
            </li>
        </ul>
        <!-- 彩票 -->
        <ul class="provider" v-show="page == '/lobby' && firstNum == 4">
            <li @click="downLb">
                <img src="./img/lb.png">
            </li>
        </ul>
        <!-- 选择游戏 模式 -->
        <div v-show="isShow" class="games_free" @click='isShow = false'>
            <button class="btn btn_secondary" @click='getLoginURL("getLoginURL")'>正式游戏</button>
            <button class="btn btn_primary" @click='getLoginURL("getTestLoginURL")' v-show="!isRealPlayer">免费试玩</button>
        </div>
    </div>
</template>

<style lang="postcss">
    .lobby{
        .type_title{
            padding-top: 10px;
            padding-bottom: 10px;
            color: #999;
        }
        .provider{
            display: flex;
            flex-wrap: wrap;
            padding-left:2%;
            padding-bottom: 10px;
            min-height: 285px;
            li{
                width: 50%;
                padding: 0 2% 2% 0;
            }
        }
        .games_free{
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, .7);
            z-index: 1;
            button{
                width: 60%;
                height: 1rem;
                margin: .3rem auto;
            }
        }
        .index_tab{
            border-bottom: none;
            width: 96%;
            margin: 16px auto;
            border-left: 3px solid #ffaa0d;
            padding-left: 2.5%;
            li{
                line-height: 20px;
                flex:0 0 auto;
                font-size: 16px;
                padding: 0 2.5%;
                white-space:nowrap;
            }
            .current{
                &:after{
                    width: auto;
                    background-color: #101010;
                }
            }
        }
        .provider_smart{
            li{
                width: 33.3%;
            }
        }
    }
</style>
