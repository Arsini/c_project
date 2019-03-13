<script>
	export default {
		data: ()=>({
			isShow:true,
		}),
		created () {
			setTimeout(() => {
				this.close()
			}, 2500)
		},
		components: {
		},
		methods: {
			close() {
				this.isShow = false
				// const node = document.querySelectorAll('.message_wrapper')
				// node.forEach(val => {
				// 	val.remove()
				// });
			}
		}
	}
</script>

<template>
	<div v-show="isShow" class="message_wrapper" @click="close">
		<div v-if="icon == 'success'" class="message_head">
			<i class="iconfont icon-zhengque"></i>
			<span class="true">操作成功</span>
		</div>
		<div v-else-if="icon == 'error'" class="message_head">
			<i class="iconfont icon-tubiaoku-"></i>
			<span class="false">操作失败</span>
		</div>
		<div v-else class="message_head">
			<i class="iconfont icon-icon"></i>
			<span class="info">提示信息</span>
		</div>
		<div v-html='msg' class="message_body"></div>
	</div>
</template>

<style lang="postcss">
	/* 弹窗 */
	.message_wrapper{
		position: fixed;
		top: 60px;
		left: 0;
		right: 0;
		width: 95%;
		max-width: 600px;
		background-color: #fff;
		margin: auto;
		z-index: 99999999;
		color: #333;
		border-radius: .2rem;
		animation: msgMove .25s ease;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .5);
		display: flex;
		align-items: center;
		padding: 14px 2%;
	}
	@keyframes msgMove {
        0% {
			opacity: 0;
			transform: scale(1,1) translateY(-900%)
		}

		50%,70%,90% {
			opacity: 1;
			transform: scale(1.1,1.1) translateY(0)
		}

		100%,60%,80% {
			opacity: 1;
			transform: scale(1,1) translateY(0)
		}
    }
	
	.message_body{
		color: #999;
		text-align: center;
		flex: 1;
	}
	.message_head{
		height: 100%;
		padding-right: 18px;
		display: flex;
		.info,i{
			color: #f8c854;
		}
		i{
			font-size: 24px;
			margin-right: 10px;
			padding-top: 6px;
		}
		.true,.icon-zhengque{
			color: #59c56e;
		}
		.false,.icon-tubiaoku-{
			color: #e3504f;
		}
	}
	
</style>
