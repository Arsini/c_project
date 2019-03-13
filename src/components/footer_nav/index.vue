<script>
	export default {
		data: ()=>({
			footer:[
				{
					name: '大厅',
					icon: 'icon-dating',
					link: '/lobby',
				},
				{
					name: '充值',
					icon: 'icon-chongzhi',
					link: '/recharge',
				},
				{
					name: '提款',
					icon: 'icon-ruhetikuan',
					link: '/withdraw',
				},
				{
					name: '账户',
					icon: 'icon-gerenzhongxindefuben',
					link: '/account',
				},
			]
		}),
	}
</script>

<template>
	<nav class="footer_nav">
		<router-link to="/" exact>
			<i class="iconfont icon-shouye"></i>
			<span>首页</span> 
		</router-link>
		<router-link
		v-for="item in footer"
		v-track="`底部导航栏 ${item.name}`"
		:key="item.name"
		:to="item.link">
			<i class="iconfont" :class="item.icon"></i>
			<span>{{ item.name }}</span> 
		</router-link>
	</nav>
</template>

<style lang="postcss">
	.footer_nav{
		background: linear-gradient(#000, #222);
		will-change: transform;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		height: 98px;
		display: flex;
		a{
			flex: 1;
			color:#8c8d8e;
			display: flex;
			flex-direction: column;
			text-align: center;
			padding-top: 10px;
		}
		i{
			line-height: 48px;
			font-size: 44px;
			font-family: '微软雅黑';
			background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#76777b), to(#dedede));
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			margin-bottom: 2px;
		}
		span{
			font-size: 24px;
		}
		.router-link-active{
			color: #ffaa0d;
			i{
				background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#ffaa0d), to(#ffaa0d));
				background-color:#ffaa0d;
			}
		}
	}
</style>

