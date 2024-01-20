<template>
	<view class="container">	
		<view class="binding" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[0].FIsAllow : true" @click="JumpPage('/pages/binding/binding')">
			<image class="img" src="../../static/zhuangxiang.png" mode="aspectFit"></image>
			<text class="title">装箱绑定</text>
		</view>
			
		<view class="proreport" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[1].FIsAllow : true" @click="JumpPage('/pages/proreport/proreport')">
			<image class="img" src="../../static/shengchan.png" mode="aspectFit" ></image>
			<text class="title">生产汇报</text>
		</view>
		
		<view class="proreportinstorage" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[2].FIsAllow : true" @click="JumpPage('/pages/proreportinstorage/proreportinstorage1')">
			<image class="img" src="../../static/proreportinstorage.png" mode="aspectFit"></image>
			<text class="title">汇报入库</text>
		</view>	
		
		<view class="outsideinstorage" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[4].FIsAllow : true" @click="JumpPage('/pages/purchaseinstorage/outsideinstorage')">
			<image class="img" src="../../static/outsideinstorage.png" mode="aspectFit"></image>
			<text class="title">采购入库</text>
		</view>	
		
		<!-- <view class="purchaseinstorage" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[3].FIsAllow : true" @click="JumpPage('/pages/purchaseinstorage/purchaseinstorage')">
			<image class="img" src="../../static/purchaseinstorage.png" mode="aspectFit"></image>
			<text class="title">采购入库</text>
		</view>	 -->
		
		<view class="outstorage" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[4].FIsAllow : true" @click="JumpPage('/pages/outstorage/outstorage')">
			<image class="img" src="../../static/outstorage.png" mode="aspectFit"></image>
			<text class="title">销售出库</text>
		</view>	
			
		<view class="transfers" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[5].FIsAllow : true" @click="JumpPage('/pages/transfers/transfers')">
			<image class="img" src="../../static/transfers.png" mode="aspectFit"></image>
			<text class="title">仓库调拨</text>
		</view>	
				
		<view class="inventory" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[6].FIsAllow : true" @click="JumpPage('/pages/inventory/inventory')">
			<image class="img" src="../../static/inventory.png" mode="aspectFit"></image>
			<text class="title">仓库盘点</text>
		</view>	
		
		<view class="queryinventory" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[7].FIsAllow : true" @click="JumpPage('/pages/inventory/queryinventory')">
			<image class="img" src="../../static/queryinventory.png" mode="aspectFit"></image>
			<text class="title">库存查询</text>
		</view>	
		
		<view class="outsidetransfers" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[8].FIsAllow : true" @click="JumpPage('/pages/outsidetransfers/outsidetransfers')">
			<image class="img" src="../../static/outsidetransfers.png" mode="aspectFit"></image>
			<text class="title">外部调拨</text>
		</view>	
				
		<view class="receivegoods" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[10].FIsAllow : true" @click="JumpPage('/pages/outstorage/receivegoods')">
			<image class="img" src="../../static/receivegoods.png" mode="aspectFit"></image>
			<text class="title">单据收退</text>
		</view>	
				
		<view class="stockgoods" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[11].FIsAllow : true" @click="JumpPage('/pages/outstorage/stockgoods')">
			<image class="img" src="../../static/stockgoods.png" mode="aspectFit"></image>
			<text class="title">单据备货</text>
		</view>	
		<!-- 标签绑定与解绑 -->
		
		<view class="bindCode" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[12].FIsAllow : true" @click="JumpPage('/pages/bindCode/bindCode')">
			<image class="img" src="../../static/bindCode.png" mode="aspectFit"></image>
			<text class="title">标签绑定</text>
		</view>
		
		<view class="un-bindCode" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[13].FIsAllow : true" @click="JumpPage('/pages/unbindCode/unbindCode')">
			<image class="img" src="../../static/unBind.png" mode="aspectFit"></image>
			<text class="title">标签解绑</text>
		</view>
		
		<view class="sales-Return" v-show="UserPermissionArray.length != 0 ? UserPermissionArray[13].FIsAllow : true"  @click="JumpPage('/pages/SalesReturn/SalesReturn')">
			<image class="img" src="../../static/returnGoods.png" mode="aspectFit"></image>
			<text class="title">退货解绑</text>
		</view>
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
					title:'Loading',
					mask: true
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
	/* .container{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	} */
	.binding{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;	
		text-align: center;
		margin-left: -190upx;	
		margin-top: 100upx;
	}
	
	.proreport{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: 190upx;
		margin-top: 100upx;
	}
	
	.bindCode{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: -190upx;
		margin-top: 280upx;
	}
	.un-bindCode{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: 190upx;
		margin-top: 280upx;
	}
	.sales-Return{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: -190upx;
		margin-top: 460upx;
	}
	
	.proreportinstorage{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;	
		text-align: center;
		margin-left: -190upx;	
		margin-top: 640upx;
	}
	
	.purchaseinstorage{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: 190upx;
		margin-top: 640upx;
	}
	
	.outstorage{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;	
		text-align: center;
		margin-left: -190upx;	
		margin-top: 820upx;
	}
	
	.transfers{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;	
		text-align: center;
		margin-left: 190upx;	
		margin-top: 820upx;
	}
	
	.inventory{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;	
		text-align: center;
		margin-left: -190upx;	
		margin-top: 1000upx;
	}
	
	.queryinventory{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;	
		text-align: center;
		margin-left: 190upx;	
		margin-top: 1000upx;
	}
	
	.outsidetransfers{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;	
		text-align: center;
		margin-left: -190upx;	
		margin-top: 1180upx;
	}
	
	.outsideinstorage{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: 190upx;
		margin-top: 640upx;
	}
	
	.receivegoods{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: -190upx;
		margin-top: 1360upx;
	}
	
	.stockgoods{
		position: absolute;
		width: 300upx;
		height: 150upx;
		background-color: #007AFF;
		border-radius: 25upx;
		text-align: center;	
		margin-left: 190upx;
		margin-top: 1360upx;
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
