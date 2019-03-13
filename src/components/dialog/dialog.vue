<script>
export default {
    props: ['title', 'visible', 'size'],
    data:()=>({}),
}
</script>

<template>
    <div class="dialog" v-show="visible">
        <div class="dialog_wrapper small" :class="{ 'large' : size == 'large', 'small' : size == 'small'}">
            <div class="dialog_head">
				<i> </i>
				<h3>{{ title? title : '温馨提示' }}</h3>
				<i class="" @click="$emit('close')">X</i>
			</div>
			<div class="dialog_body">
				<slot name="body"></slot>
			</div>
			<slot name="footer"></slot>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
    .dialog{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 9999999;
	}
	.dialog_wrapper{
		position: fixed;
		top: 10vh;
		left: 0;
		right: 0;
		margin: auto;
		background: #fff;
		border-radius: .1rem;
		overflow: hidden;
		border-radius: .3rem;
	}
	.small{
		width: 90%;
	}
	.middle{
		width: 90%;
	}
	.large{
		width: 90%;
	}
    .dialog_head{
        line-height: 80px;
		display: flex;
		justify-content: space-between;
		color: #000;
		border-bottom: 1px solid #f2f2f2;
		h3{
			font-size: 30px;
			font-weight: normal;
		}
		i{
			width: 60px;
			text-align: center;
			font-size: 28px;
		}
    }
	.dialog_body{
		padding: 20px 2% 0 2%;
		color: #000;
	}
</style>

