<template class="content">
	<view>	
		<view class="binding" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[0].FIsAllow : true" @click="JumpPage('/pages/binding/binding')">
			<image class="img" src="../../static/zhuangxiang.png" mode="aspectFit"></image>
			<text class="title">装箱绑定</text>
		</view>
			
		<view class="proreport" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[1].FIsAllow : true" @click="JumpPage('/pages/proreport/proreport')">
			<image class="img" src="../../static/shengchan.png" mode="aspectFit" ></image>
			<text class="title">生产汇报</text>
		</view>
		
		<view class="proreportinstorage" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[2].FIsAllow : true" @click="JumpPage('/pages/proreportinstorage/proreportinstorage')">
			<image class="img" src="../../static/proreportinstorage.png" mode="aspectFit"></image>
			<text class="title">汇报入库</text>
		</view>	
		
		<view class="purchaseinstorage" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[3].FIsAllow : true" @click="JumpPage('/pages/purchaseinstorage/purchaseinstorage')">
			<image class="img" src="../../static/purchaseinstorage.png" mode="aspectFit"></image>
			<text class="title">采购入库</text>
		</view>	
		
		<!-- <view class="leftmode" @click="JumpPage('/pages/outstorage/outstorage')">
			<image class="img" src="../../static/outstorage.png" mode="aspectFit"></image>
			<text class="title">出库</text>
		</view>	 -->
			
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
				UserPermissionArray:[]
			}
		},	
		onLoad() {
			this.GetUserPermission();
		},
		methods: {
			//获取当前用户权限
			GetUserPermission:function(){
				let UserId = uni.getStorageSync('FUserId');
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Base_9',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FUserId: UserId
						}
					},
					success: (result) => {
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							return;
						}
						this.UserPermissionArray = result.data.ResultData.Base_9.data0;						
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
						}
					}
				});
			},
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
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}	
	
	.binding{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;	
		text-align: center;
		margin-left: 50upx;	
		margin-top: 30upx;
	}
	
	.proreport{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: 410upx;
		margin-top: 30upx;
	}
	
	.proreportinstorage{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;	
		text-align: center;
		margin-left: 50upx;	
		margin-top: 210upx;
	}
	
	.purchaseinstorage{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: 410upx;
		margin-top: 210upx;
	}
	
	
	.title{
		position: absolute;
		color: #FFFFFF;
		margin-left: -60upx;
		margin-top: 100upx;
	}
		
	.img{	
		position: absolute;
		width: 80upx;
		height: 80upx;
		margin-left: -35upx;
		margin-top: 15upx;
	}
</style>
