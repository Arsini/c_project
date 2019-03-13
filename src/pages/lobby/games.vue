<script>
    export default {
        data () {
            return {
                current: '',
                isRealPlayer:false,
                gameName: '',
                games: [],
                loading: false,
                startIndex: 0,
                requestCount: 30,
                noMoreGame: false,
                isShow: false,
                gameData: '',
                client: '',
                totalCount: '',
                searchName: '',
                timer: '',
                confirm: false,
                gameURL: '',
            }
        },
        created () {
            this.selectTab('全部游戏')
            this.$store.commit('TITLE_NAME', this.$route.params.gamename)
            const isLogin = all.tool.GetSession('user')
            if(isLogin) {
                this.isRealPlayer = all.tool.GetSession('user').isRealPlayer
            }
            this.client = all.tool.isClients();
        },

        methods: {
            //api
            //搜索游戏
            _searchGame: data => all.net.send({
                service: 'game',
                functionName: 'searchGame',
                data,
            }),
            //
            _getLoginURL: data => all.net.send({
                service: 'game',
                functionName: 'getLoginURL',
                data,
            }),

            _getTestLoginURL: data => all.net.send({
                service: 'game',
                functionName: 'getTestLoginURL',
                data,
            }),

            //添加收藏
            _addFavoriteGame: data => all.net.send({
                service: 'game',
                functionName: 'addFavoriteGame',
                data,
            }),

            //取消收藏
            _removeFavoriteGame: data => all.net.send({
                service: 'game',
                functionName: 'removeFavoriteGame',
                data,
            }),

            //获取收藏列表
            _getFavoriteGames: data => all.net.send({
                service: 'game',
                functionName: 'getFavoriteGames',
                data,
            }),

            //tab
            selectTab(name){
                this.current = name
                this.games = []
                this.startIndex = 0
                this.searchName = ''
                this.$store.commit('TITLE_NAME', this.$route.params.gamename)
                if(name == '我的最爱'){
                    this.getFavoriteGames()
                } else {
                    this.gameGroupInfo()
                }
            },

            /**
             * 请求接口 渲染游戏
             * @param  {number} code 游戏组ID
             */
            gameGroupInfo() {
                this.loading = true
                const data = {
                    requestCount: this.requestCount,
                    startIndex: this.startIndex,
                    code: this.$route.query.id,
                }
                this.$api.getGameGroupInfo(data).then(res=> {
                    const _games = res.data.games.gameList;
                    const games = this.formatGames(_games);
                    this.games = games
                    if(games.length < 12){
                        this.noMoreGame = true
                    }
                    this.loading = false
                    this.totalCount = res.data.games.stats.totalCount
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }, err=>{
                    this.loading = false
                })
            },

            //格式化游戏列表
            formatGames(gameList){
                const games = [];
                gameList.forEach(e => {
                    const game = this.current == '我的最爱'? e : e.game;
                    const isImages = game.images? game.images : false;
                    const img = isImages[window.platformId]? isImages[window.platformId] : game.smallShow;
                    const isChangedName = game.changedName? game.changedName : false;
                    const changedName = isChangedName[window.platformId]? isChangedName[window.platformId] : game.name;
                    const isFavorite = game.isFavorite? game.isFavorite : false;
                    games.push({
                        name: changedName,
                        gameId: game.gameId,
                        img,
                        canTrial: game.canTrial,
                        status: game.status,
                        isFavorite,
                    })
                })
                return games
            },


            //没有更多游戏
            moreGame(){
                if(!this.noMoreGame){
                    this.loading = true
                    this.startIndex += this.requestCount
                    this.gameGroupInfo()
                }
            },

            //选择我的最爱
            favoriteFn(key){
                const isFavorite = this.games[key].isFavorite;
                const gameId = this.games[key].gameId;
                this.games[key].isFavorite = !isFavorite
                if(isFavorite){
                    this._removeFavoriteGame({ gameId }).then(res=>{
                        this.msg('删除收藏成功', 'success')
                        if(this.current == '我的最爱'){
                            const index = this.games.indexOf(this.games[key]);
                            if (index > -1) {
                                this.games.splice(index, 1);
                            }
                        }
                    })
                } else {
                    this._addFavoriteGame({ gameId }).then(res=>{
                        this.msg('添加收藏成功', 'success')
                    })
                }
            },

            //获取我的最爱列表
            getFavoriteGames(){
                this._getFavoriteGames().then(res=>{
                    this.games = this.formatGames(res.data);
                })
            },
            
            /**
             * 开始游戏
             * @param  {string} id   游戏ID
             * @param  {number} type 0：免费试玩  1：开始游戏
             */
            startGame(id,canTrial, status) {
                if(status == 1){
                    const host = `http://${window.location.host}`
                    const query = {
                        clientDomainName: host,
                        clientType: 2,
                        gameId: id,
                    }
                    this.gameData = query
                    
                    if(this.$store.state.isSignIn && this.isRealPlayer){
                        this.getLoginURL('_getLoginURL')
                    } else if(!this.$store.state.isSignIn){
                        this.isShow = true
                    } else if(canTrial){
                        this.getLoginURL("_getTestLoginURL")
                    }

                    if(!canTrial && !this.isRealPlayer){
                        this.msg('此大厅不可试玩。')
                    }
                }
            },

            /**
             * 开始正式游戏:api=getLoginURL || 开始试玩游戏:api=getTestLoginURL
             */
            getLoginURL(api) {
                if(this.$store.state.isSignIn){
                    // const origin = window.location.origin;
                    // const url = `${origin}/#/game_loading?api=${api}&gameId=${this.gameData.gameId}&clientType=2&clientDomainName=${this.gameData.clientDomainName}`;
                    // if(this.client != '苹果APP'){
                    //     window.open(url);
                    // } else {
                    //     const query = {
                    //         api,
                    //         gameId: this.gameData.gameId,
                    //         clientType: 2,
                    //         clientDomainName: this.gameData.clientDomainName
                    //     }
                    //     this.$router.push({ path:`/game_loading`, query, })
                    // }
                    this.loading = true
                    this[api]({
                        gameId: this.gameData.gameId,
                        clientType: 2,
                        clientDomainName: this.gameData.clientDomainName
                    }).then(res=>{
                        this.loading = false
                        this.confirm = true
                        this.gameURL = res.data.gameURL
                    })
                } else {
                    if(api == '_getLoginURL'){
                        this.$router.push('/sign_in')
                        this.msg('请先登陆')
                    } else {
                        this.$router.push('/free_play')
                        this.msg('请申请试玩')
                    }
                }
            },

            enterGame(){
                window.open(this.gameURL)
                this.confirm = false
                this.gameURL = ''
            },

            next(){
                this.startIndex += this.requestCount
                this.gameGroupInfo()
            },
            pre(){
                this.startIndex -= this.requestCount
                this.gameGroupInfo()
            },
            pageJump(index){
                this.startIndex = this.requestCount * index
                this.gameGroupInfo()
            },

            searchGame(e){
                clearTimeout(this.timer)
                this.timer = setTimeout(()=>{
                    const name = e.target.value;
                    if(name){
                        this.$store.commit('TITLE_NAME', '搜索游戏')
                        const data = {
                            groupCode: this.$route.query.groupid,
                            playGameType: 2,
                            name,
                        }
                        this._searchGame(data).then(res=>{
                            this.games = this.formatSearchGame(res.data)
                        })
                    } else {
                        this.$store.commit('TITLE_NAME', this.$route.params.gamename)
                        this.gameGroupInfo()
                    }
                },2000)
            },

            //格式化游戏列表
            formatSearchGame(gameList){
                const games = [];
                gameList.forEach(e => {
                    const game = e;
                    const isImages = game.images? game.images : false;
                    const img = isImages[window.platformId]? isImages[window.platformId] : game.smallShow;
                    const isChangedName = game.changedName? game.changedName : false;
                    const changedName = isChangedName[window.platformId]? isChangedName[window.platformId] : game.name;
                    const isFavorite = game.isFavorite? game.isFavorite : false;
                    games.push({
                        name: changedName,
                        gameId: game.gameId,
                        img,
                        canTrial: game.canTrial,
                        status: game.status,
                        isFavorite,
                    })
                })
                return games
            },
        }
    }
