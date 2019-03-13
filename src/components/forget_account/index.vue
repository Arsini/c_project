<script>
export default {
    data(){
        return{
            form: {
                phoneNumber: '',
                smsCode: '',
            },
            rules: {
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

            list: [],
            resetUser: {
                name: '',
                code: '',
            },

            title: '找回账号',

            resetPasswordObj: '',
        }
    },
    methods: {
        /* api */
        _inquireAccountByPhoneNumber: data => all.net.send({
            service: 'player',
            functionName: 'inquireAccountByPhoneNumber',
            data,
        }),
        
        close(){
            this.$emit('popFlag', 'isForgetAccount', false)
        },
        SMSCode(){
            const phoneNumber = this.$refs.phoneNumber.validate();
            if(all.tool.isUndefined(phoneNumber) && this.smsCodeBtName == '获取验证码'){
                const data = {
                    phoneNumber: this.form.phoneNumber,
                    purpose: "inquireAccount",
                }
                this.smsCodeBtName = '正在发送...'
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
            this.smsCodeBtName = '已发送(60)'
            this.timer = setInterval(()=>{
                this.smsCodeBtName = '已发送('+ this.sec +')'
                this.sec --
                if(this.sec <= 0) {
                    clearInterval(this.timer)
                    this.sec = 59
                    this.smsCodeBtName = '获取验证码'
                }
            },1000)
        },

        onSubmit(){
            if(all.tool.validateForm(this)){
                this._inquireAccountByPhoneNumber(this.form).then(res=>{
                    const arr = res.data.list;
                    const list = [];
                    arr.forEach(e => {
                        list.push({
                            name: e.name,
                            id: e.name,
                        })
                    });
                    this.list = list;
                    this.resetUser.code = res.data.code
                    this.title = '账号查询'
                    if(list.length == 1){
                        this.resetUser.name = arr[0].name
                    }
                })
            }
        },

        resetPassword(){
            this.$api.resetPassword(this.resetUser).then(res=>{
                this.list = []
                this.title = '重置密码成功'
                this.resetPasswordObj = res.data
            })
        },

        service24(){
            all.tool.service24()
        }
    },
}
</script>

<template>
    <Dialog
    :title='title'
    :visible='true'
    @close='close'>
        <form slot="body" class="white_form" v-if="!resetPasswordObj && list.length == 0">
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
                <p @click="service24" class="primary_text_color pointer service24">收不到?</p>
            </div>
            <div class="btn_center">
                <button @click.prevent='onSubmit' class="btn btn_primary">提交</button>
            </div>
        </form>
        <form v-show="list.length > 0" slot="body" class="white_form">
            <FormSelect
            v-model="resetUser.name"
            placeholder="请选择账号"
            :options='list'/>
            <div class="btn_center">
                <button @click.prevent='resetPassword' class="btn btn_primary">提交</button>
            </div>
        </form>

        <div v-show='resetPasswordObj' slot="body" class="forget_account">
            <p>用户名：{{ resetPasswordObj.name }}</p>
            <p>密码已重新设置为： {{ resetPasswordObj.password }}</p>
            <p>请尽快登入修改密码，祝你游戏愉快！</p>
        </div>
    </Dialog>
</template>

<style lang="postcss">
    .forget_account{
        line-height: 30px;
        padding-bottom: 10px;
    }
</style>

