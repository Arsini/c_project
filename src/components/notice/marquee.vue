<script>
    export default {
        data:()=>({
            list: '',
            duration: 0,
        }),
        created() {
        },
        mounted(){
			Promise.all([this.getPlatformAnnouncements('all'), this.getPlatformAnnouncements('players')]).then(res=>{
				let text = '';
				const platformAnnouncements = res[0].concat(res[1]);
				all.tool.SetSession('getPlatformAnnouncements', platformAnnouncements)//缓存给站内信用
				platformAnnouncements.forEach(el => {
					text += el.content
				});
				this.list = text
				this.duration = text.length * 0.15
			})
        },
        
        methods: {
            //api
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
        },
    }
</script>

<template>
    <div class="marquee">
        <p :style="{ 'animation-duration' : duration + 's'}">{{ list }}</p>
    </div>
</template>

<style lang="postcss">
    .marquee{
        will-change: transform;
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: relative;
        p{
			white-space: nowrap;
			animation: moveLeft linear infinite;
			position: absolute;
			top:0;
			left: 0;
			line-height: 50px;
			font-weight: bold;
        }
        i{
            background: #fff;
            display: inline-block;
            height: 28px;
            line-height: 28px;
            position: relative;
            z-index: 1;
            padding: 0 4px;
            font-size: 24px;
            color:#ffaa0d;
        }
    }
    @keyframes moveLeft {
        0%{
            transform:translate3d(0,0,0);
        }
        100%{
            transform:translate3d(-50%,0,0);
        }
    }
</style>