</script>

<template>
    <div class="lobby_games">
        <ul class="tab">
            <li :class="{ 'current' : current == '全部游戏'}" @click='selectTab(`全部游戏`)'>全部游戏</li>
            <li :class="{ 'current' : current == '我的最爱'}" @click='selectTab(`我的最爱`)'>我的最爱</li>
        </ul>
        <div class="search" v-show="current != '我的最爱'">
            <input v-model="searchName" @input="searchGame" placeholder="搜索游戏" type="text">
            <i class="iconfont icon-sousuo1 primary_text_color"></i>
        </div>
        <ul class="games">
            <li v-for="(val, key) in games" :key="key">
                <img :src="val.img" @click="startGame(val.gameId, val.canTrial, val.status)">
                <h4 class="game_name" @click="favoriteFn(key)">
                    <i class="iconfont icon-xingxing" :class="{ 'favorite' : val.isFavorite}"></i>
                    <span>{{ val.name }}</span>
                </h4>
                <div v-show="val.status == 2" class="maintain">
                    <p>正在维护</p>
                </div>
            </li>
        </ul>
        
        <Pagination
        v-show="$store.state.titleName!='搜索游戏' && current != '我的最爱'"
        :requestCount='requestCount'
        :totalCount='totalCount'
        :currentPage='startIndex/requestCount'
        @next='next'
        @pre='pre'
        @jump='pageJump'/>

        <div v-show="isShow" class="games_free" @click='isShow = false'>
            <button class="btn btn_secondary" @click='getLoginURL("_getLoginURL")'>正式游戏</button>
            <button class="btn btn_primary" @click='getLoginURL("_getTestLoginURL")' v-show="!isRealPlayer">免费试玩</button>
            <!-- <button @click='isShow = false'>返回</button> -->
        </div>
        <!-- 微信客服 -->
        <Dialog
		title='提示' 
		:visible='confirm'>
			<div slot="body">
                <p style="text-align: center; padding: 10px 0;">确认进入游戏</p>
            </div>
            <div slot="footer">
				<div class="btn_center btn_dialog">
                    <button @click="enterGame" class="btn btn_primary">确定</button>
                    <button @click="confirm=false" class="btn btn_pop_cancel">取消</button>
                </div>
			</div>
        </Dialog>
        <Loading class="games_loading" :isShow='loading'/>
    </div>
