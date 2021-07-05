<template>
	<view>	
		<view class="binding" @click="JumpPage('/pages/binding/binding')">
			<image src="../../static/zhuangxiang.png" mode="center" class="img"></image>
			<text class="text1">装箱绑定</text>
		</view>
			
		<view class="proreport" @click="JumpPage('/pages/proreport/proreport')">
			<image src="../../static/shengchan.png" mode="aspectFit" class="img"></image>
			<text class="text1">生产汇报</text>
		</view>
			
		<!-- <view class="updatesoftware" @click="UpdateSoftware()">
			<image src="" mode="aspectFit" class="img"></image>
			<text class="text1">参数设置</text>
		</view>	 -->		
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
	
	.binding{
		display: flex;
		flex-direction: column;
		text-align: center;
		width: 300rpx;
		height: 150rpx;
		background-color: #007AFF;
		border-radius: 25rpx;	
		margin-left: 50rpx;	
		margin-top: 30rpx;
	}
	
	.proreport{
		display: flex;
		flex-direction: column;
		text-align: center;
		width: 300rpx;
		height: 150rpx;
		background-color: #007AFF;
		border-radius: 25rpx;	
		margin-left: 410rpx;
		margin-top: -150rpx;
	}
	
	.updatesoftware{
		display: flex;
		flex-direction: column;
		text-align: center;
		width: 300rpx;
		height: 150rpx;
		background-color: #007AFF;
		border-radius: 25rpx;	
		margin-left: 50rpx;	
	    margin-top: 50rpx;
	}
	
	.img{
		margin-top: 10rpx;
		width: 80rpx;
		margin-left: 110rpx;
	}
</style>
