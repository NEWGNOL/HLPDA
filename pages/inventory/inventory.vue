<template>
	<view class="container">
		<text class="inventoryplantitle">盘点方案：</text>
		<inventory-plan class="inventoryplan" :candidates="ProcessList"  v-model="SelectProcess" @input="SwitchInventoryPlan()"></inventory-plan>
		
		<text class="warehousetitle">盘点仓库：</text>
		<inventory-stock class="warehouse" :candidates="WareHouseList"  v-model="SelectWareHouse" @input="SwitchWareHouse()"></inventory-stock>
		
		<scroll-view class="scrollviewinfo" scroll-y="true">
		         <uni-table class="tablebill" border v-bind:data="ProcessRecordList">
						           <uni-tr>
						                  <uni-th align="center">物料编码</uni-th>
										  <uni-th align="center">盘点数量</uni-th>	
										  <uni-th align="center">物料名称</uni-th>	
					               </uni-tr>
						           <uni-tr v-for="item in ProcessRecordList" :key="item.FItemID" @Click="GetSelectMaterial(item)">
								          <uni-td>{{item.FMaterialNumber}}</uni-td>	
										  <uni-td>{{item.FQty}}</uni-td>	
										  <uni-td>{{item.FMaterialName}}</uni-td>	
						           </uni-tr>			
		         </uni-table>
		</scroll-view>
		
		<!-- <uni-popup ref="fillqty" type="center" :mask-click="false">			
			<mod-fty mode="input" message="成功消息" v-bind:title="PopTitle" placeholder="请输入盘点数量" :duration="2000" :before-close="true" @close="ClosePopupWindowDirect" 
			@confirm="ClosePopupWindow"></mod-fty>			
		</uni-popup> -->	
		
		<button class="modifymaterialqty" v-on:click="ModifyMaterialQty()">修改物料数量</button>
		<button class="addmaterial" v-on:click="AddMaterial()">新增物料</button>	
		
		<inventory-keyboard @confirm="ClosePopupWindow" @exit="ClosePopupWindowDirect" v-show="IsOpenDigitKeyboard"></inventory-keyboard>
	</view>
</template>

