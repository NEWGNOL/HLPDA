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
			<text class="text1">软件更新</text>
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
			},
			//软件更新
			UpdateSoftware:function(){
				uni.showModal({
					title: '提示',
					content: '是否要进行软件更新？',
					success: function (result) {
						if (result.confirm) {
							uni.showLoading({
								title:'更新中......'
							});		
							uni.downloadFile({
									url:'https://192.168.16.13/D://HLPDA//__UNI__8DC9259_0630192020',
									success: download =>
									{	
										//console.log(download);
										uni.hideLoading();	
										if(download.statusCode == 200)//下载成功状态码									
										{											
											plus.runtime.install(
												download.tempFilePath,{
													force:true
												}
											);																						
											plus.runtime.restart();
										}
									},
									fail: () => {
									        uni.hideLoading();
						                    Config.ShowMessage('更新文件失败！');		
	                                        Config.PopAudioContext();					
									}
								});							
						} 
					}
				});				
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
