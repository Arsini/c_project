<script>
export default {
    data(){
        return{
            sidebarList: [
                {
                    name: '优惠活动',
                    link: '/reward',
                    icon: 'icon-slice2',
                },
                {
                    name: '优惠券',
                    link: '/coupon',
                    icon: 'icon-youhuiquan2',
                },
                {
                    name: '签到礼金',
                    link: '/daycheckin',
                    icon: 'icon-lijin1',
                },
                {
                    name: '站内信',
                    link: '/mail',
                    icon: 'icon-zhanneixin',
                },
                {
                    name: 'VIP专区',
                    link: '/vip',
                    icon: 'icon-vip1',
                },
            ],
            left: 50,
            bg: 0.5,
            name: '',
            visible: false,
        }
    },
    created(){
        const user = all.tool.GetSession('user')
        if(user){
            this.name = user.name
        }
    },
    methods:{
        angentOpen(){
            window.open("https://www.baoyunlai-daili1.com",'_blank');
        },
        hideSidebar(){
            this.bg = 0
            if(this.left <= 50){
                this.left += 2.5
                window.requestAnimationFrame(this.hideSidebar);
            } else {
                this.visible  = false
            }
        },
        showSidebar(){
            this.visible = true
            this.bg = 0.5
            if(this.left >= 0){
                this.left -= 2.5
                window.requestAnimationFrame(this.showSidebar);
            }
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

        //
        sidebarState(flag){
            this.$store.commit('IS_SIDEBAR', flag)
        },
    },
    watch:{
        '$store.state.isSidebar'(){
            if(this.$store.state.isSidebar){
                this.showSidebar()
            } else {
                this.hideSidebar()
            }
        },
        '$store.state.isSignIn'(){
            if(this.$store.state.isSignIn){
                this.name = all.tool.GetSession('user').name
            }
        }
    }
}
</script>

<template>
    <div v-show="visible" class="sidebar" @click="sidebarState()" :style="{ 'background' : `rgba(0,0,0,${bg})`}">
        <div class="sidebar_box" :style="{ 'left' : `-${left}%`}">
            <div class="user_info">
                <div class="profile">
                    <img src="./img/profile.png">
                </div>
                <ul class="user_ac" v-show="$store.state.isSignIn">
                    <li class="user_ac_login">
                        <div class="user_ac_login_box">{{ name }}</div>
                        <div class="primary_text_color">
                            <i class="iconfont icon-qianqian-" v-show="$store.state.accountBalance != '加载中...'"></i>
                            <span>{{ $store.state.accountBalance }}</span>
                        </div>
                    </li>
                </ul>
                <router-link to="/sign_in" tag="ul" v-show="!$store.state.isSignIn" class="user_ac">
                    <li>登录/注册</li>
                </router-link>
            </div>
            <ul class="sidebar_list">
                <router-link 
                v-for="item in sidebarList" 
                :key="item.name" 
                :to="item.link" 
                tag="li">
                    <i class="iconfont primary_text_color" :class="item.icon"></i>
                    <span>{{ item.name }}</span>
                </router-link>
                <li @click="angentOpen">
                    <i class="iconfont icon-hezuo1 primary_text_color"></i>
                    <span>合作代理</span>
                </li>
            </ul>
            <div class="sign_out" @click="signOut" v-show="$store.state.isSignIn">
                <i class="iconfont icon-guanbi"></i>
                <span>安全退出</span>
            </div>
        </div>
    </div>
</template>

<style lang="postcss">
    .sidebar{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .sidebar_box{
            width: 50%;
            background-color: #1f1f1f;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            padding-top: 88px;
        }
        .user_info{
            background-image: url(./img/profile_bg.png);
            height: 160px;
            display: flex;
            background-size: cover;
        }
        .profile{
            width: 30%;
            display: flex;
            align-items: center;
            padding: 0 0 0 6%;
        }
        .user_ac{
            flex: 1;
            padding-left: 6%;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            i{
                font-size: 30px;
                position: relative;
            }
            span{
                font-size: 30px;
            }
            .user_ac_login{
                display: flex;
                flex-direction: column;
            }
            .user_ac_login_box{
                padding-bottom: 14px;
                font-size: 30px;
            }
        }
        .sidebar_list{
            padding-left: 8%;
            height: 100%;
            li{
                line-height: 82px;
                display: flex;
                i{
                    font-size: 36px;
                    padding-right: 8%;
                }
            }
        }
        .sign_out{
            height: 60px;
            margin-top: -400px;
            color: #ff3434;
            padding-left: 8%;
            font-size: 28px;
            i{
                font-size: 32px;
                padding-right: 4%;
            }
        }
        
    }
</style>

