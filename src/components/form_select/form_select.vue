<script>
export default {
    props: [
        'icon',
        'rule',
        'value',
        'placeholder',
        'options',
    ],
    data(){
        return{
            tip: false,
            msg: '',
        }
    },
    methods: {
        validate(){
            if(this.rule) {
                if(this.rule.required && this.value == '') {
                    this.tip = true
                    this.msg = this.rule.required
                    return false
                } else {
                    this.tip = false
                }
                if(this.rule.validator){
                    return this.rule.validator(this.value, msg => {
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
    },
    model: {
        prop:'value',
        event: 'evt'
    }
}
</script>

<template>
    <div class="select_wrap">
        <i v-show="icon" class="iconfont primary_text_color" :class="icon"></i>
        <select
        @change="$emit('evt', $event.target.value)"
        @blur='validate'
        :value="value">
            <option value="">{{ placeholder }}</option>
            <option v-for="item in options" :value="item.id" :key="item.id">{{ item.name }}</option>
        </select>
        <p v-show="tip">{{ msg }}</p>
    </div>
</template>

<style lang="postcss">
    .select_wrap{
        position: relative;
        margin-bottom: 24px;
        line-height: 80px;
        height: 80px;
        border-bottom: 1px solid #404040;
        width: 100%;
        display: flex;
        i{
            width: 27px;
            padding: 0 18px;
            text-align: center;
            font-size: 40px;
        }
        p{
            position: absolute;
            top:45px;
            left:0;
            font-size:12px;
            color:red;
            line-height: 16px;
        }
        select{
            flex: 1;
            height: 80px;
            color: #757575;
            font-size: 24px;
        }
        option{
            font-size: 24px;
        }
    }
</style>

