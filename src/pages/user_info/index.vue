<script>
import UserNotice from './user_notice'
export default {
    components:{
        UserNotice,
    },
    data(){
        return{
            userData: '',
        }
    },
    created(){
        const {
            name,
            bankAccountName,
            playerId,
            phoneNumber,
            playerLevel,
        } = all.tool.GetSession('user');
        this.userData = {
            name,
            bankAccountName,
            playerId,
            phoneNumber,
            playerLevel: playerLevel.name,
        }
    }
}
</script>

<template>
    <div class="user_info wrap">
        <ul class="user_data">
            <li>
                <label>
                    <i class="iconfont icon-zhanghu1"></i>
                    <span>会员账号</span>
                </label>
                <p>{{ userData.name }}</p>
            </li>
            <li>
                <label>
                    <i class="iconfont icon-zhanghu1"></i>
                    <span>真实姓名</span>
                </label>
                <p>{{ userData.bankAccountName }}</p>
            </li>
            <li>
                <label>
                    <i class="iconfont icon-dengji"></i>
                    <span>会员等级</span>
                </label>
                <p>{{ userData.playerLevel }}</p>
            </li>
            <li>
                <label>
                    <i class="iconfont icon-ID"></i>
                    <span>会员 ID</span>
                </label>
                <p>{{ userData.playerId }}</p>
            </li>
            <li>
                <label>
                    <i class="iconfont icon-shouji"></i>
                    <span>手机号码</span>
                </label>
                <p>{{ userData.phoneNumber }}</p>
            </li>
        </ul>
        <!-- <h4 class="user_notice_title">短信通知设定</h4> -->
        <UserNotice/>
    </div>
</template>

<style lang="postcss">
    .user_info{
        padding-top: 20px;
        .user_data{
            padding-bottom: 20px;
            li{
                line-height: 80px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #333;
                margin-bottom: 20px;
                label{
                    display: flex;
                }
                .iconfont{
                    color: #666;
                    font-size: 40px;
                    padding-right: 16px;
                }
                p{
                    line-height: 80px;
                }
            }
        }
    }
</style>
