<script>
import ItemCarousel from './carousel';
import Notice from 'components/notice'
import Lobby from 'pages/lobby'
import LatestActivity from './latest_activity'
export default {
    props: ['promoCodeData'],
    components:{
        ItemCarousel,
        Lobby,
        Notice,
        LatestActivity
    },
    data(){
        return{
            lobbyTree: '',
            client: '',
            visible: '',
            rankList: [],
            reward: [],
            liveList: [
                {
                    gameId: 'D46E9A9B-46B7-4285-96AB-8D91BCC3CC8B',
                    img: require('./img/ebet.png'),
                },
                {
                    gameId: 'C78F36F5-D74E-4C85-964F-CC10A1F57737',
                    img: require('./img/AG.png'),
                },
                {
                    gameId: 'AF8A2538-1791-4A3E-8821-F371853B941B',
                    img: require('./img/EA.png'),
                },
            ],

            otherList: [
                {
                    page: 2,
                    img: require('./img/o1.png'),
                },
                {
                    page: 4,
                    img: require('./img/o2.png'),
                },
                {
                    page: 3,
                    img: require('./img/o3.png'),
                },
            ]
        }
    },
    created(){
        this.client = all.tool.isClients();
        const data = {
            mode: '5',
            periodCheck: 1,
            recordCount: 5,
            providerId: ['56'],
        }
        this._getPlayerBillBoard(data).then(res=>{
            const arr = []
            res.data.allWin.boardRanking.forEach(e => {
                const obj = {
                    rank: e.rank,
                    name: e.name,
                    amount: e.amount,
                }
                arr.push(obj)
            });
            this.rankList = arr
        })

        this.$api.getRewardList().then(res=>{
            const arr = [];
            res.data.forEach(el => {
                if(el.code.indexOf('限时优惠') != -1){
                    if(arr.length <= 1){
                        arr.push({
                            img: el.condition.imageUrl[0],
                            code: el.code,
                            link: el.list[0].btnOrImageList[1].btnSourceFrom,
                            type: el.type.des,
                        })
                    }
                }
            });
            this.reward = arr
        })

        // this.getLiveGameInfo()
    },
    mounted(){
        if( this.client == '安卓H5' || this.client == '苹果H5') {
            this.visible = true
        }
    },
    methods:{
        /* API */
        //玩家充值投注排行榜
        _getPlayerBillBoard: data => all.net.send({
            service: 'player',
            functionName: 'getPlayerBillBoard',
            data,
        }),

        // 获取真人游戏实时详情
        _getLiveGameInfo: data => all.net.send({
            service: 'game',
            functionName: 'getLiveGameInfo',
            data,
        }),

        getLiveGameInfo(){
            this._getLiveGameInfo({ count: 1}).then(res=>{
                log(res)
            })
        },

        angentOpen(){
            window.open("https://www.baoyunlai-daili1.com",'_blank');
        },
        /*
        *   @param schemaUrl 想要打开的APP的URI Scheme
        *   @param fail      如果打开失败(手机没有安装APP)时执行的函数
        */
        openApp(schemaUrl) {
            //创建一个iframe用于存放想要打开的APP的URI Scheme
            var ifr = document.createElement('iframe'),
                t = 500,
                t1,
                timeout
            ifr.style.display = 'none';
            document.body.appendChild(ifr);
            t1 = Date.now();
            ifr.src = schemaUrl;
            timeout = setTimeout(() => {
                var t2 = Date.now();
                if (t2 - t1 < t + 100) {
                    const QRCode = {
                        'b.bao898.com': 'http://td99.neweb.me/newhaomen_telemarketing/m/bao898/bao898.apk',
                        'b.bao828.com': 'http://td99.neweb.me/newhaomen_telemarketing/m/bao828/bao828.apk',
                        'b.bao833.com': 'http://td99.neweb.me/newhaomen_telemarketing/m/bao833/bao833.apk',
                        'b.bao878.com': 'http://td99.neweb.me/newhaomen_telemarketing/m/bao878/bao878.apk',
                        'b.bao397.com': 'http://td99.neweb.me/newhaomen_telemarketing/m/bao397/bao397.apk',
                    }
                    const hostname = location.hostname;
                    const code = QRCode[hostname];
                    if(code){
                        location.href = code
                    }else {
                        location.href = 'http://app.bao1618.com'
                    }
                }
                document.body.removeChild(ifr);
            }, t)
        },
        downloadIos(){
            window.location.href = 'https://td99-ios.neweb.me/IOS/byl_ios/byl_official/download.html'
        },
        closeClient(){
            this.visible = false
        },
        //跳转游戏大厅
        goingToLobby(name, code){
            this.$router.push(`/lobby/${name}?id=${code}`)
        },

        //了解详情
        showDetail({code, link, type}){
            const query = {
                code,
                link,
                type,
            }
            this.$router.push({ path:`/reward_detail`, query, })
        },

        //
        openLive(gameId){
            if(this.$store.state.isSignIn){
                if(all.tool.GetSession('user').isRealPlayer){
                    const origin = window.location.origin;
                    const host = `http://${window.location.host}`
                    const url = `${origin}/#/game_loading?api=getLoginURL&gameId=${gameId}&clientType=2&clientDomainName=${host}`;
                    if(this.client != '苹果APP'){
                        window.open(url)
                    } else {
                        window.location.href = url
                    }
                } else {
                    if(gameId == 'AF8A2538-1791-4A3E-8821-F371853B941B'){
                        this.msg('不支持试玩')
                    } else {
                        this.openLobby(1)
                    }
                }
            } else {
                this.$router.push('/sign_in')
                this.msg('请先登陆')
            }
        },

        //
        openLobby(page){
            all.tool.SetSession('lobbyFirstNum', page)
        },

        openLiveLobby(){
            this.openLobby(1)
            this.$router.push('/lobby')
        }
    },
    computed:{
        noUseList(){
            let length = 0;
            if(this.promoCodeData){
                length =  this.promoCodeData.noUseList.length
            }
            return length
        }
    },
}
</script>

