<script>
import Secret from './secret'
export default {
    components:{
        Secret,
    },
    data(){
        return {
            title: '找回密码',
            form: {
                name: '',
                phoneNumber: '',
                smsCode: '',
            },
            rules: {
                name: {
                    required: '请输入用户名',
                },
                phoneNumber: {
                    required: '请输入手机号码',
                },
                smsCode: {
                    required: '请输入手机号码',
                },
            },

            sec: 59,
			timer: '',
            smsCodeBtName: '获取验证码',

            resetPasswordObj: '',

            secret: false,
        }
    },
    methods: {
        close(){
            this.$emit('popFlag', 'isForgetPassword', false)
        },
        SMSCode(){
            const name = this.$refs.name.validate();
            const phoneNumber = this.$refs.phoneNumber.validate()
            if(all.tool.isUndefined(name) && all.tool.isUndefined(phoneNumber) && this.smsCodeBtName == '获取验证码'){
                this.smsCodeBtName = '正在发送...'
                const data = {
                    phoneNumber: this.form.phoneNumber,
                    name: this.form.name,
                    purpose: "resetPassword",
                };
                this.$api.getSMSCode(data).then(res=>{
                    this.countdown()
                    this.msg('已发送等待60秒后可重新发送','success')
                },err => {
                    this.smsCodeBtName = '获取验证码'
                })
            }
        },
        //倒计时
        countdown() {
            this.smsCodeBtName = '已发送（60）'
            this.timer = setInterval(()=>{
                this.smsCodeBtName = '已发送（'+ this.sec +'）'
                this.sec --
                if(this.sec <= 0) {
                    clearInterval(this.timer)
                    this.sec = 59
                    this.smsCodeBtName = '获得验证码'
                }
            },1000)
        },

        //重置
        onSubmit(){
            this.$api.resetPassword(this.form).then(res=>{
                this.title = '重置密码成功'
                this.resetPasswordObj = res.data
            })
        },

        Q_A(){
            this.secret = true
        },

        secretReset(data){
            this.secret  = false
            this.resetPasswordObj = data
            this.title = '重置密码成功'
        },
    }
}
</script>

<template>
    <Dialog
    :title='title'
    :visible='true'
    @close='close'>
        <form slot="body" class="white_form" v-if="!resetPasswordObj && !secret">
            <FormItem
            icon='icon-zhanghu'
            :rule='rules.name'
            placeholder='请输入用户名(必填)'
            ref='name'
            v-model="form.name"/>
            <FormItem
            icon='icon-shouji'
            :rule='rules.phoneNumber'
            placeholder='请输入手机号码(必填)'
            ref='phoneNumber'
            v-model="form.phoneNumber"/>
            <div class="captcha_box clearfix">
                <FormItem
                icon='icon-yanzhengma1'
                :rule='rules.smsCode'
                placeholder='验证码'
                ref='smsCode'
                v-model="form.smsCode"/>
                <div @click="SMSCode" class="primary_text_color pointer get_sms">{{ smsCodeBtName }}</div>
                <p @click="Q_A" class="primary_text_color pointer service24">收不到验证码?</p>
            </div>
            <div class="btn_center">
                <button @click.prevent='onSubmit' class="btn btn_primary">重置密码</button>
            </div>
        </form>
        <div v-show='resetPasswordObj' slot="body" class="forget_password">
            <p>用户名：{{ resetPasswordObj.name }}</p>
            <p>密码已重新设置为： {{ resetPasswordObj.password }}</p>
            <p>请尽快登入修改密码，祝你游戏愉快！</p>
        </div>
        <Secret v-if="secret" slot="body" @secretReset='secretReset'/>
    </Dialog>
</template>

<style lang="postcss">
    .forget_password{
        line-height: 30px;
        padding-bottom: 10px;
    }
</style>
