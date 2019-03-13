<script>
export default {
    props:['mailList', 'mailType'],
    data(){
        return{
            current: '公告消息',
            contentShow: '',
            msgList: '',
            dialogVisible:false,
            delMailItem:{
                mailObjId:"",
                index:""
            }
        }
    },
    created(){
        Promise.all([this.getPlatformAnnouncements('all'), this.getPlatformAnnouncements('players')]).then(res=>{
            this.msgList = res[0].concat(res[1]);
        })
        this.$emit('popFlag', 'serviceComponent', false)
    },
    methods:{
        /* api */
        _readMail: data => all.net.send({
            service: 'player',
            functionName: 'readMail',
            data,
        }),
        
        _deleteMail: data => all.net.send({
            service: 'player',
            functionName: 'deleteMail',
            data,
        }),
        _getPlatformAnnouncements: data => all.net.send({
            service: 'platform',
            functionName: 'getPlatformAnnouncements',
            data: data
        }),

        getPlatformAnnouncements(type){
            return new Promise((reslove, reject) => {
                this._getPlatformAnnouncements({ reach: type }).then(res=>{
                    reslove(res.data)
                })
            })
        },
        
        tab(name){
            this.current = name
        },
        detailLetter(time, mailObjId, hasBeenRead, index){
            this.contentShow = time
            if(!hasBeenRead){
                const playerId = all.tool.GetSession('playerId')
                const data = {
                    playerId,
                    mailObjId,
                }
                this._readMail(data).then(res=>{
                    this.$emit('readMail', index)
                })
            }
        },

        detailPost(time){
            this.contentShow = time
        },

        delMail(mailObjId, index){
            const playerId = all.tool.GetSession('playerId')
            const data = {
                playerId,
                mailObjId,
            }
            this._deleteMail(data).then(res=>{
                this.$emit('bDelete', index)
            })
        },
        delMailDialogOpen(mailObjId, index){
            this.delMailItem.mailObjId = mailObjId
            this.delMailItem.index = index
            this.dialogVisible = true;
        },
        delMailDialogClose(){
            this.dialogVisible = false
            this.delMailItem.mailObjId = ""
            this.delMailItem.index = ""
        },
        delMailAction(){
            const mailObjId = this.delMailItem.mailObjId;
            let index = this.delMailItem.index;
            let isNum = typeof index == "number" ? true : false;
            if(mailObjId && isNum){
                this.delMail(mailObjId, index)
            }
            this.delMailDialogClose()
        }
    },
}
</script>

<template>
    <div class="mail">
        <ul class="tab">
            <li :class="{'current': current == '公告消息'}" @click="tab('公告消息')"><i class="iconfont icon-gonggao"></i>公告消息</li>
            <li :class="{'current': current == '站内消息'}" @click="tab('站内消息')"><i class="iconfont icon-xiaoxi"></i>站内消息</li>
        </ul>
        <ul v-show="current == '站内消息'" class="mail_list wrap">
            <li v-for="(item, key) in mailList" @click="detailLetter(item.createTime, item._id, item.hasBeenRead, key)" :key="item.createTime">
                <div class="title">
                    <h4>{{ item.title }}</h4>
                    <div>
                        <span class="time">{{ item.createTime.getDate() }}</span>
                        <i v-show="item.hasBeenRead" class="iconfont icon-tubiao"></i>
                        <i v-show="!item.hasBeenRead" class="iconfont icon-xinjian"></i>
                    </div>
                </div>
                <section v-show="contentShow == item.createTime" class="content">
                    <p v-html="item.content"></p>
                    <i class="iconfont icon-shanchu del_mail" @click="delMailDialogOpen(item._id, key)"></i>
                </section>
            </li>
        </ul>
        <ul v-show="current == '公告消息'" class="mail_list wrap">
            <li v-for="item in msgList" @click="detailPost(item.date)" :key="item.date">
                <div class="title">
                    <h4>{{ item.title }}</h4>
                    <div>
                        <span>{{ item.date.getDate() }}</span>
                        <span class="detail">详情</span>
                    </div>
                </div>
                <section v-show="contentShow == item.date" class="content">
                    <p>{{ item.content }}</p>
                </section>
            </li>
        </ul>
        <Dialog title='提示' :visible='dialogVisible' @close="delMailDialogClose">
            <span slot="body">是否要删除该邮件？</span>
            <div slot="footer" class="btn_center">
                <button @click="delMailAction" class="btn btn_secondary">是</button>
                <button @click="delMailDialogClose" class="btn btn_pop_cancel">否</button>
            </div>
        </Dialog>
    </div>
</template>

<style lang="postcss" scoped>
   .mail{
       .tab{
           margin-bottom: 20px;
       }
       .mail_list{
           li{
                border-bottom: 1PX solid #333;
                line-height: 40px;
                padding: 14px 0;
           }
       }
       .title{
           display: flex;
           justify-content: space-between;
           h4{
               width: 45%;
           }
           .time{
               color: #999;
           }
           .detail{
               padding-left: 14px;
           }
       }
       .content{
           display: flex;
           padding: 20px 0;
           p{
               flex: 1;
               line-height: 35px;
           }
           .del_mail{
               width: 10%;
               text-align: center;
               color: red;
           }
           
       }
   }
</style>