<template>
    <div class="index">
        <div class="app_down" v-show="visible">
            <div class="left">
				<img  src="./img/client_icon.png">
				<span>全新APP</span>
			</div>
            <div v-if='client == "苹果H5"' class="right">
                <a class="down" @click="downloadIos" v-track="`首页下载区 下载`">下载</a>
				<a href='byl://' v-track="`首页下载区 打开APP`" class="border_btn">打开APP</a>
				<a href="https://www.appbyl.com/" target="_blank" v-track="`首页下载区 详情`" class="border_btn">详情</a>
            </div>
            <div v-if='client == "安卓H5"' class="right">
				<a @click="openApp('byl://')" v-track="`首页下载区 打开app`" class="border_btn">打开APP</a>
				<a href="https://www.appbyl.com/" target="_blank" v-track="`首页下载区 详情`" class="border_btn">详情</a>
            </div>
            <div @click="closeClient" v-track="`首页下载区 关闭`" class="close_client">X</div>
        </div>
        <ItemCarousel/>
        <Notice/>
        <div class="wrap">
            <h3 class="index_title">真人游戏</h3>
            <ul class="lobby">
                <li
                v-for="item in liveList" 
                :key="item.img"
                @click="openLive(item.gameId)">
                    <img :src="item.img">
                </li>
            </ul>
        </div>

         <div class="wrap bjl"><!--百家乐 -->
            <h3 class="index_title">百家乐</h3>
            <img src="./img/bjl.png">
        </div>

        <div class="rank wrap">
            <table>
                <tr>
                    <th>实时排名</th>
                    <th>用户账号</th>   
                    <th>盈利额度</th>
                    <th>进入大厅</th>
                </tr>
                <tr v-for="item in rankList" :key="item.rank">
                    <td v-if="item.rank<=3">
                        <img :src="require(`./img/rank_${item.rank}.png`)">
                    </td>
                    <td v-else>{{ item.rank }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}</td>
                    <td @click="openLiveLobby('1')">
                        <span class="rank_btn font_color">跟注</span>
                    </td>
                </tr>
            </table>
            <p>注：展示的数据为玩家游戏中的实时数据，每小时更新一次</p>
        </div>

        <div class="egame wrap">
            <h3 class="index_title">电子游戏</h3>
            <router-link to="/lobby" tag='ul' class="egame_lobby">
                <li @click="openLobby('0')">
                    <img src="./img/e1.png">
                </li>
                <li @click="openLobby('0')">
                    <img src="./img/e2.png">
                </li>
            </router-link>
            <router-link to="/lobby" tag='ul' class="egame_lobby">
                <li @click="openLobby('0')">
                    <img src="./img/e3.png">
                </li>
                <li @click="openLobby('0')">
                    <img src="./img/e4.png">
                </li>
            </router-link>
        </div>

        <div class="wrap">
            <h3 class="index_title">其他游戏</h3>
            <router-link to="/lobby" tag='ul' class="lobby">
                <li v-for='item in otherList' :key="item.img" @click="openLobby(item.page)">
                    <img :src="item.img">
                </li>
            </router-link>
        </div>

        <div class="index_rewrad wrap">
            <h3 class="index_title">
                <span>优惠活动</span>
                <router-link to="/reward">更多优惠 ></router-link>
            </h3>
            <ul class="index_rewrad_list">
                <li v-for="item in reward" :key="item.code" @click="showDetail({ type: item.type, link: item.link, code: item.code})">
                    <img :src="item.img">
                </li>
            </ul>
        </div>

        <div class="index_sign" v-show="!$store.state.isSignIn">
            <div class="index_sign_box">
                <router-link to='/sign_in' tag="img" :src="require('./img/sign_in.png')"></router-link>
                <router-link to='/free_play' tag="img" :src="require('./img/free_game.png')"></router-link>
            </div>
        </div>

        <!-- <ul class="function wrap">
            <router-link v-track="`首页功能区 优惠活动`" tag="li" to="/reward">
                <img src="./img/1.png">
                <p>优惠活动</p>
            </router-link>
            <router-link v-track="`首页功能区 优惠券`" tag="li" to="/coupon">
                <div v-show="noUseList" class="badge">{{ noUseList }}</div>
                <img src="./img/3.png">
                <p>优惠券</p>
            </router-link>
            <router-link v-track="`首页功能区 签到礼金`" tag="li" to="/daycheckin">
                <img src="./img/4.png">
                <p>签到礼金</p>
            </router-link>
            <router-link v-track="`首页功能区 VIP专区`" tag="li" to="/vip">
                <img src="./img/7.png">
                <p>VIP专区</p>
            </router-link>
            <li v-track="`首页功能区 合作代理`" @click="angentOpen">
                <img src="./img/8.png">
                <p>合作代理</p>
            </li>
        </ul> -->
        <!-- <Lobby/> -->
        <LatestActivity />
    </div>
