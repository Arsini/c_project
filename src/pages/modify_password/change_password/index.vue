<script>
export default {
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
    methods:{
        /* api */
        //
        _updatePassword: data => all.net.send({
            service: 'player',
            functionName: 'updatePassword',
            data,
        }),

        onSubmit(){
            if(all.tool.validateForm(this)){
                this._updatePassword(this.form).then(res=>{
                    this.form.oldPassword = ''
                    this.form.newPassword = ''
                    this.form.rePassword = ''
                    this.msg('密码修改成功','success')
                },err=>{
                    this.msg('原密码错误','error')
                })
            }
        }
    }
}
</script>

<template>
    <form class="wrap white_form">
        <FormItem
        icon='icon-mima1'
        :rule='rules.oldPassword'
        placeholder='原密码'
        ref='oldPassword'
        type='password'
        v-model="form.oldPassword"/>
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
