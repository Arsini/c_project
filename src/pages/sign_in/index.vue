<script>
import Captcha from 'components/captcha';
export default {
    components:{
        Captcha,
    },
    data(){
        /**
         * 用户名
         */
        const validateName = (val, cb) => {
            const max = this.config.accountMaxLength;
			const min = this.config.accountMinLength;
            if( val.length < min ){
                cb('帐号不能少于'+ min +'个字符')
				return false
            } else if(val.length > max){
                cb('帐号不能大于'+ max +'个字符')
				return false
            }
        }
        return{
            form: {
                name: '',
                password: '',
                captcha: '',
                clientDomain: '',
            },
            rules: {
                name: {
                    required: '请输入帐号',
                    validator: validateName,
                },
                password: {
                    required: '请输入密码',
                },
                captcha: {
                    required: '请输入密xx码',
                },
            },
            config: '',
            captcha: '',
            captchaType: '1',
            btnStatus: true,

            rememberMe: false,
        }
    },
    created(){
        this.form.clientDomain = document.domain
        const { 
            accountMaxLength,
            accountMinLength,
            needImageCodeForLogin,
        } = all.tool.GetLocal('getConfig');
        const account = all.tool.GetLocal('account');
        if(account){
            this.form.name = account
            this.rememberMe = true
        }
        this.config = {
            accountMaxLength,
            accountMinLength,
        }
        if(needImageCodeForLogin == '0'){
            this.captchaType = '0'
        }
        this.$emit('popFlag', 'serviceComponent', false)
    },
    methods:{
        //api
        _login: data => all.net.send({
            service: 'player',
            functionName: 'login',
            data,
        }),
        
        //登录
        signIn() {
            if(all.tool.validateForm(this)){
                this.btnStatus = false
                this._login(this.form).then(res=>{
                    
                    this.$store.dispatch('GET_CREDIT_DETAIL')//获取账户余额
                    this.$store.commit('IS_SIGN_IN', true)//登陆

                    /* 用户信息写入缓存 */
                    all.tool.SetSession('user',res.data)
                    all.tool.SetSession('token',res.token)
                    all.tool.SetSession('playerId',res.data.playerId)
                    if(this.rememberMe){
                        all.tool.SetLocal('account', this.form.name)
                    } else {
                        all.tool.RemoveLocal('account')
                    }
                    const beforeSign = all.tool.GetSession('beforeSign');
                    if(beforeSign != '/sign_in'){
                        this.$router.replace({ path: beforeSign })
                    } else {
                        this.$router.push('/')
                    }
                    
                    this.msg('登陆成功', 'success')
                },err=>{
                    this.$refs.captcha.getCaptcha()
                    if(err.data.noOfAttempt > 2){
                        this.captchaType = 1
                    }
                    this.btnStatus = true
                })
            }
        },
        openForget(name){
            this.$emit('popFlag', name, true)
        },
    },
}
</script>

<template>
    <div class="sign_in wrap">
        <img src="./img/login_logo.png" class="logo">
        <div class="form_box">
            <form autocomplete="off" class="white_form">
                <FormItem
                icon='icon-zhanghu'
                :rule='rules.name'
                placeholder='请输入账号'
                ref='name'
                v-model="form.name"/>
                <FormItem
                icon='icon-mima1'
                :rule='rules.password'
                placeholder='请输入密码'
                ref='password'
                v-model="form.password"
                type='password'/>
                <Captcha
                :type='captchaType'
                v-model="form.captcha"
                ref='captcha'/>
                <div class="sign_fn">
                    <label
                    class="pointer"
                    for="r">
                        <input
                        id="r"
                        class="checkbox"
                        type="checkbox"
                        v-model="rememberMe">
                        <span>记住账号</span>
                    </label>
                    <div class="forget">
                        <p @click="openForget('isForgetAccount')">忘记账号？</p>
                        <p @click="openForget('isForgetPassword')">忘记密码？</p>
                    </div>
                </div>
                <button v-if="btnStatus" @click.prevent="signIn" class="btn btn_secondary">登陆</button>
                <div v-else class="btn btn_disabled">正在登陆...</div>
            </form>
            <div class="btn_center" v-track="`登录 注册`">
                <router-link to='/sign_up' tag="button" class="btn btn_primary">立即注册</router-link>
            </div>
        </div>
    </div>
</template>

<style lang="postcss">
    .sign_in{
        padding-top: 10px;
        height: 95vh;
        background-image: url(./img/bg.jpg);
        background-size: cover;
        .form_box{
            margin: 0 auto;
            width: 92%;
            background-color: #fff;
            padding: .4rem 4% 0 4%;
            border-radius: 10px;
        }
        .btn{
            width: 100%;
            margin: 0;
        }
        .sign_fn{
            display: flex;
            justify-content: space-between;
            color: #000;
            padding: 18px 0;
            span{
                font-size: 26px;
                line-height: 36px;
            }
        }
        .forget{
            text-align: right;
            display: flex;
            justify-content: flex-end;
            P{
                margin-left: .1rem;
                font-size: 28px;
                line-height: 42px;
            }
        }
        .logo{
            width: 30%;
            margin: 0 auto;
            display: block;
        }
    }    
</style>
