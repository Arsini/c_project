<script>
import logo from 'img/logo.gif';
import Captcha from 'components/captcha';
export default {
    components:{
        Captcha,
    },
    data(){
        //用户名
        const validateName = (val, cb) => {
            const max = this.config.accountMaxLength;
            const min = this.config.accountMinLength;
            const accountPrefix = this.config.accountPrefix;
            const prefixLength = accountPrefix.length;
            if( val.length + prefixLength < min ){
                cb('帐号含'+ accountPrefix +'不能少于'+ min +'个字符')
				return false
            } else if(val.length + prefixLength > max){
                cb('帐号含'+ accountPrefix +'不能大于'+ max +'个字符')
				return false
            } else if(all.tool.specialWord(val)){
                cb('不可以输入特殊字符')
                return false
            } else if(all.tool.isChinese(val)) {
                cb('不可以输入中文')
                return false
            } else {
                this.isValidUsername({ name: accountPrefix + this.form.name }).then(res=>{
                    cb() 
                },err=>{
                    cb(err.errorMessage)
                    return false
                })
            }
        }
        //玩家密码
        const validatePassWord = (val, cb) => {
            const max = this.config.passwordMaxLength;
            const min = this.config.passwordMinLength;
            if(!all.tool.abc123(val)){
                cb('只能是数字或字母')
                return false
            } else if(val.length < min){
                cb('密码不能少于'+ min +'个字符')
				return false
            } else if(val.length > max){
                cb('密码不能大于'+ max +'个字符')
				return false
            } else {
                cb()
            }
        }
        //确认玩家密码
        const validatePass = (value, callback) => {
            if(this.form.repassword != this.form.password){
                callback('必须与密码一致')
                return false
            }else if(this.form.repassword == this.form.password){
                callback()
            }else {
                callback('未知错误请联系客服。')
                return false
            }
        }
        //验证手机
        const validatePhoneNumber = (value, callback) => {
            if( !all.tool.isPhoneNum(value) ) {
                callback('请输入正确的手机号码')
                return false
            }else if(value.length != 11) {
                callback('手机号码必为等于11位')
                return false
            }else {
                callback()
            }
        }

        //validateQQ
        const validateQQ = (value, callback) => {
            if( all.tool.isNumber(value) || value == '') {
                callback()
            }else {
                callback('请输入数字')
                return false
            }
        }
        const domain = document.domain
        return{
            logo,
            config: '',
            form: {
                name: '',
                password: '',
                repassword: '',
                phoneNumber: '',
                qq: '',
                captcha: '',
                domain,
            },
            rules: {
                name: {
                    required: '请输入帐号',
                    validator: validateName,
                },
                password: {
                    required: '请输入密码',
                    validator: validatePassWord,
                },
                repassword: {
                    required: '请重复输入密码',
                    validator: validatePass,
                },
                phoneNumber: {
                    required: '请输入手机号码',
                    validator: validatePhoneNumber,
                },
                qq: {
                    validator: validateQQ,
                },
                captcha: {
                    required: '请输入验证码'
                }
            },
            captchaType:'1',
            btnStatus: true,
            partnerId: '',
            partnerName: '',
        }
    },
    created(){
        const {
            accountPrefix,
            accountMaxLength,
            accountMinLength,
            passwordMaxLength,
            passwordMinLength,
            needSMSForRegister,
        } = all.tool.GetLocal('getConfig');
        this.config = {
            accountPrefix,
            accountMaxLength,
            accountMinLength,
            passwordMaxLength,
            passwordMinLength,
        }
        if(needSMSForRegister != '0'){
            this.captchaType = '2'
        }
        this.agentLink()//推广链接 新 & 旧
        this.$emit('popFlag', 'serviceComponent', false)
    },
    methods:{
        //api
        isValidUsername: data => all.net.send({
            service: 'player',
            functionName: 'isValidUsername',
            data,
        }),
        create: data => all.net.send({
            service: 'player',
            functionName: 'create',
            data,
        }),
        //推广链接 新 & 旧
        agentLink(){
            const url = location.search;
            const ac = sessionStorage.getItem('ac');
			if(url){
				this.partnerId = url.slice(1)
			}
			if(ac){
				const str = ac.replace('/','');
				const data = str.replace('.do','');
				const arr = data.split('/')
				let partnerName = ''
				arr.forEach(val => {
					partnerName += val
				})
				this.partnerName = partnerName
			}
        },
        
        //注册
        onsubmit(){
            if(all.tool.validateForm(this)){
                this.btnStatus = false
                const { name, password, phoneNumber, captcha, qq, domain } = this.form;
                const obj = {
                    name: this.config.accountPrefix + name,
                    password,
                    phoneNumber,
                    domain,
                }
                //图片 or 短信 验证码
                if(this.captchaType == '1'){
                    obj.captcha = captcha
                } else {
                    obj.smsCode = captcha
                }
                //推广ID
                if(this.partnerId){ obj.partnerId = this.partnerId }
                //推广用户名
                if(this.partnerName){ obj.partnerName = this.partnerName}
                //是否有QQ
                if(qq){ obj.qq = qq }
                //注册来源（跳转域名）
                if(document.referrer){ obj.sourceUrl = document.referrer }
                this.create(obj).then(res=>{
                    const user = res.data;
                    this.$store.commit('IS_SIGN_IN', true)//登陆
                    /* 用户信息写入缓存 */
                    all.tool.SetSession('user',user)
                    all.tool.SetSession('token',res.token)
                    all.tool.SetSession('playerId',res.data.playerId)
                    this.$router.push('/recharge_guide')
                    this.msg('注册成功，已自动登陆', 'success')
                },err=>{
                    this.$refs.captcha.getCaptcha()
                    this.btnStatus = true
                })
            }
        },
    }
}
</script>


