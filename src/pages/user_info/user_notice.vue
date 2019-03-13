<script>
export default {
    data(){
        return{
            list: [],
			data: [],
        }
    },
    created(){
        this.getSmsStatus()
    },
    methods:{
        /* API */
        //短信通知
        _getSmsStatus: data => all.net.send({
            service: 'player',
            functionName: 'getSmsStatus',
            data,
        }),
        //短信通知修改
        _setSmsStatus: data => all.net.send({
            service: 'player',
            functionName: 'setSmsStatus',
            data,
        }),

        //
        getSmsStatus() {
            this._getSmsStatus().then(res=>{
                const data = res.data;
                this.data = data;
                const list = []
                data.forEach((val, index) => {
                    if(val.status === 1) {
                        list.push(true)
                    }else{
                        list.push(false)
                    }
                })
                this.list = list
            })
        },

        //
        onSubmit() {
            let status = '';
            (this.data).forEach((val, key) => {
                const s = this.list[key]? 1 : 0;
                status += `${val.smsId}:${s},`
            });
            this._setSmsStatus({status}).then(res=>{
                this.msg('修改成功', 'success')
            })
        },
    }
}
</script>


<template>
    <div class="user_box user_notice clearfix">
        <h3>短信通知设定</h3>
        <div class="notice_setting">
            <label 
            v-for='(val, key) in data' 
            :key='val.smsName'
            :for="val.smsName">
                <input
                :id='val.smsName'
                class="checkbox" type="checkbox" value="1" v-model="list[key]">{{ val.smsName }}
            </label>
        </div>
        <div class="btn_center">
            <button @click="onSubmit" class="btn btn_primary">确认修改</button>
        </div>
    </div>
</template>

<style lang="postcss">
    .user_notice{
        .notice_setting{
            padding-top: 20px;
            display: flex;
            flex-wrap: wrap;
        }
        h3{
            margin-bottom: 21px;
            border-left: 4PX solid #ffaa0d;
            padding-left: 14px;
        }
        label{
            line-height:30px;
            width: 50%;
            padding-bottom: 24px;
        }
    }
</style>
