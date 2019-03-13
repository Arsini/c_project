<script>
export default {
    data(){
        const validateOldPhoneNumber = (val, cb) => {
            if(!all.tool.isNumber(val)){
                let temp = /[^0-9]/g;
                this.form.oldPhoneNumber = this.form.oldPhoneNumber.replace(temp, "")
                cb(' ')
                return false
            } else {
                cb()
            }
        }
        const validatePhoneNumber = (val, cb) => {
            if(!all.tool.isNumber(val)){
                let temp = /[^0-9]/g;
                this.form.phoneNumber = this.form.phoneNumber.replace(temp, "")
                cb(' ')
                return false
            } else {
                cb()
            }
        }
        return{
            phoneBtnName: '提交',
            smsCodeBtName: '获取验证码',
            rules: {
                oldPhoneNumber: {
                    required: '请输入旧电话号码',
                    validator: validateOldPhoneNumber,
                },
                phoneNumber: {
                    required: '请输入新电话号码',
                    validator: validatePhoneNumber,
                },
                smsCode: {
                    required: '请输入验证码',
                }
            },
            form:{
                oldPhoneNumber: '',
                phoneNumber: '',
                smsCode: '',
                playerId: '',
                purpose:'newPhoneNumber',
            },
            sec: 59,
			timer: '',
        }
    },
    created(){
        this.form.playerId = all.tool.GetSession('playerId')
    },
    methods:{
        /* api */
        _updatePhoneNumberWithSMS: data => all.net.send({
            service: 'player',
            functionName: 'updatePhoneNumberWithSMS',
            data,
        }),
        
        service24(){
            all.tool.service24()
        },

        //获取短信验证码
        getSMSCode() {
            const oldPhoneNumber = this.$refs['oldPhoneNumber'].validate();
            const phoneNumber = this.$refs['phoneNumber'].validate();
            if(this.smsCodeBtName == '获取验证码' && all.tool.isUndefined(oldPhoneNumber) && all.tool.isUndefined(phoneNumber)){
                this.smsCodeBtName = '正在发送...'
                this.$api.getSMSCode(this.form).then(res=>{
                    this.countdown()
                    this.msg('已发送等待60秒后可重新发送','success')
                },err=>{
                    this.smsCodeBtName = '获取验证码'
                    if(err.status === 406){
                        this.msg('新号码为无效手机号码', 'error')
                    }
                })
            }
        },
        //倒计时
        countdown() {
            this.smsCodeBtName = '已发送(59)'
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
                const data = {
                    smsCode: this.form.smsCode,
                    playerId: this.form.playerId,
                }
                this._updatePhoneNumberWithSMS(data).then(res=>{
                    const obj = all.tool.GetSession('user');
                    const newPhone = this.form.phoneNumber.slice(0,3) + '******' + this.form.phoneNumber.slice(7,11);
                    obj.phoneNumber = newPhone;
                    all.tool.SetSession('user', obj)
                    this.smsCodeBtName = '获取验证码'
                    this.form.smsCode = ''
                    this.form.phoneNumber = ''
                    this.form.oldPhoneNumber = ''
                    clearInterval(this.timer)
                    this.msg('更新成功。', 'success')
                })
            }
        }
    }
}
</script>

<template>
    <div class="modify_phone">
        <form class="wrap white_form">
            <FormItem
            icon='icon-shouji'
            :rule='rules.oldPhoneNumber'
            :placeholder='`旧号码`'
            ref='oldPhoneNumber'
            type='tel'
            v-model="form.oldPhoneNumber"/>
            <FormItem
            icon='icon-shouji'
            :rule='rules.phoneNumber'
            :placeholder='`新号码`'
            ref='phoneNumber'
            type='tel'
            v-model="form.phoneNumber"/>
            <div class="captcha_zoom clearfix">
                <div class="sms_box">
                    <FormItem
                    icon='icon-yanzhengma1'
                    :rule='rules.smsCode'
                    placeholder='验证码'
                    ref='smsCode'
                    type='tel'
                    v-model="form.smsCode"/>
                    <p @click='service24' class="primary_text_color service24">收不到?</p>
                </div>
                <div @click="getSMSCode" class="fr btn btn_primary get_sms">{{ smsCodeBtName }}</div>
            </div>
            <div class="btn_center">
                <button @click.prevent="onSubmit" class="btn btn_secondary">{{ phoneBtnName }}</button>
            </div>  
        </form>
    </div>
</template>

<style lang="postcss">
    .modify_phone{
        background-image: url(~img/form_bg.jpg);
        background-repeat: no-repeat;
        padding-top: 10px;
        .captcha_zoom{
            display: flex;
            justify-content: space-between;
        }
        .sms_box{
            position: relative;
            flex: 1;
        }
        .service24{
            position: absolute;
            top: 0;
            right: 0;
            line-height: 80px;
        }
        .get_sms{
            height: 80px;
            width: 190px;
            margin-right: 0;
            text-align: center;
        }
        form{
            width: 90%;
            margin: 0 auto;
            padding-top: .5rem;
            background-color: #fff;
            border-radius: 4px;
            margin-top: 3vh;
        }
    }
</style>

