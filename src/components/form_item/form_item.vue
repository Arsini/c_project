<script>
	export default {
        props: [
            'icon',
            'rule',
            'type',
            'value',
            'placeholder',
        ],
		data: ()=>({
            tip: false,
            msg: '',
		}),
		components: {
		},
		methods: {
            validate(val){
                val = val || this.value
                if(this.rule) {
                    if(this.rule.required && val == '') {
                        this.tip = true
                        this.msg = this.rule.required
                        return false
                    } else {
                        this.tip = false
                    }
                    if(this.rule.validator){
                        return this.rule.validator(val, msg => {
                            if(msg){
                                this.tip = true
                                this.msg = msg
                            } else {
                                this.tip = false
                            }
                        })
                    }
                }
            },
            inputVal(e){
                const val = e.target.value;
                this.$emit('evt', val)
                this.validate(val)
            },
        },
        model: {
            prop:'value',
            event: 'evt'
        }
	}
</script>

<template>
	<div class="input_wrapper clearfix" ref='input'>
        <i v-show="icon" class="iconfont primary_text_color" :class="icon"></i>
        <input
        @input="inputVal"
        :value="value"
        :type="type? type : 'text'"
        :placeholder='placeholder'
        :class="{'have_icon': icon}">
        <p v-show="tip">{{ msg }}</p>
    </div>
</template>

<style lang="postcss">
    .input_wrapper{
        position: relative;
        margin-bottom: 36px;
        line-height: 80px;
        border-bottom: 1PX solid #404040;
        display: flex;
        p{
            position: absolute;
            top:82px;
            left:0;
            font-size: 24px;
            color:red;
        }
        input{
            height: 80px;
            width: 100%;
            color: #fff;
            font-size: 26px;
        }
        .have_icon{
            margin-left: -70px;
            padding-left: 70px;
        }
        .iconfont{
            padding: 0 16px;
            font-size: 40px;
        }
    }
</style>