</template>
<style lang="postcss">
    .index{
        color: #fff;
        .app_down{
            display: flex;
            background-color: #0e0e0e;
            background-image: url(./img/down_bg.png);
            background-repeat: no-repeat;
            background-position: left bottom;
            background-size: 118px;
            padding: 26px 2% 10px 2%;
            justify-content: space-between;
            position: relative;
            .left,.right{
                a{
                    color: #ffaa0d;
                    border: 1PX solid #ffaa0d;
                    width: 1.8rem;
                    height: 50px;
                    text-align: center;
                    margin-left: .2rem;
                    border-radius: .1rem;
                    font-size: .35rem;
                    line-height: 50px;
                }
                .down{
                    background-color: #ffaa0d;
                    color: #fff;
                }
            }
            .left{
                display: flex;
                align-items: center;
                width: 32%;
            }
            .right{
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex: 1;
            }
            img{
                height: 88px;
                margin-right: 2%;
            }
            .close_client{
                position: absolute;
                top: 0px;
                right: 0px;
                width: 40px;
                line-height: 40px;
                text-align: center;
                color: #666;
            }
        }

        .index_title{
            margin: 14px 0 24px 0;
            display: flex;
            justify-content: space-between;
            a{
                color: #858585;
                font-size: 24px;
                line-height: 42px;
                font-weight: normal;
            }
        }
        .lobby{
            display: flex;
            margin-bottom: 40px;
            li{
                width: 33.33%;
                margin-right: 4%;
                &:last-child{
                    margin: 0;
                }
            }
        }
        
        .bjl{
            overflow: hidden;
            background: #131317;
            padding-bottom: 30px;
        }

        .rank{
            background-color: #000;
            background-image: url(./img/rank_bg.png);
            background-size: cover;
            background-position: center bottom;
            table{
                width: 100%;
                th,td{
                    border-bottom: 1PX solid #444;
                    line-height: 80px;
                }
                td{
                    text-align: center;
                }
            }
            p{
                padding: 24px 0;
                text-align: center;
            }
            .rank_btn{
                border: 1PX solid #be984d;
                padding: 8px 20px;
                border-radius: .1rem;
            }
            .font_color{
                color: #be984d;
            }
            img{
                width: 50px;
                margin-top: 12px;
            }
        }

        .egame{
            background-color: #131317;
            overflow: hidden;
            padding-bottom: 10px;
        }
        
        .egame_lobby{
            display: flex;
            margin-bottom: 26px;
            li{
                width: 50%;
                margin-right: 4%;
                &:last-child{
                    margin: 0;
                }
            }
        }

        .index_rewrad{
            background-color: #1a1a24;
            overflow: hidden;
            padding-bottom: 98px;
        }
        .index_rewrad_list{
            li{
                margin-bottom: 20px;
            }
            img {
                width: 100%;
            }
        }
    }

    .index_sign{
        text-align: center;
        padding: 10px 0;
        position: fixed;
        bottom: 98px;
        width: 100%;
        background-color: #000;
        .index_sign_box{
            display: inline-block;
        }
        img{
            width: 34%;
            margin: 0 2%;
        }
    }
</style>