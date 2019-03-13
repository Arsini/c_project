<script>
export default {
    data(){
        return{
            rules: {
                phoneNumber: {
                    required: '请输入新电话号码',
                },
                smsCode: {
                    required: '请输入验证码',
                }
            },
            form:{
                phoneNumber: '',
                smsCode: '',
            },
            smsCodeBtName: '获取验证码', 
            sec: 59,
            timer: '',

            visibleAccount: false,
            playerData:'',
        }
    },
    methods:{
        /* API */
        _createDemoPlayer: data => all.net.send({
            service: 'player',
            functionName: 'createDemoPlayer',
            data,
        }),
        
        closeFreePlay(){
            this.$emit('popFlag', 'isFreePlay', false)
        },
        service24(){
            all.tool.service24()
        },
        SMSCode(){
            if(this.smsCodeBtName == '获取验证码') {
                const flag = this.$refs.phoneNumber.validate();
                if(!flag && !all.tool.isUndefined(flag)){
                    return
                }
                const obj = {
                    phoneNumber:this.form.phoneNumber,
                    purpose: 'demoPlayer'
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
        onSubmit(){
            if(all.tool.validateForm(this)){
                this._createDemoPlayer(this.form).then(res=>{
                    const data = res.data.playerData;
                    this.playerData = {
                        name: data.name,
                        password: data.password,
                        playerId: data.playerId,
                        token: res.data.token,
                    }
                    this.visibleAccount = true
                })
            }
        },

        //
        autoLogin(){
            const playerId = this.playerData.playerId;
            const token = this.playerData.token;
            this.$api.authenticate({ playerId, token }).then(res=>{
                this.$api.get({playerId}).then(res=>{
                    const name = res.data.name
                    all.tool.SetSession('user',res.data)
                    all.tool.SetSession('token',token)
                    all.tool.SetSession('playerId',playerId)
                    this.$store.commit('IS_SIGN_IN', true)//登陆
                    this.$router.push('/')
                    this.closeFreePlay()
                    this.msg('恭喜您，登录成功。', 'success')
                })
            })
        },
    },
}
</script>

<template>
    <div class="free_play">
        <div class="form_box">
            <form v-if="!visibleAccount" class="white_form">
                <FormItem
                icon='icon-shouji'
                :rule='rules.phoneNumber'
                placeholder='电话号码'
                ref='phoneNumber'
                v-model="form.phoneNumber"/>
                <div class="captcha_box clearfix">
                    <div class="sms_box fl">
                        <FormItem
                        icon='icon-yanzhengma1'
                        :rule='rules.smsCode'
                        placeholder='请输入验证码'
                        ref='smsCode'
                        v-model="form.smsCode"/>
                        <p @click='service24' class="primary_text_color pointer service24">收不到验证码?</p>
                    </div>
                    <div @click="SMSCode" class="fr get_sms primary_text_color pointer">{{ smsCodeBtName }}</div>
                </div>
                <div class="btn_center btn_dialog">
                    <button @click.prevent="onSubmit" class="btn btn_secondary">确定</button>
                </div>
            </form>
            <div v-else>
                <div class="clearfix">
                    <label class="fl">您的试玩账号：</label>
                    <p>{{ playerData.name }}</p>
                </div>
                <div class="clearfix">
                    <label class="fl">您的试玩密码：</label>
                    <p>{{ playerData.password }}</p>
                </div>
                <div class="btn_center">
                    <button @click="autoLogin" class="btn btn_secondary">立即登陆</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="postcss">
    .free_play{
        padding-top: 20px;
        height: 95vh;
        background-image: url(~pages/sign_in/img/bg.jpg);
        background-size: cover;
        color: #000;
        .form_box{
            margin: 0 auto;
            width: 90%;
            background-color: #fff;
            padding: .4rem 20px 0 20px;
            border-radius: 4px;
        }
        .btn_disabled{
            line-height: 42px;
        }
        .btn{
            width: 100%;
            margin: 0;
        }
        .sign_fn{
            display: flex;
            justify-content: space-between;
            color: #000;
        }
        .forget{
            text-align: right;
            margin-bottom: 18px;
            display: flex;
            justify-content: flex-end;
            P{
                margin-left: 10px;
            }
        }
        .logo{
            width: 120px;
            margin: 0 auto;
            display: block;
        }
    }
</style>