<template>
    <div class="sign_up wrap">
        <form autocomplete="off" class="white_form">
            <div class="user_name">
                <span>n</span>
                <FormItem
                icon='icon-zhanghu'
                :rule='rules.name'
                placeholder='请输入账号(必填)'
                ref='name'
                v-model="form.name"/>
            </div>
            <FormItem
            icon='icon-mima1'
            :rule='rules.password'
            placeholder='请输入密码(必填)'
            ref='password'
            v-model="form.password"
            type='password'/>
            <FormItem
            icon='icon-mima1'
            :rule='rules.repassword'
            placeholder='请确认密码(必填)'
            ref='repassword'
            v-model="form.repassword"
            type='password'/>
            <FormItem
            icon='icon-shouji'
            :rule='rules.phoneNumber'
            placeholder='请输入手机号码(必填)'
            ref='phoneNumber'
            v-model="form.phoneNumber"/>
            <FormItem
            icon='icon-qq-copy'
            :rule='rules.qq'
            placeholder='请输入QQ号码'
            ref='qq'
            v-model="form.qq"/>
            <Captcha
            :type='captchaType'
            :phoneNumber='form.phoneNumber'
            :name='form.name'
            v-model="form.captcha"
            ref='captcha'/>
            <div class="btn_center">
                <button v-if="btnStatus" @click.prevent="onsubmit" class="btn btn_secondary">确认注册</button>
                <div v-else class="btn btn_disabled">正在注册...</div>
            </div>
        </form>
    </div>
</template>

<style lang="postcss">
    .sign_up{
        padding-top: 10px;
        height: 95vh;
        background-image: url(../sign_in/img/bg.jpg);
        background-size: cover;
        .user_name{
            position: relative;
            span {
                position: absolute;
                z-index: 1;
                display: block;
                top: 40px;
                left: 70px;
                line-height: 0;
                color: #000;
            }
            input{
                padding-left: 88px;
            }
        }
        .btn_disabled{
            line-height: 42px;
        }
        .btn{
            width: 100%;
            margin: 0;
        }
        form{
            margin: 0 auto;
            width: 82%;
            padding: .4rem 20px 0 20px;
            border-radius: 4px;
            background-color: #fff;
        }
    }
</style>

