<script>
export default {
    data(){
        return{
            tree: {},
            current: '',
        }
    },
    created(){
        this.getRewardList()//获取优惠列表并且格式化
    },
    methods: {
        //获取优惠列表并且格式化
        getRewardList(){
            this.$api.getRewardList().then(res=>{
                const url = location.hostname;
                this.$api.getTemplateSetting({ url }).then(r => {
                    let del = false; //是否删除体验金
                    const dataLength = r.data.length > 0;
                    const isHave = dataLength? (r.data[0].functionList).find(e => e.functionId == 1) : false;
                    if(isHave){
                        (r.data[0].functionList).forEach(e => {
                            if(e.functionId == 2){
                                del = true
                            }
                        });
                    }
                    const tree = {};
                    res.data.forEach(e => {
                        if(e.list && e.list.length > 0 && all.tool.noShowReal(e.showInRealServer)){
                            
                            const arr = (e.code).split('_');
                            if(!tree[arr[1]]){
                                tree[arr[1]] = {
                                    icon: arr[2],
                                    index: arr[0],
                                    list: [],
                                }
                            }
                            const code = e.code;
                            const list = e.list[0];
                            const { condition, param } = e;
                            let imageUrl = '';
                            if(condition){
                                imageUrl = condition.imageUrl.length > 0? condition.imageUrl[0] : '';
                            } else if(param) {
                                imageUrl = param.imageUrl.length > 0? param.imageUrl[0] : '';
                            }
                            const description = list.displayTextContent;
                            const btnOrImageList = list.btnOrImageList;
                            const detailLink = btnOrImageList.length > 1? btnOrImageList[1].btnSourceFrom : '';
                            const btnName =  btnOrImageList.length > 1? btnOrImageList[1].btnName : '';
                            // const index = parseInt(arr[3]);
                            const type = e.type.des;
                            let timeStamp = '--';
                            const leftTime = this.leftTimeFn(e);
                            if(new Date(e.validStartTime) >= new Date()){
                                timeStamp = `活动尚未开始`
                            } else if(leftTime <= 0) {
                                timeStamp = '优惠已结束'
                            }
                            const obj = {
                                name: list.displayTitle,
                                imageUrl,
                                description,
                                detailLink,
                                btnName,
                                validStartTime: new Date(e.validStartTime).format("yyyy年MM月dd日"),
                                validEndTime: new Date(e.validEndTime).format("yyyy年MM月dd日"),
                                code,
                                // index,
                                type,
                                timeStamp,
                                leftTime,
                            }
                            if(!del || list.displayTitle.indexOf('体验金') == -1){
                                tree[arr[1]].list.push(obj)
                            }
                        }
                    });

                    //内容排序
                    const treeArr = Object.keys(tree);
                    treeArr.forEach(e => {
                        const list = tree[e].list;
                        let arrSort = [];
                        const sort = list.sort((a, b) => {
                            const e1 = a.leftTime;
                            const e2 = b.leftTime;
                            if (e2 > e1) {
                                return 1;
                            }else if(e2 < e1){
                                return -1
                            }else{
                                return 0;
                            }
                        })
                        sort.forEach(el => {
                            if(arrSort.length == 0){
                                arrSort.push(el)
                            } else if(arrSort[0].leftTime > el.leftTime && el.timeStamp == '--') {
                                arrSort.unshift(el)
                            } else {
                                arrSort.push(el)
                            }
                        });
                        tree[e].list = arrSort
                    });

                    //侧边栏排序
                    const treeSortArr = treeArr.sort((a, b) => {
                        return parseInt(tree[a].index) - parseInt(tree[b].index)
                    })
                    const treeSort = {}
                    treeSortArr.forEach(e => {
                        treeSort[e] = tree[e]
                    });
                    this.tree = treeSort

                    const rewardName = all.tool.GetSession('reward');
                    if(rewardName){
                        this.selectType(rewardName)
                    } else {
                        this.selectType(treeArr[0])
                    }
                })
            })
        },
        
        //侧边栏选择
        selectType(name){
            all.tool.SetSession('reward', name)
            this.current = name;
        },

        //了解详情
        showDetail(code, link, type){
            const query = {
                code,
                link,
                type,
            }
            this.$router.push({ path:`/reward_detail`, query, })
        },

        leftTimeFn(e){
            let leftTime = 0;
            if(new Date(e.validStartTime) >= new Date()){
                leftTime = new Date(e.validStartTime) - new Date()
            } else {
                leftTime = new Date(e.validEndTime) - new Date();
            }
            return leftTime;
        },
    },
    computed:{
        list(){
            let list = [];
            const treeList = this.tree[this.current];
            if(treeList){
                list = treeList.list
            }
            return list
        }
    },
}
</script>

<template>
    <div class="reward">
        <ul class="tab">
            <li 
            v-for="(val, key) in tree"
            :key='key' 
            @click="selectType(key)"
            :class="{'current': key == current}">{{ key }}</li>
        </ul>
        <ul class="reward_list">
            <li v-for="(val, key) in list" :key="key" v-track="`优惠列表 ${val.name}`" @click="showDetail(val.code, val.detailLink, val.type)">
                <img class="reward_img" :src="val.imageUrl">
                <h4>{{ val.name }}</h4>
                <div class="des" v-html="val.description"></div>
                <div class="footer_box">
                    <div class="active_time primary_text_color">{{ val.validStartTime }} - {{ val.validEndTime }}</div>
                    <button class="reward_btn">{{ val.btnName }}</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="postcss">
    .reward{
        .reward_list{
            li{
                background-color: #171717;
                padding: 0 6% 20px 6%;
                margin-bottom: 26px;
                .reward_img{
                    margin: 24px 0;
                    border-radius: 10px;
                    min-height: 116px;
                }
                h4{
                    font-size: 26px;
                }
                .des{
                    padding: 20px 0;
                }
                .active_time{
                    border: 1px solid #ffaa0d;
                    padding: 10px 14px;
                    font-size: 20px;
                }
            }
        }
        .footer_box{
            display: flex;
            justify-content: space-between;
        }
        .ifr{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
        }
        .reward_btn{
            background: linear-gradient(to bottom right,#ffc578, #d77900);
            line-height: 25px;
            padding: 0 18px;
            border-radius: 4px;
            color: #fff;
        }
    }
    
</style>

