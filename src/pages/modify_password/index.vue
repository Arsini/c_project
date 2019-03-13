<script>
import changePassword from "./change_password";
import changePasswordGame from "./change_password_game";
export default {
    components:{
        changePassword,
        changePasswordGame
    },
    data(){
        return{
            current: '',
            nav: [
                '游戏账号',
                'PT手机',
                'DT手机',
            ],
        }
    },
    created(){
        this.select('游戏账号')
    },
    methods:{
        select(name){
            this.current = name
        }
    },
}
</script>

<template>
    <div class="modify_password">
        <ul class="tab">
            <li 
            v-for='item in nav' 
            :key="item"
            @click="select(item)"
            :class="{ 'current': item == current}">{{ item }}</li>
        </ul>
        <changePassword v-show="current == '游戏账号'" />
        <changePasswordGame v-show="current == 'PT手机'" :providerId='18' key="1"/>
        <changePasswordGame v-show="current == 'DT手机'" :providerId='45' key="2"/>
    </div>
</template>

<style lang="postcss">
    .modify_password{
        background-image: url(~img/form_bg.jpg);
        background-repeat: no-repeat;
        background-position-y: 80px;
        .tab{
            margin-bottom: 20px;
        }
        form{
            width: 90%;
            margin: 0 auto;
            padding-top: 30px;
            background-color: #fff;
            border-radius: 4px;
        }
    }
</style>

