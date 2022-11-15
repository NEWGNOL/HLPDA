<template>
	<view class="container">
		<view class="pagehead">
			<text class="title">盘点仓库：</text>
			<text class="data">{{WareHouseModel.FName}}</text>
		</view>
		
		<view>
			<text class="matierialnumber">物料编码</text>
			<text class="matierialmodel">物料型号</text>
			<text class="matierialcartonqty">件</text>
			<text class="matierialbasicqty">只</text>			
		</view>
		
		<scroll-view class="scrollviewinfo" scroll-y="true">
		       <uni-table class="tablebill" border v-bind:data="ProcessRecordList">
				    <uni-tr v-show="false">
				           <uni-td>物料编码</uni-td>											  	
				    	   <uni-td>物料型号</uni-td>
				    	   <uni-td>件</uni-td>	
						   <uni-td>只</uni-td>										 
				    </uni-tr>
					<uni-tr v-for="item in ProcessRecordList" :key="item.FItemID" @Click="GetSelectMaterial(item)">
					       <uni-td>{{item.FMaterialNumber}}</uni-td>											  	
						   <uni-td>{{item.FModel}}</uni-td>
						   <uni-td>{{(item.FQty / item.FInPackPreQty).toFixed(2) + '件'}}</uni-td>
						   <uni-td>{{item.FQty + item.FUnitName}}</uni-td>										 
					</uni-tr>	          						  
				</uni-table>	
		</scroll-view>  
				
		<view>
			<text class="entrycounttitle">条目数：</text>
			<text class="entrycount">{{ProcessRecordList.length}}</text>
			<text class="totaltext">{{TotalText}}</text>			
		</view>
		
		<view>
			<button class="querydetail" v-on:click="QueryDetail()">查看明细</button>
			<button class="modifymaterialqty" v-on:click="ModifyMaterialQty()">修改数量</button>
			<button class="addmaterial" v-on:click="AddMaterial()">新增物料</button>	
			
			<inventory-keyboard @confirm="ClosePopupWindow" @exit="ClosePopupWindowDirect" v-show="IsOpenDigitKeyboard"></inventory-keyboard>
		</view>
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
				ProcessRecordList: [],				
				ProcessModel: [],
				WareHouseModel: [],
				InventoryAreaModel: [],
				ProcessRecordModel: null,				
				InventoryItemId: '',
				TotalText: '',				
				Main: '',
				Receiver: '',
				IsOpenDigitKeyboard: false
			}
		},
		onLoad() {
			this.AddListener();	
			this.GetLastPageInfo();
			this.GenInventoryList();
		},		
		onUnload() {
			this.RemoveListener();
		},	
		onShow() {
			this.GenInventoryList();
		},
		onNavigationBarButtonTap() {
			this.ConfirmInventory();
		},
		methods: {
			//获取上个页面信息
			GetLastPageInfo:function(){
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2];  //上一个页面	
				//#ifdef APP-PLUS			
				this.ProcessModel = PrevPage.$vm.ProcessModel;				
				this.WareHouseModel = PrevPage.$vm.WareHouseModel;	
				this.InventoryAreaModel = PrevPage.$vm.InventoryAreaModel;				
				//#endif
			},	
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
			//扫描条码做盘点
			ScanBarCode: function(Barcode) {				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'AddLabelStockCheck',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.ProcessModel.FID,												
							FPackBarCode: Barcode,
							FUserId: uni.getStorageSync('FUserId'),
							FStockId: this.WareHouseModel.FItemID,
							FStockPlaceId: 0,		
							FInventoryAreaId: this.InventoryAreaModel.FId,
							Result: 0,
							Msg: ''
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
						let ResultData = result.data.ResultData.AddLabelStockCheck;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);	
			            this.GenInventoryList();						
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);
						}
					}
				});
			},
			//盘点确认
			ConfirmInventory:function(){
				this.GetInventoryItemId();
				this.UpdateInventoryLabelStatus();
			},
			UpdateInventoryLabelStatus: function(){
				if(this.InventoryItemId != ''){
				uni.request({
				   	url: uni.getStorageSync('OtherUrl'),
				   	method: 'POST',
				   	data: {
				   		ModuleCode: 'ConfirmInventory',
				   		token: uni.getStorageSync('token'),
				   		ModuleParam: {
				   			FProcessId: this.ProcessModel.FID,												
				   			FItemIdList: this.InventoryItemId,							
				   			Result: 0,
				   			Msg: ''
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
				   		let ResultData = result.data.ResultData.ConfirmInventory;
				   		let Result = ResultData.dataparam.Result;
				   		if (Result == 0) {
				   			Config.ShowMessage(ResultData.dataparam.Msg);
				   			Config.PopAudioContext(false);
				   			return;
				   		}
				   		Config.ShowMessage(ResultData.dataparam.Msg);
				   		Config.PopAudioContext(true);	
				        this.GenInventoryList();
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
				}				
			},
			//获取选中的物料
			GetSelectMaterial(item){
				this.ProcessRecordModel = item;				
			},
			//获取盘点物料
			GetInventoryItemId(){
				this.InventoryItemId = '';
				if(this.ProcessRecordList.length != 0){
					for(let i = 0; i < this.ProcessRecordList.length; i++){
						let DataModel = this.ProcessRecordList[i];
						this.InventoryItemId += DataModel.FItemID + ',';
					}
					this.InventoryItemId = this.InventoryItemId.substr(0, this.InventoryItemId.length - 1);
				}			
			},
			//新增物料
			AddMaterial:function(){				
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.navigateTo({
					url: '/pages/inventory/addmaterial?WareHouseModel=' + this.WareHouseModel +
					'&ProcessModel=' + this.ProcessModel + '&InventoryAreaModel=' + this.InventoryAreaModel
				});
				uni.hideLoading();
			},			
			//统计盘点数量
			StatInventoryQty: function() {					
				let BasicQty = 0;
				let CartonQty = 0;
				for (let i = 0; i < this.ProcessRecordList.length; i++) {
					let DataModel = this.ProcessRecordList[i];					
					BasicQty += parseFloat(DataModel.FQty.toFixed(2));
					CartonQty += parseFloat((DataModel.FQty / DataModel.FInPackPreQty).toFixed(2));
				}
				this.TotalText = CartonQty.toFixed(2) + '件' + '/'  + BasicQty.toFixed(2) + '只';
				this.ProcessRecordModel = null;
			},
			QueryDetail: function(){
				if (this.ProcessRecordModel == null) {
					Config.ShowMessage('请选择物料！');
					Config.PopAudioContext(false);
					return;
				}				
				uni.navigateTo({
					url: '/pages/inventory/cartonlabeldetail?ProcessID=' + this.ProcessModel.FProcessID +
					'&ItemId=' + this.ProcessRecordModel.ItemID + '&InventoryAreaId=' + this.InventoryAreaModel.FId
				});				
			},
			//修改物料数量
			ModifyMaterialQty:function(){
				this.OpenPopupWindow();
			},		
			
			//获取盘点清单
			GenInventoryList: function(){
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetPdaInventoryList',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FProcessID: this.ProcessModel.FProcessID,
							FStockName: this.WareHouseModel.FName,
							FUserId: uni.getStorageSync('FUserId'),
							FInventoryAreaId: this.InventoryAreaModel.FId							
						}
					},
					success: (result) => {
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);	
							uni.hideLoading();						
							return;
						}						
						this.ProcessRecordList = result.data.ResultData.GetPdaInventoryList.data0;	
						this.StatInventoryQty();
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
						setTimeout(function () {
						    uni.hideLoading();
						}, 2000);					
					}
				});													
			},		
			//打开弹窗
			OpenPopupWindow: function(){				
				let IsSuccess = this.CheckPopupWindow();
				if(IsSuccess == 0){
					return;
				}				
				this.SwitchIsOpenDigitKeyboard(true);
			},
			
			CheckPopupWindow: function(){
				if(this.ProcessRecordModel == null){
				   Config.ShowMessage('请选择要修改数量的物料！');
				   Config.PopAudioContext(false);
				   return 0;				
				}				
			},
			//关闭弹窗
			ClosePopupWindowDirect: function(e){				
				this.SwitchIsOpenDigitKeyboard(false);
				this.GetSelectMaterial(null);
			},
			//关闭弹窗
			ClosePopupWindow: function(e){							
				if(e == null || e == '' || e == 0){
				   Config.ShowMessage('请填写要修改的物料数量！');
				   Config.PopAudioContext(false);					
				   return;
				}	
			
			    uni.showLoading({
			    	title: 'Loading',
			    	mask: true
			    });
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'AddPdaVirtualLabByInventory',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.ProcessModel.FID,
							FStockId: this.WareHouseModel.FItemID,
							FStockPlaceId: 0,	
							FInventoryAreaId: this.InventoryAreaModel.FId,
							FItemId: this.ProcessRecordModel.FItemID,
							FInventoryQty: this.ProcessRecordModel.FQty,
							FQty: e,
							FBillerID: uni.getStorageSync('FUserId'),
							FBatchNo: this.UserLastScanLabelBatchNo,
							FIsAddMaterial: false,
							Result: 0,
							Msg: ''
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
						let ResultData = result.data.ResultData.AddPdaVirtualLabByInventory;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						this.SwitchIsOpenDigitKeyboard(false);
						this.GetSelectMaterial(null);
						this.GenInventoryList();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);							
						}
						uni.hideLoading();
					}
				});				
			},
			SwitchIsOpenDigitKeyboard: function(IsOpenDigitKeyboard){
				this.IsOpenDigitKeyboard = IsOpenDigitKeyboard;
			}
		}
	}
