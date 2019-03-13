<script>
export default {
    data(){
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
        return{
            captcha: '',
            form:{
                phoneNumber: '',
                captcha: '',
                randomNumber: '',
                lineId: 5566,
            },
            rules:{
                phoneNumber: {
                    required: '请输入电话号码',
                    validator: validatePhoneNumber,
                },
                captcha: {
                    required: '请输入验证码',
                }
            },
        }
    },
    created(){
        this.changeCaptcha()
    },
    methods:{
        /* API */
        _getOMCaptcha: data => all.net.send({
            service: 'player',
            functionName: 'getOMCaptcha',
            data,
        }),

        _callBackToUser: data => all.net.send({
            service: 'player',
            functionName: 'callBackToUser',
            data,
        }),
        
        sendPhone() {
            if(all.tool.validateForm(this)){
                this._callBackToUser(this.form).then(res=>{
                    this.msg('正在呼叫，请稍后', 'success')
                    this.closePhone()
                },err=>{
                    this.msg('呼叫失败。', 'error')
                })
            }
        },
        changeCaptcha() {
            this._getOMCaptcha().then(res=>{
                this.captcha = res.data.b64ImgDataUrl
                this.form.randomNumber = res.data.randomNumber
            })
        },
        closePhone(){
            this.$emit('popFlag', 'showPhone', false)
        }
    }
}
</script>

<template>
    <Dialog
    class="callback_to_user"
    title='电话回拨' 
    :visible='true' 
    @close="closePhone">
        <form slot="body" class="white_form">
            <FormItem
            icon='icon-shouji'
            :rule='rules.phoneNumber'
            placeholder='电话号码'
            ref='phoneNumber'
            v-model="form.phoneNumber"/>
            <div class="captcha_box clearfix">
                <FormItem
                icon='icon-yanzhengma1'
                :rule='rules.captcha'
                placeholder='请输入验证码'
                ref='captcha'
                v-model="form.captcha"/>
                <img @click='changeCaptcha' :src="captcha" width="140" height="42">
            </div>
            <div class="btn_center">
                <button @click.prevent="sendPhone" class="btn btn_primary">确认</button>
            </div>
        </form>
    </Dialog>
</template>

