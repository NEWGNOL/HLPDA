<template>
	<view>	
		<view class="leftmode" @click="JumpPage('/pages/binding/binding')">
			<image class="img" src="../../static/zhuangxiang.png" mode="aspectFit"></image>
			<text class="title">装箱绑定</text>
		</view>
			
		<view class="rightmode" @click="JumpPage('/pages/proreport/proreport')">
			<image class="img" src="../../static/shengchan.png" mode="aspectFit" ></image>
			<text class="title">生产汇报</text>
		</view>
		
		<view class="leftmode" @click="JumpPage('/pages/instorage/instorage')">
			<image class="img" src="../../static/instorage.png" mode="aspectFit"></image>
			<text class="title">入库</text>
		</view>	
		
		<view class="rightmode" @click="JumpPage('/pages/outstorage/outstorage')">
			<image class="img" src="../../static/outstorage.png" mode="aspectFit"></image>
			<text class="title">出库</text>
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
	
	.title{
		color: #FFFFFF;
	}
	
	.img{
		margin-top: 10rpx;
		width: 80rpx;
		margin-left: 110rpx;
	}
	
	.leftmode{
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
	
	.rightmode{
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
</style>
