<template>
	<view class="container">
		<text class="title">物料编码：</text>
		<text class="data">{{MaterialModel != null ? MaterialModel.FMaterialNumber : '物料编码'}}</text>		
		
	    <text class="title">物料型号：</text>
		<text class="data">{{MaterialModel != null ? MaterialModel.FModel : '物料型号'}}</text>
		
	<!-- 	<text class="title">物料名称：</text>
		<text class="data">{{MaterialModel != null ? MaterialModel.FMaterialName : '物料名称'}}</text> -->
		
		<scroll-view class="scrollviewinfo" scroll-y="true">
		         <uni-table class="tablebill" border v-bind:data="InventoryList">
						           <uni-tr>
						                  <uni-td align="center">仓库</uni-td>	
										  <uni-td align="center">批号</uni-td>
										  <uni-td align="center">件</uni-td>
										  <uni-td align="center">只</uni-td>
								   </uni-tr>
						           <uni-tr v-for="item in InventoryList" :key="item.FIndex">
								          <uni-td>{{item.FStockName}}</uni-td>
										  <uni-td>{{item.FBatchNo}}</uni-td>
										  <uni-td>{{(item.FQty/item.FInPackPreQty).toFixed(2) + '件'}}</uni-td>
										  <uni-td>{{item.FQty + item.FUnitName}}</uni-td>										
								   </uni-tr>			
		         </uni-table>
		</scroll-view>		
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		components: {
			Config
		},
		data() {
			return {
				MaterialModel: null,				
				InventoryList: [],
				IsQueryInventory: true,
				Main: '',
				Receiver: ''
			}
		},
		onLoad() {			
			this.AddListener();	       
		},	
		onUnload() {
			this.RemoveListener();
		},
		onNavigationBarButtonTap() {
			this.JumpToICItemPage();
		},
        methods: {	
			//添加广播监听
			AddListener: function() {
				var me = this;
				var main = plus.android.runtimeMainActivity(); //获取activity    
				var context = plus.android.importClass('android.content.Context'); //上下文    
				var receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
					onReceive: doReceive
				});
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				var Intent = plus.android.importClass('android.content.Intent');
				var filter = new IntentFilter();
			
				//针对优博讯安卓PDA-i6300添加监听，其它优博讯的型号应该一样或类似
				filter.addAction("android.intent.ACTION_DECODE_DATA"); //监听扫描 		
				main.registerReceiver(receiver, filter); //注册监听 	
			
				//记录窗体和接收者用于关闭窗体的同时也关闭监听	
				me.Main = main;
				me.Receiver = receiver;
			
				function doReceive(context, intent) {
					plus.android.importClass(intent);
					var Barcode = intent.getStringExtra("barcode_string");
					me.ScanBarCode(Barcode);					
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},
			//扫描条码做库存查询
			ScanBarCode: function(Barcode) {	
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'QueryInventoryQty',
						token: uni.getStorageSync('token'),
						ModuleParam: {																		
							FPackBarCode: Barcode							
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
						this.InventoryList = result.data.ResultData.QueryInventoryQty.data0;
						if(this.InventoryList.length > 0){
							this.MaterialModel = this.InventoryList[0];							
							//console.log(this.MaterialModel);
						}	
						else{
							Config.ShowMessage('该物料编码/型号没有对应的库存！');
							Config.PopAudioContext(false);
						}
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);						
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);
						}
					}
				});
				uni.hideLoading();
			},
			JumpToICItemPage: function(){
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.navigateTo({
					url: '/pages/basic/icitem'
				});
				uni.hideLoading();
			}
		}		
	}
</script>

<style>
	.title {
		display: flex;
		margin-left: -500upx;
		margin-top: 50upx;
		font-size: 20px;
	}
	
	.data {	
		display: flex;
		width: 400upx;
		font-size: 20px;
		margin-top: -60upx;
		margin-left: 150upx;
		text-align: center;		
	}
	
	.scrollviewinfo{
		width: 100%;
		height: 910upx;
		margin-top: 50upx;
	}
	
	.tablebill{
		width: 100%;
		height: 890upx;		
	}
</style>
