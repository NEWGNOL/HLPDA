<template>
	<view>		
		<view class="view0">
			<view class="view" @click="JumpPage('/pages/binding/binding')">
				<image src="../../static/zhuangxiang.png" mode="center" class="img"></image>
				<text class="text1">装箱绑定</text>
			</view>
			
			<view class="view" @click="JumpPage('/pages/proreport/proreport')">
				<image src="../../static/shengchan.png" mode="aspectFit" class="img"></image>
				<text class="text1">生产汇报</text>
			</view>
		</view>		
	</view>	
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {				
			}
		},		
		methods: {
			//跳转到指定页面
			JumpPage:function(url){			
				uni.showLoading({
					title:'Loading'
				});	
				uni.navigateTo({
					url:url
				});
				uni.hideLoading();
			}			
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}	
			
	.view0{
		display: flex;
		margin-top: 30rpx;
	}	
	
	.text1{
		color: #FFFFFF;
	}
	
	.view{
		background-color: #007AFF;
		border-radius: 25rpx;
		display: flex;
		flex-direction: column;
		width: 350rpx;
		height: 150rpx;
		margin-left: 16rpx;
		text-align: center;
	}
	
	.img{
		margin-top: 10rpx;
		width: 80rpx;
		margin-left: 135rpx;
	}
</style>
