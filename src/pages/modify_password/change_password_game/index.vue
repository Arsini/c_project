<script>
export default {
    props: [
        'providerId',
        'title',
    ],
    data(){
        //玩家密码
        const validatePassWord = (value, callback) => {
            if(!all.tool.abc123(value)){
                callback('只能是数字或字母')
                return false
            }else {
                callback()
            }
        }
        /**
         * 密码一致性
         */
        const validatePass = (value, callback) => {
            if (value === '') {
                callback('请输入重复密码')
                return false
            } else if(value === this.form.newPassword){
                callback()
            }else {
                callback('必须与新密码一致')
                return false
            }
        }
        const playerId = all.tool.GetSession('playerId');
        return{
            form: {
                oldPassword: '',
                newPassword: '',
                rePassword: '',
                playerId,
                username: '',
                providerId: '',
            },
            rules: {
                oldPassword:{
                    required: '请输入原密码',
                    validator: validatePassWord,
                },
                newPassword:{
                    required: '请输入新密码',
                    validator: validatePassWord,
                },
                rePassword: {
                    required: '请输入重复输入新密码',
                    validator: validatePass,
                }
            },
        }
    },
    created(){
        this.form.providerId = this.providerId
        this.getGamePassword()
    },
    methods:{
        /* api */
        //获取游戏平台密码
        _getGamePassword: data => all.net.send({
            service: 'game',
            functionName: 'getGamePassword',
            data,
        }),
        //修改游戏密码
        _modifyGamePassword: data => all.net.send({
            service: 'game',
            functionName: 'modifyGamePassword',
            data,
        }),
        
        getGamePassword() {
            this._getGamePassword({ providerId: this.providerId }).then(res=>{
                this.form.username = res.data.username
                this.form.oldPassword = res.data.password
            })
        },

        onSubmit(){
            if(all.tool.validateForm(this)){
                this._modifyGamePassword(this.form).then(res=>{
                    this.form.oldPassword = ''
                    this.form.newPassword = ''
                    this.form.rePassword = ''
                    this.getGamePassword()
                    this.msg('密码修改成功','success')
                })
            }
        }
    }
}
</script>

<template>
    <form class="wrap white_form">
        <div class="input_wrapper clearfix">
            <i class="iconfont icon-zhanghu primary_text_color"></i>
            <input v-model="form.username" type="text" class="have_icon" disabled>
        </div>
        <div class="input_wrapper clearfix">
            <i class="iconfont icon-mima1 primary_text_color"></i>
            <input v-model="form.oldPassword" type="text" placeholder="原密码" class="have_icon" disabled>
        </div>
        <FormItem
        icon='icon-mima1'
        :rule='rules.newPassword'
        placeholder='新密码'
        ref='newPassword'
        type='password'
        v-model="form.newPassword"/>
        <FormItem
        icon='icon-mima1'
        :rule='rules.rePassword'
        placeholder='重复新密码'
        ref='rePassword'
        type='password'
        v-model="form.rePassword"/>
        <div class="btn_center">
            <button @click.prevent="onSubmit" class="btn btn_secondary">确认修改</button>
        </div>
    </form>
</template>