<script>
	
	import Config from '../../common/config.js';
	export default {
		data() {
			return {
				ProcessList: [],
				WareHouseList: [],
				ProcessRecordList: [],
				SelectProcess: '',
				SelectWareHouse: '',
				ProcessModel: [],
				WareHouseModel: [],
				ProcessRecordModel: null,
				PopTitle: '',
				Main: '',
				Receiver: '',
				IsOpenDigitKeyboard: false
			}
		},
		onLoad() {
			this.AddListener();
			this.GetAllInventoryPlan();			
		},
		onshow(){
			this.GenInventoryList();
		},
		onUnload() {
			this.RemoveListener();
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
			//扫描条码做盘点
			ScanBarCode: function(Barcode) {
				let me = this;				
				if (me.SelectProcess == '') {
					Config.ShowMessage('请选择盘点方案！');
					Config.PopAudioContext(false);
					return;
				}								
				if(me.SelectWareHouse == ''){
					Config.ShowMessage('请选择盘点仓库！');
					Config.PopAudioContext(false);
					return;
				}
				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'AddLabelStockCheck',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.ProcessModel.FID,												
							FPackBarCode: Barcode,
							FStockId: this.WareHouseModel.FItemID,
							FStockPlaceId: 0,							
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
			            me.GenInventoryList();
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
			//获取选中的物料
			GetSelectMaterial(item){	
				//console.log(item);
				this.ProcessRecordModel = item;				
			},
			//修改物料数量
			ModifyMaterialQty:function(){
				this.OpenPopupWindow();
			},
			//新增物料
			AddMaterial:function(){
				if (this.SelectProcess == '') {
					Config.ShowMessage('请选择盘点方案！');
					Config.PopAudioContext(false);
					return;
				}								
				if(this.SelectWareHouse == ''){
					Config.ShowMessage('请选择盘点仓库！');
					Config.PopAudioContext(false);
					return;
				}
				
				uni.showLoading({
					title: 'Loading'
				});
				uni.navigateTo({
					url: '/pages/inventory/addmaterial?WareHouseModel=' + this.WareHouseModel +
					'&ProcessModel=' + this.ProcessModel
				});
				uni.hideLoading();
			},
			//切换盘点方案
			SwitchInventoryPlan:function(){
				this.GetSelectInventoryPlan();
				this.GetAllWareHouse();
				this.ClearWareHouse();
			},
			//获取选中的盘点方案
			GetSelectInventoryPlan:function(){
				this.ProcessModel = this.ProcessList.find(item => item.FProcessID == this.SelectProcess);
			},
			//获取所有盘点方案
			GetAllInventoryPlan:function(){
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetProcessListInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
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
						this.ProcessList = result.data.ResultData.GetProcessListInfo.data0;
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
			//清空仓库信息
			ClearWareHouse: function(){
				this.WareHouseModel = null;
				this.SelectWareHouse = '';
				this.ProcessRecordModel = null;
			},
			//切换仓库信息
			SwitchWareHouse: function(){
				this.GetSelectWareHouse();
				this.GenInventoryList();
			},
			//获取选中仓库信息
			GetSelectWareHouse: function(){
				this.WareHouseModel = this.WareHouseList.find(item => item.FName == this.SelectWareHouse);
			},
			//获取所有仓库信息
			GetAllWareHouse: function() {				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetStockByInvPlan',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FInvPlanId: this.ProcessModel.FID
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
						this.WareHouseList = result.data.ResultData.GetStockByInvPlan.data0;		
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
			},
			//获取盘点清单
			GenInventoryList: function(){	
				if(this.SelectProcess != '' && this.SelectWareHouse != ''){
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
								ProcessID: this.SelectProcess,
								FStockName: this.SelectWareHouse
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
							uni.hideLoading();
						}
					});
				}				
			},
			//打开弹窗
			OpenPopupWindow: function(){				
				let IsSuccess = this.CheckPopupWindow();
				if(IsSuccess == 0){
					return;
				}
				//this.$refs.fillqty.open();	
				this.SwitchIsOpenDigitKeyboard(true);
			},
			
			CheckPopupWindow: function(){
				if(this.ProcessRecordModel == null){
				   Config.ShowMessage('请选择要修改数量的物料！');
				   Config.PopAudioContext(false);
				   return 0;				
				}
				this.PopTitle = this.ProcessRecordModel.FMaterialNumber + '/' + this.ProcessRecordModel.FModel
			},
			//关闭弹窗
			ClosePopupWindowDirect: function(e){
				//console.log(this.$refs.fillqty);
				//this.$refs.fillqty.close();
				this.SwitchIsOpenDigitKeyboard(false);
				this.GetSelectMaterial(null);
			},
			//关闭弹窗
			ClosePopupWindow: function(e){
				//console.log(e);
				//this.$refs.fillqty.close();				
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
							FItemId: this.ProcessRecordModel.FItemID,
							FInventoryQty: this.ProcessRecordModel.FQty,
							FQty: e,
							FBillerID: uni.getStorageSync('FUserId'),
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
	.inventoryplantitle {					
		margin-left: -450upx;
		margin-top: 30upx;
		font-size: 20px;
	}
	
	.inventoryplan {		
		margin-left: 250upx;
		margin-top: -65upx;
		font-size: 20px;
	}
	
	.warehousetitle {
		margin-left: -450upx;
		margin-top: 50upx;
		font-size: 20px;
	}
	
	.warehouse {
		margin-left: 250upx;
		margin-top: -65upx;
		font-size: 20px;
	}
	
	.scrollviewinfo {
		width: 100%;
		height: 800upx;
	}
	
	.tablebill{
		width: 100%;
		height: 790upx;
		margin-top: 50upx;
	}
	
	.modifymaterialqty {
		width: 45%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 50upx;
		font-size: 20px;
	}
	
	.addmaterial {
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 480upx;
		margin-top: -110upx;
		font-size: 20px;
	}
</style>
