<script>
export default {
    props: ['mailList', 'serviceComponent'],
    data(){
        return{

        }
    },
    methods: {
        
        back() {
            const arr = this.$store.state.routerArr;
            this.$router.push(arr[arr.length - 1])
            this.$store.commit('ROUTER_ARR', { type: -1, name: ''})
        },

        //退出登陆
        signOut(){
            const playerId = all.tool.GetSession('playerId');
            this.$api.logout({ playerId }).then(res=>{
                this.$store.commit('IS_SIGN_IN', false)//退出登陆
                all.tool.RemoveSession('user')
                all.tool.RemoveSession('playerId')
                all.tool.RemoveSession('token')
                this.$router.push('/')
                this.msg('成功登出', 'success')
            })
        },
        showServer(){
            let flag = !this.serviceComponent
            this.$emit('popFlag', 'serviceComponent', flag)
            this.$store.commit('IS_SIDEBAR', false)
        },

        sidebar(){
            const flag = !this.$store.state.isSidebar;
            this.$store.commit('IS_SIDEBAR', flag)
            this.$emit('popFlag', 'serviceComponent', false)
        }
    },
    computed:{
        mailCount(){
            let count = 0;
            this.mailList.forEach(e => {
                if(!e.hasBeenRead){
                    count ++
                }
            });
            return count
        }
    }
}
</script>

<template>
    <div class="header_box">
        <header v-if="$store.state.titleName == 'index'">
            <div class="sidebar_icon" @click="sidebar">
                <i class="iconfont icon-daohang"></i>
                <!-- <i @click="showServer" v-track="`首页顶部栏位 客服`" class="iconfont icon-kefu"></i>
                <router-link v-track="`首页顶部栏位 站内信`" to="/mail" tag="i" class="iconfont icon-xin"></router-link>
                <span class="badge" v-show="mailCount">{{ mailCount }}</span> -->
            </div>
            <h1 class="logo" :style="{ backgroundImage: `url(${ require('img/logo.gif') })`}"></h1>
            <div class="service">
                <i @click="showServer" v-track="`首页顶部栏位 客服`" class="iconfont icon-kefu"></i>
                <!-- <router-link v-track="`首页顶部栏位 站内信`" to="/mail" tag="i" class="iconfont icon-xin"></router-link> -->
                <!-- <span class="badge" v-show="mailCount">{{ mailCount }}</span> -->
            </div>
            <!-- <ul v-if="!$store.state.isSignIn" class="user_status">
                <router-link v-track="`首页顶部栏位 登陆`" to='/sign_in' tag="li">登录</router-link>
                <router-link v-track="`首页顶部栏位 注册`" to='/sign_up' tag="li">注册</router-link>
            </ul>
            <ul v-else class="user_status">
                <li v-track="`首页顶部栏位 退出`" @click="signOut">退出</li>
            </ul> -->
        </header>
        <header v-else class="header_title">
            <i @click="back" class="left iconfont icon-arrow"></i>
            <span>{{ $store.state.titleName }}</span>
            <i></i>
        </header>
    </div>
</template>

<style lang="postcss">
    $headerHeight: 88px;
    .header_box{
        height: $headerHeight;
        background-color: #fff;
        position: fixed;
        will-change: transform;
        top: 0;
        width: 100%;
        z-index: 999;
        background: linear-gradient(#000, #222);
        color: #fff;
        header{
            display: flex;
            justify-content: space-between;
            .service,.sidebar_icon{
                width: 100px;
                line-height: $headerHeight;
                display: flex;
            }
            .service,.sidebar_icon{
                display: flex;
                justify-content: flex-end;
                padding: 0 4%;
                i{
                    height: $headerHeight;
                    font-size: 36px;
                    line-height: 95px;
                }
            }
            .sidebar_icon{
                justify-content: flex-start;
            }
            .logo{
                height: $headerHeight;
                width:32%;
                max-width: 240px;
                background-size: 90%;
                background-repeat: no-repeat;
                background-position: center center;
            }
            .user_status{
                flex-direction: row-reverse;
                li{
                    padding: 0 10px;
                    line-height: $headerHeight;
                    font-size:14px;
                    font-weight: bold;
                }
            }
        }
        .header_title{
            text-align: center;
            line-height: $headerHeight;
            font-size: 36px;
            i{
                width: 80px;
            }
            /* .icon-jiantouarrow487{
                text-align: center;
                color: #f79600;
                font-size: 30px;
                transform: scaleX(-1);
            } */
            .icon-arrow{
                text-align: center;
                color: #f79600;
                font-size: 40px;
            }
        }
    }
</style>

