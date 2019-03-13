<script>
export default {
    props:[
        'type',// '0'(不需要验证码)；'1'(图片验证码)；'2'（短信验证码）;
        'name',
        'phoneNumber',
    ],
    data(){
        const accountPrefix = all.tool.GetLocal('getConfig').accountPrefix;
        return{
            captcha: '',
            form: {
                captcha: '',
            },
            rules: {
                captcha:{
                    required: '请输入验证码'
                }
            },
            accountPrefix,

            smsCodeBtName: '获取验证码', 
            sec: 59,
            timer: '',
        }
    },
    created(){
        if(this.type == '1'){
            this.getCaptcha()
        }
    },
    methods:{
        //api
        _captcha: data => all.net.send({
            service: 'player',
            functionName: 'captcha',
            data,
        }),

        getCaptcha(){
            this._captcha().then(res=>{
                this.captcha = all.tool.arrayBufferToBase64(res.data.data)
            })
        },
        validate(){
            if(this.type != '0'){
                return this.$refs.captcha.validate()
            }
        },
        service24(){
            all.tool.service24()
        },
        SMSCode(){
            if(this.smsCodeBtName == '获取验证码') {
                if(!this.name || !this.phoneNumber){
                    this.msg('请输入账户和手机号码')
                    return
                }
                const obj = {
                    phoneNumber:this.phoneNumber,
                    name: this.accountPrefix + this.name,
                    purpose: 'registration'
                }
                this.smsCodeBtName = '正在发送...'
                this.$api.getSMSCode(obj).then(res=>{
                    this.countdown()
                    this.msg('验证码发送成功', 'success')
                },err=>{
                    this.smsCodeBtName = '获取验证码'
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
    },
    model: {
        prop:'value',
        event: 'evt'
    },
    watch:{
        'form.captcha'(){
            this.$emit('evt', this.form.captcha)
        }
    },
}
</script>

<template>
    <div v-show="type != 0" class="captcha_box clearfix">
        <!-- 图片验证码 -->
        <div v-if="type == 1">
            <FormItem
            icon='icon-yanzhengma1'
            :rule='rules.captcha'
            placeholder='请输入验证码'
            ref='captcha'
            type='tel'
            v-model="form.captcha"/>
            <img @click="getCaptcha" class="captcha_img" :src="captcha">
            <i  @click="getCaptcha" class="iconfont icon-shuaxin primary_text_color"></i>
        </div>
        <!-- 短信验证码 -->
        <div v-if="type == 2" class="sms_box">
            <FormItem
            icon='icon-yanzhengma1'
            :rule='rules.captcha'
            placeholder='验证码'
            ref='captcha'
            type='tel'
            v-model="form.captcha"/>
            <p @click='service24' class="primary_text_color service24">收不到?</p>
        </div>
        <div v-if="type == 2" @click="SMSCode" class="get_sms primary_text_color border_btn_hover">{{ smsCodeBtName }}</div>
    </div>
</template>