</script>

<style>
	.pagehead{
		width: 100%;
		height: 100upx;
		background-color: #1AAD19;
	}
	
	.matierialnumber {			
		margin-left: 30upx;
		font-size: 38upx;
		margin-top: 10upx;
	}
	
	.matierialmodel {		
		margin-left: 120upx;
		font-size: 38upx;
		margin-top: 10upx;
	}
	
	.matierialcartonqty {	
		margin-left: 100upx;
		font-size: 38upx;
		margin-top: 10upx;
	}
	
	.matierialbasicqty {
		margin-left: 100upx;
		font-size: 38upx;
		margin-top: 10upx;
	}
	
	.entrycounttitle{
		margin-left: 10upx;
		font-size: 40upx;
		margin-top: 60upx;
	}
	
	.entrycount{
		margin-left: 30upx;
		font-size: 40upx;
		margin-top: 60upx;
	}
	
	.totaltext{
		margin-left: 70upx;
		font-size: 40upx;
		margin-top: 60upx;
	}
	
	.title {
		display: inline-block;
		color: #FFFFFF;
		margin-left: 50upx;
		font-size: 40upx;
		margin-top: 30upx;
	}
	
	.data {
		width: 450upx;
		font-size: 40upx;
		color: #FFFFFF;
		margin-top: -60upx;
		margin-left: 150upx;
		text-align: center;
	}
	
	.scrollviewinfo {
		width: 100%;
		height: 850upx;		
	}
	
	.tablebill{
		width: 100%;
		height: 850upx;		
	}
	
	.querydetail{
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 10upx;
		margin-top: 30upx;
		font-size: 16px;
	}
	
	.modifymaterialqty {
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 240upx;
		margin-top: -85upx;
		font-size: 16px;
	}
	
	.addmaterial {
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 480upx;
		margin-top: -85upx;
		font-size: 16px;
	}
</style>