</template>

<style lang="postcss">
    .lobby_games{
        .search {
            margin: 20px 2% 0 2%;
            position: relative;
            input{
                border-radius: 20px;
                line-height: 76px;
                width: 100%;
                display: block;
                margin: 0 auto;
                padding-left: 60px;
                background-color: #333333;
                color:#888888;
                border: none;
            }
            .iconfont{
                position: absolute;
                left: 16px;
                top:0;
                line-height: 74px;
                font-size: 30px;
            }
        }
        .games{
            display: flex;
            flex-wrap: wrap;
            padding: 30px 0 30px 2.5%;
            
            li{
                width: 33.3%;
                padding-right: 2.5%;
                position: relative;
                img{
                    width: 100%;
                    height: 2.5rem;
                    border-radius: .2rem;
                }
                .game_name{
                    padding-bottom: 14px;
                    margin-top: 6px;
                    text-align: center;
                    .iconfont{
                        color: #666;
                    }
                    .favorite{
                        color: #ffaa0d;
                    }
                }
                .maintain{
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, .5);
                    z-index: 1;
                    p{
                        color: #fff;
                        text-align: center;
                        line-height: 30px;
                        background: rgba(0, 0, 0, .7);
                    }
                    i{
                        font-size: 20px;
                    }
                }
            }
        }
        .more{
            text-align: center;
            padding: 16px 0 26px 0;
            border-top: 1px solid #333;
        }
        .games_loading{
            position: fixed;
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
    }
</style>

