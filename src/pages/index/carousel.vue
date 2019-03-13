<script>
import {
    Swipe, SwipeItem
}
from 'vue-swipe';
export default {
    name: 'carousel',
    data() {
        return {
            activityList: [], //活动列表
        }
    },
    created() {
        if(all.tool.GetLocal('getConfig')){
            this.formatBanner()
        }
    },
    watch:{
        '$store.state.config'(){
            if(this.activityList.length == 0){
                this.formatBanner()
            }
        }
    },
    methods: {
        formatBanner(){
            this.activityList = [];
            let activityList = all.tool.GetLocal('getConfig').activityList; //列表
            if (activityList.length) {
                for (var i = 0; i < activityList.length; i++) {
                    let title, bannerSmall, bannerSmallIndex, bannerBig, bannerBigIndex;
                    if(all.tool.noShowReal(activityList.showInRealServer)) {
                        if (activityList[i].status == 1) {
                            if (activityList[i].title) {
                                title = activityList[i].title[0].name;
                            } else {
                                title = "优惠活动"
                            }

                            this.activityList.push({
                                "title": title,
                                "bannerSmall": activityList[i].bannerImg,
                                "bannerBig": activityList[i].extString
                            })
                        }
                    }
                }
            }
        },

        jump(url){
            if(url){
                const substr = url.substr(0, 1);
                if(substr == '/'){
                    this.$router.push(url)
                } else if(substr == 'h') {
                    window.open(url)
                }
            }
        },
        // imgfun(item) {
        //     if (item.bannerBig) {
        //         if (item.bannerBig.indexOf(".html")) {
        //             const location = item.bannerBig.indexOf('#');
        //             if(location >= 0){
        //                 const protocol = window.location.protocol;
        //                 const host = window.location.host;
        //                 window.location.href = protocol + '//' + host + item.bannerBig;
        //             }else{
        //                 window.location.href = item.bannerBig
        //             }
        //         }else{
        //           this.$router.push({
        //               path: "/index/activity?title=" + item.title,
        //               query: {
        //                   activity: [item.bannerBig]
        //               }
        //           })
        //         }
        //     }
        // }
    },
    components: {
        Swipe, SwipeItem
    },

}
</script>

<template>
	<div class="carousel">
		<swipe class="my-swipe">
			<swipe-item class="slide1" v-for="(item,index) in activityList" :key="index">
                <!-- <router-link
                :src="item.bannerSmall"
                :to='item.bannerBig? item.bannerBig : "/"'
                tag="img"
                ></router-link> -->
                <img
                :src="item.bannerSmall"
                @click="jump(item.bannerBig)"
				v-track="`首页banner ${item.title}`">
			</swipe-item>
		</swipe>
	</div>
</template>

<style src="vue-swipe/dist/vue-swipe.css"></style>
<style lang="postcss" scoped>
	.carousel {
		height: 3.75rem;
		background: #000;
		div {
			height: 100%;
			background-size: cover;
			float: left;
			width: 100%;
		}
		.slide1 {
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>